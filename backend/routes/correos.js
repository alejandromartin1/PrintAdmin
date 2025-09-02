// backend/routes/correos.js
const express = require('express');
const router = express.Router();
const { google } = require('googleapis');

router.get('/correos-clasificados', async (req, res) => {
  const accessToken = req.query.access_token;
  if (!accessToken) return res.status(400).json({ error: 'Falta el token de acceso' });

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: 'v1', auth });

  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
      maxResults: 20,
    });

    const mensajes = response.data.messages || [];
    const categorias = {
      primary: [],
      promotions: [],
      social: []
    };

    for (const msg of mensajes) {
      const detail = await gmail.users.messages.get({ userId: 'me', id: msg.id });
      const labels = detail.data.labelIds || [];

      const correo = {
        id: msg.id,
        snippet: detail.data.snippet,
        subject: getHeader(detail.data.payload.headers, 'Subject'),
        from: getHeader(detail.data.payload.headers, 'From'),
        leido: !labels.includes("UNREAD"),
      };

      if (labels.includes("CATEGORY_PERSONAL")) {
        categorias.primary.push(correo);
      } else if (labels.includes("CATEGORY_PROMOTIONS")) {
        categorias.promotions.push(correo);
      } else if (labels.includes("CATEGORY_SOCIAL")) {
        categorias.social.push(correo);
      }
    }

    res.json(categorias);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener correos' });
  }
});

function getHeader(headers, name) {
  const found = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
  return found ? found.value : '';
}

module.exports = router;
