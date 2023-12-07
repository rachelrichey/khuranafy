import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import express from 'express';
import session from 'express-session';
import querystring from 'querystring';
import fetch from 'node-fetch';
import path from 'path';
import crypto from 'crypto';
import cors from 'cors';
import { access } from 'fs';

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUrl = 'http://localhost:8888/callback';

const app = express();

const sessionKey = 'spotify_auth_state';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.static(path.join(__dirname, '/public')))
  .use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))
  .use(session({
    secret: sessionKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: app.get('env') === 'production' }
  }));

  // Helper functions
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const sha256 = (buffer) => {
    return crypto.createHash('sha256').update(buffer).digest();
  };

// Redirect to Spotify for authorization
app.get('/login', (req, res) => {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = sha256(codeVerifier).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  // Store codeVerifier in user session
  req.session.codeVerifier = codeVerifier;

  const scope = 'user-read-private user-read-email user-top-read ';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUrl,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge
    }));
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
  
    // Retrieve stored codeVerifier
    const codeVerifier = req.session.codeVerifier;
  
    const authOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUrl,
        client_id: clientId,
        code_verifier: codeVerifier
      })
    };
  
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
      const data = await response.json();
  
      // Store access token in user's session and redirect back to the main page
      req.session.accessToken = data.access_token;
      req.session.refreshToken = data.refresh_token;
  
      req.session.save(err => {
          if (err) {
            // handle error
            console.error('Session save error:', err);
            res.redirect('/error');
          } else {
            console.log('Session saved. Redirecting to home page.')
            res.redirect('http://localhost:3000/');
          }
      });
    } catch (error) {
      console.error('Error during token exchange:', error);
      res.redirect('/error'); // Redirect to an error page or handle differently
    }
});

// Refresh token
app.get('/refresh_token', async (req, res) => {
  const refresh_token = req.query.refresh_token;
  const authOptions = {
      method: 'POST',
      headers: {
          'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
          'content-type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
  };

  // Log the request details
  console.log('Requesting Spotify token with the following options:', authOptions);

  fetch('https://accounts.spotify.com/api/token', authOptions)
      .then(response => {
          // Log the response status
          console.log('Response status:', response.status, response.statusText);

          // Log the full response body for debugging
          return response.text().then(text => {
              console.log('Response body:', text);
              return JSON.parse(text); // Parse the JSON in the response
          });
      })
      .then(data => {
          if (data.error) {
              console.error('Error in response:', data.error);
              res.status(400).send(data.error);
          } else {
              const access_token = data.access_token;
              const refresh_token = data.refresh_token;

              // Update tokens
              req.session.accessToken = access_token;
              req.session.refreshToken = refresh_token;
              
              // Send new access token back to client
              res.send({ access_token, refresh_token });
          }
      })
      .catch(error => {
          console.error('Fetch error:', error);
          res.status(500).send('Internal Server Error');
      });
});

// Retrieve tokens from session storage
app.get('/session', (req, res) => {
    res.json({
        access_token: req.session.accessToken,
        refresh_token: req.session.refreshToken
    });
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});