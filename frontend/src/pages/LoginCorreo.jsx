import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginCorreo = () => {
  const navigate = useNavigate();

  const CLIENT_ID = "79251556591-82p8lfapmnk56mo2q82ismu5a8sioml9.apps.googleusercontent.com";
  const REDIRECT_URI = "http://localhost:3000/login-correo";
  const SCOPE = "https://www.googleapis.com/auth/gmail.readonly";
  const RESPONSE_TYPE = "token";

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const token = params.get('access_token');

      if (token) {
        localStorage.setItem('gmailToken', token);

        fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`)
          .then(res => res.json())
          .then(data => {
            localStorage.setItem('correoGoogle', data.email);
            navigate('/bandeja');
          })
          .catch(err => {
            console.error(err);
            alert('Error al obtener información del usuario.');
          });
      }
    } else {
      // Si no hay token todavía, iniciar login automáticamente
      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}&include_granted_scopes=true&prompt=consent`;
      window.location.href = url;
    }
  }, [navigate]);

  return null;
};

export default LoginCorreo;


/* versión Outlook con Microsoft OAuth2
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginCorreo = () => {
  const navigate = useNavigate();

  const CLIENT_ID = "TU_CLIENT_ID_DE_AZURE"; // ⚡ Copia desde Azure App Registration
  const REDIRECT_URI = "http://localhost:3000/login-correo";
  const SCOPE = "openid profile offline_access https://graph.microsoft.com/Mail.Read";
  const RESPONSE_TYPE = "token";

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const token = params.get('access_token');

      if (token) {
        localStorage.setItem('outlookToken', token);

        fetch("https://graph.microsoft.com/v1.0/me", {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            localStorage.setItem('correoOutlook', data.userPrincipalName);
            navigate('/bandeja');
          })
          .catch(err => {
            console.error(err);
            alert('Error al obtener información del usuario.');
          });
      }
    } else {
      const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}&response_mode=fragment`;
      window.location.href = url;
    }
  }, [navigate]);

  return null;
};

export default LoginCorreo;
*/