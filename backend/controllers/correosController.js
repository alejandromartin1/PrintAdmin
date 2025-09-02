const { google } = require('googleapis');
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = require('./auth');

require('googleapis')

async function getCorreosPorCategoria(labelId, access_token, refresh_token) {
  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  oAuth2Client.setCredentials({ access_token, refresh_token });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  const res = await gmail.users.messages.list({
    userId: 'me',
    labelIds: [labelId],
    maxResults: 10,
  });

  if (!res.data.messages) return [];

  const messages = await Promise.all(res.data.messages.map(async (msg) => {
    const fullMsg = await gmail.users.messages.get({ userId: 'me', id: msg.id });
    const headers = fullMsg.data.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value || '';
    const from = headers.find(h => h.name === 'From')?.value || '';
    const to = headers.find(h => h.name === 'To')?.value || '';
    const snippet = fullMsg.data.snippet;

    return {
      id: msg.id,
      from,
      to,
      subject,
      snippet,
      leido: !fullMsg.data.labelIds.includes("UNREAD"),
    };
  }));

  return messages;
}

module.exports = { getCorreosPorCategoria };
