import React, { useEffect, useState } from 'react';

const LoginButton = () => {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const getHashParams = () => {
        const params = new URLSearchParams(window.location.search);

        return params;
    };

    const params = getHashParams();
    const state = params.get('state');
    const code = params.get('code');

    const access_token = 'foo';
    const refresh_token = 'bar';

    if (error) {
      setError('There was an error during the authentication');
    } else {
      if (access_token) {
        setAccessToken(access_token);
        // You can add additional logic here if needed
      }
      if (refresh_token) {
        setRefreshToken(refresh_token);
        // You can add additional logic here if needed
      }
      console.log(params);
    }
  }, []);

  const handleRefreshToken = async () => {
    try {
      const response = await fetch(`/refresh_token?refresh_token=${refreshToken}`);
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
          <h1>Logged in with Authorization Flow!</h1>
          <button onClick={handleRefreshToken}>Get a New Token!</button>
        </div>
      ) : (
        <div id="login">
          <h1>Learning Authorization Flow Spotify</h1>
          <a href="http://localhost:8888/login">Log in with Spotify</a>
        </div>
      )}
    </div>
  );
};

export default LoginButton;
