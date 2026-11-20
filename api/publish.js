import crypto from 'node:crypto';

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a || ''), 'utf8');
  const bufB = Buffer.from(String(b || ''), 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const githubToken = process.env.GITHUB_TOKEN;

  if (!adminPassword) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD no está configurado en Vercel.' });
  }

  const { action, password, catalog } = req.body || {};

  if (!password || !safeEqual(password, adminPassword)) {
    return res.status(401).json({ error: 'Contraseña de administrador incorrecta.' });
  }

  if (action === 'login') {
    return res.status(200).json({ ok: true });
  }

  if (action === 'publish') {
    if (!githubToken) {
      return res.status(500).json({ error: 'GITHUB_TOKEN no está configurado en Vercel.' });
    }
    if (!catalog || typeof catalog !== 'object') {
      return res.status(400).json({ error: 'Datos de catálogo inválidos.' });
    }

    try {
      const apiBase = 'https://api.github.com/repos/brayancortes22/ecocaff-huila/contents/public/catalog.json';
      const headers = {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      };

      const getRes = await fetch(apiBase, { headers });
      if (!getRes.ok) {
        return res.status(502).json({ error: 'No se pudo consultar public/catalog.json en GitHub.' });
      }
      const fileData = await getRes.json();
      const jsonText = JSON.stringify(catalog, null, 2);
      const encodedContent = Buffer.from(jsonText, 'utf8').toString('base64');

      const putRes = await fetch(apiBase, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: 'chore(cms): publish site updates from secure admin panel',
          content: encodedContent,
          sha: fileData.sha,
          branch: 'main'
        })
      });

      if (!putRes.ok) {
        return res.status(502).json({ error: 'Error al guardar cambios en GitHub.' });
      }

      return res.status(200).json({ ok: true, message: 'Publicado en GitHub. Vercel actualizará la web en ~25 segundos.' });
    } catch {
      return res.status(500).json({ error: 'Error interno al publicar.' });
    }
  }

  return res.status(400).json({ error: 'Acción no reconocida.' });
}
