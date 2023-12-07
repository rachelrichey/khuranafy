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
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
      },
      body: `grant_type=refresh_token&refresh_token=${refresh_token}`
    };
  
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    const data = await response.json();

    const { access_token, refresh_token } = data

    req.session.accessToken = access_token
    req.session.refreshToken = refresh_token
    
    res.send({
      'access_token': data.access_token,
      'refresh_token': data.refresh_token // Only send if refresh_token is present in the response
    });
  } catch (error) {
    console.error('Error during token refresh:', error);
    res.status(500).send('Error refreshing token');
  }
});

// Retrieve tokens from session storage
app.get('/session', (req, res) => {
    res.json({
        access_token: req.session.accessToken,
        refresh_token: req.session.refreshToken
    });
});

app.get('/percentage', async (req, res) => {
  let tracks = []
  let accessToken = req.query.access_token

  const fetchTopTracks = async () => {
    fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    })
    .then(response => response.json())
    .then(data => async () => {
        if (data.error && data.error.status === 401) {
          const newAccessToken = await refreshAccessToken();

          if (newAccessToken) {
            accessToken = newAccessToken
            return fetchTopTracks(); // Refetch with new token
          }
        }
        //get track IDs from the data and store into an array
        const tracks = data.items.map(track => track.id);
        return tracks
    })
    .catch(error => {
      console.error('Error:', error)
    });
  };

  tracks = await fetchTopTracks();

  const fetchAudioFeatures = async (tracks) => {
    const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${tracks.join(',')}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    });
    const data = await response.json();
    return data.audio_features;
  };

  // Fetch and set audio features
  let totalTracks = 0;
  let averageDanceability = 0;
  let averageEnergy = 0;
  let averageValence = 0;

  await fetchAudioFeatures(tracks)
    .then(audioFeatures => {
      // Calculate average danceability, energy, valence, etc.
      totalTracks = audioFeatures.length;
      averageDanceability = audioFeatures.reduce((sum, track) => sum + track.danceability, 0) / totalTracks;
      averageEnergy = audioFeatures.reduce((sum, track) => sum + track.energy, 0) / totalTracks;
      averageValence = audioFeatures.reduce((sum, track) => sum + track.valence, 0) / totalTracks;
    })
    .catch(error => console.error('Error fetching audio features:', error));

    // Fetch and set tracks from Khurana playlists
    const playlistIds = ['3RB7otXcQQ6MaNIugy21FO', '5k914gSbIe4OUgxMspChey', '7iVWp18nC96ptFPD9lPMmw', '3ZsiOJ9IEWM3FshL04hRIu'];
    const khuranaTracks = [];

    async function fetchAndExtractTrackIds(playlists) {
      for (let i = 0; i < playlists.length; i++) {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlists[i]}/tracks`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + accessToken,
          },
        });
        const data = await response.json();

        console.log('DATA: ', data)
        const trackIds = data.items.map(track => track.track.id);
        khuranaTracks.push(...trackIds);
      }
    };
    
    // Loop through each playlist and fetch track details
    await fetchAndExtractTrackIds(playlistIds);

    let kTotalTracks = 0;
    let kAverageDanceability = 0;
    let kAverageEnergy = 0;
    let kAverageValence = 0;

    const fetchKhuranaAudioFeatures = async () => {
      if (khuranaTracks.length === 0) {
          return;
      }

      const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${khuranaTracks.join(',')}`, {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + accessToken,
          },
      });

      const data = await response.json();
      const audioFeatures = data.audio_features;
      kTotalTracks = audioFeatures.length;
      kAverageDanceability = audioFeatures.reduce((sum, track) => sum + track.danceability, 0) / totalTracks;
      kAverageEnergy = audioFeatures.reduce((sum, track) => sum + track.energy, 0) / totalTracks;
      kAverageValence = audioFeatures.reduce((sum, track) => sum + track.valence, 0) / totalTracks;
  };

  await fetchKhuranaAudioFeatures();

  // Calculate similarity when both sets of audio features are available
  if (tracks.length > 0 && khuranaTracks.length > 0) {
    // const userAverageEnergy = userTopTracksAudioFeatures.reduce((sum, track) => sum + track.energy, 0) / userTopTracksAudioFeatures.length;
    // const userAverageDanceability = userTopTracksAudioFeatures.reduce((sum, track) => sum + track.danceability, 0) / userTopTracksAudioFeatures.length;
    // const userAverageValence = userTopTracksAudioFeatures.reduce((sum, track) => sum + track.valence, 0) / userTopTracksAudioFeatures.length;

    // const khuranaAverageEnergy = khuranaTracksAudioFeatures.reduce((sum, track) => sum + track.energy, 0) / khuranaTracksAudioFeatures.length;
    // const khuranaAverageDanceability = khuranaTracksAudioFeatures.reduce((sum, track) => sum + track.danceability, 0) / khuranaTracksAudioFeatures.length;
    // const khuranaAverageValence = khuranaTracksAudioFeatures.reduce((sum, track) => sum + track.valence, 0) / khuranaTracksAudioFeatures.length;

    //use Euclidean distance to calculate distance between averages
    const distance = Math.sqrt(
        Math.pow(averageEnergy - kAverageEnergy, 2) +
        Math.pow(averageDanceability - kAverageDanceability, 2) +
        Math.pow(averageValence - kAverageValence, 2)
      );
    
      //calc similarity
      const maxDistance = Math.sqrt(3);
      const similarityPercentage = ((maxDistance - distance) / maxDistance) * 100;
      
      res.send({
        'similarityPercentage': similarityPercentage
      })
  }
})

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});