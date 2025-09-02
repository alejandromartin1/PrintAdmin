import React, { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';

const Bandeja = () => {
  const [correo, setCorreo] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState(null);
  const [contenidoMensaje, setContenidoMensaje] = useState({ html: '', attachments: [] });
  const [nextPageToken, setNextPageToken] = useState(null);

  const fetchEmails = useCallback(async (pageToken = null) => {
    const token = localStorage.getItem('gmailToken');
    const correoGuardado = localStorage.getItem('correoGoogle');
    setCorreo(correoGuardado);

    if (!token) return;

    setCargando(true);

    try {
      const res = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=in:inbox&maxResults=20${pageToken ? `&pageToken=${pageToken}` : ''}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 401) {
        alert('La sesión ha expirado. Por favor inicia sesión nuevamente.');
        return;
      }

      const data = await res.json();
      const ids = data.messages || [];

      if (ids.length === 0 && !pageToken) {
        setMensajes([]);
        setCargando(false);
        return;
      }

      setNextPageToken(data.nextPageToken || null);

      const detalles = await Promise.all(
        ids.map(async (msg) => {
          const resMsg = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const dataMsg = await resMsg.json();
          const headers = dataMsg.payload.headers;

          const from = headers.find(h => h.name === 'From')?.value || 'Desconocido';
          const subject = headers.find(h => h.name === 'Subject')?.value || '(Sin asunto)';
          const date = headers.find(h => h.name === 'Date')?.value || '';
          const leido = !dataMsg.labelIds?.includes('UNREAD');

          return { id: msg.id, from, subject, date, leido };
        })
      );

      setMensajes(prev => pageToken ? [...prev, ...detalles] : detalles);
    } catch (error) {
      console.error("Error al obtener correos:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  const verMensaje = async (msg) => {
    setMensajeSeleccionado(msg);
    setContenidoMensaje({ html: '(Cargando...)', attachments: [] });

    const token = localStorage.getItem('gmailToken');
    try {
      const resMsg = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const dataMsg = await resMsg.json();

      let body = '';
      let attachments = [];

      const getHtmlBody = (payload) => {
        let htmlPart = null;

        const searchPart = (part) => {
          if (part.mimeType === 'text/html' && part.body?.data) {
            htmlPart = part.body.data;
            return;
          }
          if (part.parts) {
            part.parts.forEach(searchPart);
          }
        };

        searchPart(payload);

        return htmlPart;
      };

      const findAttachments = (parts) => {
        const files = [];
        for (let part of parts || []) {
          if (part.filename && part.filename.length > 0 && part.body?.attachmentId) {
            files.push({
              filename: part.filename,
              mimeType: part.mimeType,
              attachmentId: part.body.attachmentId
            });
          }
          if (part.parts) {
            files.push(...findAttachments(part.parts));
          }
        }
        return files;
      };

      body = getHtmlBody(dataMsg.payload);
      attachments = findAttachments(dataMsg.payload.parts || []);

      let decoded = '';
      if (body) {
        decoded = decodeURIComponent(
          escape(window.atob(body.replace(/-/g, '+').replace(/_/g, '/')))
        );
      } else {
        decoded = '(Sin contenido)';
      }

      setContenidoMensaje({ html: decoded, attachments });
    } catch (err) {
      console.error(err);
      setContenidoMensaje({ html: '(Error al obtener el contenido)', attachments: [] });
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const marcarLeido = (id) => {
    setMensajes(prev => prev.map(msg => msg.id === id ? { ...msg, leido: true } : msg));
  };

  // 🎨 Estilos blancos + grises elegantes
  const styles = {
    container: {
      padding: '3rem',
      marginLeft: '250px',
      fontFamily: "'Poppins', sans-serif",
      background: '#f9f9f9',
      minHeight: '100vh',
      color: '#222',
    },
    headerBar: {
      background: '#fff',
      padding: '2rem 3rem',
      marginBottom: '3rem',
      marginTop: '6rem', // 📍 más abajo
      borderRadius: '20px',
      boxShadow: '0 8px 22px rgba(0,0,0,0.1)',
      textAlign: 'center',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    title: {
      fontSize: '36px',
      fontWeight: '900',
      letterSpacing: '1.5px',
      marginBottom: '0.5rem',
      textShadow: '0 2px 10px rgba(0,0,0,0.25)',
      color: '#000',
    },
    subtitle: {
      fontSize: '16px',
      color: '#444',
      fontWeight: '500',
    },
    tableWrapper: {
      borderRadius: '18px',
      background: '#ffffff',
      boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
      padding: '2rem',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '16px',
      color: '#333',
    },
    thead: {
      backgroundColor: '#fff',
      borderBottom: '3px solid #000',
    },
    th: {
      padding: '16px',
      textAlign: 'center',
      color: '#000',
      fontWeight: '800',
      fontSize: '15px',
      textTransform: 'uppercase',
      letterSpacing: '1.2px',
    },
    tr: (leido) => ({
      backgroundColor: leido ? '#f5f5f5' : '#fff',
      borderBottom: '1px solid #ddd',
      cursor: 'pointer',
      transition: 'all 0.25s ease',
      fontWeight: leido ? '500' : '700',
      color: '#111',
    }),
    td: {
      padding: '14px',
      verticalAlign: 'middle',
      fontSize: '15px',
    },
    buttonLoadMore: {
      backgroundColor: '#000',
      color: '#fff',
      padding: '14px 36px',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '15px',
      marginTop: '2rem',
      boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
      transition: 'all 0.3s ease',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: '2.5rem 3rem',
      borderRadius: '20px',
      width: '65%',
      maxHeight: '85vh',
      overflowY: 'auto',
      position: 'relative',
      boxShadow: '0 18px 40px rgba(0,0,0,0.3)',
      fontFamily: "'Roboto', sans-serif",
      color: '#222',
    },
    closeButton: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#555',
    },
    modalHeader: {
      fontWeight: '700',
      fontSize: '28px',
      marginBottom: '1rem',
      color: '#000',
    },
    modalInfo: {
      fontSize: '15px',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#333',
    },
    hr: {
      margin: '1.5rem 0',
      borderColor: '#ddd',
    },
    attachmentsTitle: {
      marginTop: '1.4rem',
      fontWeight: '700',
      fontSize: '18px',
      color: '#000',
    },
    attachmentLink: {
      color: '#000',
      textDecoration: 'underline',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '15px',
    },
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&family=Roboto&display=swap" rel="stylesheet" />

      <div style={styles.container}>
        <div style={styles.headerBar}>
          <p style={styles.title}>📥 Correos Recibidos</p>
          <p style={styles.subtitle}>{correo ? `Conectado como: ${correo}` : 'No autenticado'}</p>
        </div>

        {cargando && mensajes.length === 0 ? (
          <p style={{ fontSize: '18px', color: '#555' }}>⏳ Cargando correos...</p>
        ) : mensajes.length === 0 ? (
          <p style={{ fontSize: '18px', color: '#555' }}>📭 No hay correos.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Remitente</th>
                  <th style={styles.th}>Asunto</th>
                  <th style={styles.th}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {mensajes.map(msg => (
                  <tr
                    key={msg.id}
                    style={styles.tr(msg.leido)}
                    onClick={() => {
                      verMensaje(msg);
                      marcarLeido(msg.id);
                    }}
                    title={`${msg.subject}`}
                  >
                    <td style={{ ...styles.td, textAlign: 'center', fontSize: '18px' }}>
                      {msg.leido ? '⚪' : '📩'}
                    </td>
                    <td style={styles.td}>{msg.from}</td>
                    <td style={styles.td}>{msg.subject}</td>
                    <td style={styles.td}>{new Date(msg.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {nextPageToken && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => fetchEmails(nextPageToken)}
              style={styles.buttonLoadMore}
            >
              Cargar más
            </button>
          </div>
        )}

        {mensajeSeleccionado && (
          <div style={styles.modalOverlay} onClick={() => setMensajeSeleccionado(null)}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
              <button onClick={() => setMensajeSeleccionado(null)} style={styles.closeButton}>
                <X size={28} />
              </button>

              <h3 style={styles.modalHeader}>📨 Vista previa</h3>
              <p style={styles.modalInfo}><strong>De:</strong> {mensajeSeleccionado.from}</p>
              <p style={styles.modalInfo}><strong>Asunto:</strong> {mensajeSeleccionado.subject}</p>
              <p style={styles.modalInfo}><strong>Fecha:</strong> {new Date(mensajeSeleccionado.date).toLocaleString()}</p>
              <hr style={styles.hr} />
              <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#333' }}
                dangerouslySetInnerHTML={{ __html: contenidoMensaje.html }}
              />

              {contenidoMensaje.attachments.length > 0 && (
                <div>
                  <h4 style={styles.attachmentsTitle}>📎 Adjuntos</h4>
                  <ul>
                    {contenidoMensaje.attachments.map((att, idx) => (
                      <li key={idx}>
                        <a
                          href="#"
                          style={styles.attachmentLink}
                          onClick={async (e) => {
                            e.preventDefault();
                            const token = localStorage.getItem('gmailToken');
                            const res = await fetch(
                              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${mensajeSeleccionado.id}/attachments/${att.attachmentId}`,
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            const data = await res.json();
                            const byteCharacters = atob(data.data.replace(/-/g, '+').replace(/_/g, '/'));
                            const byteArray = new Uint8Array(byteCharacters.split('').map(c => c.charCodeAt(0)));
                            const blob = new Blob([byteArray], { type: att.mimeType });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = att.filename;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                          }}
                        >
                          {att.filename}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Bandeja;



/*versión Outlook usando Microsoft Graph API


import React, { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';

const Bandeja = () => {
  const [correo, setCorreo] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState(null);
  const [contenidoMensaje, setContenidoMensaje] = useState('');

  const fetchEmails = useCallback(async () => {
    const token = localStorage.getItem('outlookToken');
    const correoGuardado = localStorage.getItem('correoOutlook');
    setCorreo(correoGuardado);

    if (!token) return;

    setCargando(true);
    try {
      const res = await fetch(
        "https://graph.microsoft.com/v1.0/me/messages?$top=20&$orderby=receivedDateTime DESC",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 401) {
        alert('La sesión ha expirado. Por favor inicia sesión nuevamente.');
        return;
      }

      const data = await res.json();
      const detalles = data.value.map(msg => ({
        id: msg.id,
        from: msg.from?.emailAddress?.address || "Desconocido",
        subject: msg.subject || "(Sin asunto)",
        date: msg.receivedDateTime,
        bodyPreview: msg.bodyPreview,
        leido: msg.isRead
      }));

      setMensajes(detalles);
    } catch (error) {
      console.error("Error al obtener correos:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  const verMensaje = async (msg) => {
    setMensajeSeleccionado(msg);
    setContenidoMensaje('(Cargando...)');

    const token = localStorage.getItem('outlookToken');
    try {
      const res = await fetch(
        `https://graph.microsoft.com/v1.0/me/messages/${msg.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const dataMsg = await res.json();
      setContenidoMensaje(dataMsg.body?.content || '(Sin contenido)');
    } catch (err) {
      console.error(err);
      setContenidoMensaje('(Error al obtener el contenido)');
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const styles = {
    container: { padding: '3rem', marginLeft: '250px', fontFamily: "'Poppins', sans-serif", background: '#f9f9f9', minHeight: '100vh', color: '#222' },
    headerBar: { background: '#fff', padding: '2rem 3rem', marginBottom: '3rem', marginTop: '6rem', borderRadius: '20px', boxShadow: '0 8px 22px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' },
    title: { fontSize: '36px', fontWeight: '900', marginBottom: '0.5rem', color: '#000' },
    subtitle: { fontSize: '16px', color: '#444', fontWeight: '500' },
    tableWrapper: { borderRadius: '18px', background: '#ffffff', boxShadow: '0 6px 18px rgba(0,0,0,0.12)', padding: '2rem' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '16px', color: '#333' },
    th: { padding: '16px', textAlign: 'center', color: '#000', fontWeight: '800' },
    tr: (leido) => ({ backgroundColor: leido ? '#f5f5f5' : '#fff', borderBottom: '1px solid #ddd', cursor: 'pointer', fontWeight: leido ? '500' : '700' }),
    td: { padding: '14px', fontSize: '15px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
    modalContent: { backgroundColor: '#fff', padding: '2.5rem 3rem', borderRadius: '20px', width: '65%', maxHeight: '85vh', overflowY: 'auto', position: 'relative', boxShadow: '0 18px 40px rgba(0,0,0,0.3)' },
    closeButton: { position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#555' }
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.headerBar}>
          <p style={styles.title}>📥 Correos de Outlook</p>
          <p style={styles.subtitle}>{correo ? `Conectado como: ${correo}` : 'No autenticado'}</p>
        </div>

        {cargando && mensajes.length === 0 ? (
          <p>⏳ Cargando correos...</p>
        ) : mensajes.length === 0 ? (
          <p>📭 No hay correos.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Remitente</th>
                  <th style={styles.th}>Asunto</th>
                  <th style={styles.th}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {mensajes.map(msg => (
                  <tr key={msg.id} style={styles.tr(msg.leido)} onClick={() => verMensaje(msg)}>
                    <td style={{ ...styles.td, textAlign: 'center', fontSize: '18px' }}>{msg.leido ? '⚪' : '📩'}</td>
                    <td style={styles.td}>{msg.from}</td>
                    <td style={styles.td}>{msg.subject}</td>
                    <td style={styles.td}>{new Date(msg.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {mensajeSeleccionado && (
          <div style={styles.modalOverlay} onClick={() => setMensajeSeleccionado(null)}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
              <button onClick={() => setMensajeSeleccionado(null)} style={styles.closeButton}>
                <X size={28} />
              </button>
              <h3>📨 Vista previa</h3>
              <p><strong>De:</strong> {mensajeSeleccionado.from}</p>
              <p><strong>Asunto:</strong> {mensajeSeleccionado.subject}</p>
              <p><strong>Fecha:</strong> {new Date(mensajeSeleccionado.date).toLocaleString()}</p>
              <hr />
              <div dangerouslySetInnerHTML={{ __html: contenidoMensaje }} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Bandeja;

*/