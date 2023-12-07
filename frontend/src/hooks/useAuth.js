// Hook to easily access user's access token and refresh token
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');  
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '');
  
  const serverURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_SERVER : process.env.REACT_APP_PROD_SERVER;

  useEffect(() => {
    // Fetch tokens only if not present in localStorage
    if (!accessToken || !refreshToken) {
      fetch(`${serverURL}/session`, { credentials: 'include' })
        .then(response => response.json())
        .then(sessionData => {
          const { access_token, refresh_token } = sessionData;
          if (access_token) {
            setAccessToken(access_token);
            localStorage.setItem('accessToken', access_token);
          }
          if (refresh_token) {
            setRefreshToken(refresh_token);
            localStorage.setItem('refreshToken', refresh_token);
          }
        })
        .catch(error => console.error('Error fetching session data:', error));
    }
  }, [accessToken, refreshToken, serverURL]);

  const refreshAccessToken = async () => {
    console.log('Refreshing access token...');
    try {
      const response = await fetch(`${serverURL}/refresh_token?refresh_token=${refreshToken}`);
      const data = await response.json();

      setAccessToken(data.access_token);
      localStorage.setItem('accessToken', data.access_token);

      if (data.refresh_token) {
        setRefreshToken(data.refresh_token);
        localStorage.setItem('refreshToken', data.refresh_token);
      }
      return data.access_token;
    } catch (error) {
      console.error(error);
    }
  };

  return { accessToken, refreshToken, refreshAccessToken };
}

export default useAuth;
