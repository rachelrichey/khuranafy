import React, { useEffect, useState } from 'react';

const PlaylistGenerator = ({ userTopTracksAudioFeatures, khuranaTracksAudioFeatures, accessToken }) => {
    const [refreshToken, setRefreshToken] = useState('');
    const [playlistUrl, setPlaylistUrl] = useState(null);
    //use the access token to access the API and send requests
    useEffect(() => {
        // Retrieve access token from the session storage
        fetch('http://localhost:8888/session', { credentials: 'include' })
        .then(response => response.json())
        .then(sessionData => {
            const { access_token, refresh_token } = sessionData;

            if (access_token) {
            }
            if (refresh_token) {
                setRefreshToken(refresh_token);
            }
        })
        .catch(error => console.error('Error fetching session data:', error));
    }, [accessToken]);

  useEffect(() => {
    const createPlaylist = async () => {
      try {
        // Create a new playlist using Spotify Web API
        const responseCreate = await fetch('https://api.spotify.com/v1/me/playlists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
          },
          body: JSON.stringify({
            name: 'Recommended Playlist',
            description: 'Your custom recommended playlist',
            public: true,
          }),
        });

        const dataCreate = await responseCreate.json();

        // dataCreate.id will contain the ID of the created playlist
        const playlistId = dataCreate.id;

        // Add tracks to the created playlist
        addTracksToPlaylist(playlistId);
        setPlaylistUrl(dataCreate.external_urls.spotify);
      } catch (error) {
        console.error('Error creating playlist:', error);
      }
    };

    const addTracksToPlaylist = async (playlistId) => {
      try {
        // Combine user and Khurana tracks or use any logic for recommended tracks
        const recommendedTracks = [...userTopTracksAudioFeatures, ...khuranaTracksAudioFeatures];

        // Extract track IDs
        const trackIds = recommendedTracks.map(track => track.id);

        // Add tracks to the playlist
        const responseAddTracks = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
          },
          body: JSON.stringify({
            uris: trackIds.map(id => `spotify:track:${id}`),
          }),
        });

        // Handle the response or perform any additional actions
        console.log('Playlist created successfully!');
      } catch (error) {
        console.error('Error adding tracks to playlist:', error);
      }
    };

    // Trigger playlist creation when the component mounts
    createPlaylist();
  }, [userTopTracksAudioFeatures, khuranaTracksAudioFeatures, accessToken]);

  return (
    <div>
      {playlistUrl ? (
        //if playlist is ready, render the link
        <h2>Your Khuranafy playlist: <a hred={playlistUrl} target="_blank" rel="noopener noreferrer">View Playlist</a></h2>
      ) : (
        //if not ready, render loading message
        <p>Generating your Khuranafy playlist...</p>
      )}
    </div>
  );
};

export default PlaylistGenerator;