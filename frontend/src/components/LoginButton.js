import { useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import Home from '../pages/Home.js';

const LoginButton = () => {
  const { accessToken, refreshAccessToken } = useAuth();
  const [error, setError] = useState('');

  const serverURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_SERVER : process.env.REACT_APP_PROD_SERVER;

  return (
    <div>
      {error && <p>{error}</p>}
      {accessToken ? (
        <div id="logged-in">
          <Home />
          <button onClick={refreshAccessToken}>Get a New Token!</button>
        </div>
      ) : (
        <div id="login">
          <a href={`${serverURL}/login`}>Log in with Spotify</a>
        </div>
      )}
    </div>
  );
};

export default LoginButton;
