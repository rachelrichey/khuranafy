import React, { useEffect, useState } from 'react';
import Home from '../pages/Home.js';

const LoginButton = () => {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
     // Retrieve access token from the session storage
     fetch('http://localhost:8888/session', { credentials: 'include' })
     .then(response => response.json())
     .then(sessionData => {
         const { access_token, refresh_token } = sessionData;
 
         if (access_token) {
             setAccessToken(access_token);
         }
         if (refresh_token) {
             setRefreshToken(refresh_token);
         }
     })
     .catch(error => console.error('Error fetching session data:', error));
  }, []);

  const handleRefreshToken = async () => {
    try {
      const response = await fetch(`http://localhost:8888/refresh_token?refresh_token=${refreshToken}`);
      const data = await response.json();
      setAccessToken(data.access_token);
      console.log(`New access token: ${data.access_token}`);
    } catch (error) {
      console.error(error);
      setError('Error refreshing token');
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {accessToken ? (
        <div id="logged-in">
          <Home />
          <button onClick={handleRefreshToken}>Get a New Token!</button>
        </div>
      ) : (
        <div id="login">
          <a href="http://localhost:8888/login">Log in with Spotify</a>
        </div>
      )}
    </div>
  );
};

export default LoginButton;
