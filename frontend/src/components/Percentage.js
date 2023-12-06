import React, {useEffect, useState} from 'react';

const Percentage = () => {
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [userTopTracks, setUserTopTracks] = useState([]);
    const [khuranaTracks, setKhuranaTracks] = useState([]);
    const [userTopTracksAudioFeatures, setUserTopTracksAudioFeatures] = useState([]);
    const [khuranaTracksAudioFeatures, setKhuranaTracksAudioFeatures] = useState([]);
    const [similarityPercentage, setSimilarityPercentage] = useState(0);

    //make list of track IDs of current user
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

    useEffect(() => {
        fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50', {
        method: 'GET',
        headers: {
        'Authorization': 'Bearer' + accessToken,
        },
    })
        .then(response => response.json())
        .then(data => {
            //get track IDs from the data and store into an array
            const tracks = data.items.map(track => track.id);
            setUserTopTracks(tracks);
        })
        .catch(error => console.error('Error:', error));
    }, [accessToken]);

    useEffect(() => {
    // Fetch audio features for user's top tracks
    const fetchAudioFeatures = async (trackIds) => {
        const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + accessToken,
          },
        });
        const data = await response.json();
        return data.audio_features;
      };
  
      // Fetch and set audio features
      fetchAudioFeatures(userTopTracks.join(','))
        .then(audioFeatures => {
          // Calculate average danceability, energy, valence, etc.
          const totalTracks = audioFeatures.length;
          const averageDanceability = audioFeatures.reduce((sum, track) => sum + track.danceability, 0) / totalTracks;
          const averageEnergy = audioFeatures.reduce((sum, track) => sum + track.energy, 0) / totalTracks;
          const averageValence = audioFeatures.reduce((sum, track) => sum + track.valence, 0) / totalTracks;
        })
        .catch(error => console.error('Error fetching audio features:', error));
  }, [accessToken, userTopTracks]);
    //handle token refreshing?

    useEffect(() => {
        // Fetch and set tracks from Khurana playlists
        const playlistIds = ['40be701a204e4065', '5151163f0df2480a', '6fb00b3514044e88', '8761eeab09c343cd'];
        const khuranaTracks = [];
    
        const fetchAndExtractTrackIds = async (playlistId) => {
          const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + accessToken,
            },
          });
          const data = await response.json();
          const trackIds = data.items.map(track => track.track.id);
          khuranaTracks.push(...trackIds);
        };
    // Loop through each playlist and fetch track details
    Promise.all(playlistIds.map(playlistId => fetchAndExtractTrackIds(playlistId)))
      .then(() => {
        setKhuranaTracks(khuranaTracks);
      })
      .catch(error => console.error('Error fetching Khurana tracks:', error));
  }, [accessToken]);

  useEffect(() => {
    //fetch audio features of Khurana tracks
    const fetchKhuranaAudioFeatures = async () => {
        if (khuranaTracks.length === 0) {
            return;
        }

        const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${khuranaTracks.join(',')}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer' + accessToken,
            },
        });

        const data = await response.json();
        const audioFeatures = data.audio_features;

        //calc average features
        const totalTracks = audioFeatures.length;
        const averageDanceability = audioFeatures.reduce((sum, track) => sum + track.danceability, 0) / totalTracks;
      const averageEnergy = audioFeatures.reduce((sum, track) => sum + track.energy, 0) / totalTracks;
      const averageValence = audioFeatures.reduce((sum, track) => sum + track.valence, 0) / totalTracks;
    };

    fetchKhuranaAudioFeatures();
  }, [accessToken, khuranaTracks]);

  useEffect(() => {
    // Calculate similarity when both sets of audio features are available
    if (userTopTracksAudioFeatures.length > 0 && khuranaTracksAudioFeatures.length > 0) {
        const userAverageEnergy = userTopTracksAudioFeatures.reduce((sum, track) => sum + track.energy, 0) / userTopTracksAudioFeatures.length;
        const userAverageDanceability = userTopTracksAudioFeatures.reduce((sum, track) => sum + track.danceability, 0) / userTopTracksAudioFeatures.length;
        const userAverageValence = userTopTracksAudioFeatures.reduce((sum, track) => sum + track.valence, 0) / userTopTracksAudioFeatures.length;

        const khuranaAverageEnergy = khuranaTracksAudioFeatures.reduce((sum, track) => sum + track.energy, 0) / khuranaTracksAudioFeatures.length;
        const khuranaAverageDanceability = khuranaTracksAudioFeatures.reduce((sum, track) => sum + track.danceability, 0) / khuranaTracksAudioFeatures.length;
        const khuranaAverageValence = khuranaTracksAudioFeatures.reduce((sum, track) => sum + track.valence, 0) / khuranaTracksAudioFeatures.length;

        //use Euclidean distance to calculate distance between averages
        const distance = Math.sqrt(
            Math.pow(userAverageEnergy - khuranaAverageEnergy, 2) +
            Math.pow(userAverageDanceability - khuranaAverageDanceability, 2) +
            Math.pow(userAverageValence - khuranaAverageValence, 2)
          );
        
          //calc similarity
          const maxDistance = Math.sqrt(3);
          const similarityPercentage = ((maxDistance - distance) / maxDistance) * 100;
  }
}, [userTopTracksAudioFeatures, khuranaTracksAudioFeatures]);

  return (
    <h2>{ similarityPercentage }%</h2>
  );
};

export default Percentage;