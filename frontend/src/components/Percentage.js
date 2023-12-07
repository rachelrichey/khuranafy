import React, {useEffect, useState} from 'react';
import useAuth from '../hooks/useAuth';

const Percentage = () => {
    // const [userTopTracks, setUserTopTracks] = useState([]);
    // const [khuranaTracks, setKhuranaTracks] = useState([]);
    // const [userTopTracksAudioFeatures, setUserTopTracksAudioFeatures] = useState([]);
    // const [khuranaTracksAudioFeatures, setKhuranaTracksAudioFeatures] = useState([]);
    // const [similarityPercentage, setSimilarityPercentage] = useState(0);

   const {accessToken, refreshAccessToken} = useAuth();

   //useEffect(() => {
    // const fetchTopTracks = async () => {
    //   fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50', {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': 'Bearer ' + accessToken,
    //     },
    //   })
    //   .then(response => response.json())
    //   .then(data => async () => {
    //       if (data.error && data.error.status === 401) {
    //         const newAccessToken = await refreshAccessToken();

    //         if (newAccessToken) {
    //           return fetchTopTracks(); // Refetch with new token
    //         }
    //       }
    //       //get track IDs from the data and store into an array
    //       const tracks = data.items.map(track => track.id);
    //       setUserTopTracks(tracks);
    //   })
    //   .catch(error => {
    //     console.error('Error:', error)
    //   });
    // };

    // fetchTopTracks(); // Call the function to initiate the fetching
//}, [accessToken]);

  //   useEffect(() => {
  //   // Fetch audio features for user's top tracks
  //   const fetchAudioFeatures = async () => {
  //       const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${userTopTracks.join(',')}`, {
  //         method: 'GET',
  //         headers: {
  //           'Authorization': 'Bearer ' + accessToken,
  //         },
  //       });
  //       const data = await response.json();
  //       return data.audio_features;
  //     };
  
  //     // Fetch and set audio features
  //     fetchAudioFeatures()
  //       .then(audioFeatures => {
  //         // Calculate average danceability, energy, valence, etc.
  //         const totalTracks = audioFeatures.length;
  //         const averageDanceability = audioFeatures.reduce((sum, track) => sum + track.danceability, 0) / totalTracks;
  //         const averageEnergy = audioFeatures.reduce((sum, track) => sum + track.energy, 0) / totalTracks;
  //         const averageValence = audioFeatures.reduce((sum, track) => sum + track.valence, 0) / totalTracks;
  //       })
  //       .catch(error => console.error('Error fetching audio features:', error));
  // }, [accessToken, userTopTracks]);

    // useEffect(() => {
    //     // Fetch and set tracks from Khurana playlists
    //     const playlistIds = ['3RB7otXcQQ6MaNIugy21FO', '5k914gSbIe4OUgxMspChey', '7iVWp18nC96ptFPD9lPMmw', '3ZsiOJ9IEWM3FshL04hRIu'];
    //     const khuranaTracks = [];
    
    //     const fetchAndExtractTrackIds = async (playlistId) => {
    //       const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    //         method: 'GET',
    //         headers: {
    //           'Authorization': 'Bearer ' + accessToken,
    //         },
    //       });
    //       const data = await response.json();
    //       const trackIds = data.items.map(track => track.track.id);
    //       khuranaTracks.push(...trackIds);
    //     };
    // // Loop through each playlist and fetch track details
    // Promise.all(playlistIds.map(playlistId => fetchAndExtractTrackIds(playlistId)))
    //   .then(() => {
    //     setKhuranaTracks(khuranaTracks);
    //   })
    //   .catch(error => console.error('Error fetching Khurana tracks:', error));
  //}, [accessToken]);

  // useEffect(() => {
  //   //fetch audio features of Khurana tracks
  //   const fetchKhuranaAudioFeatures = async () => {
  //       if (khuranaTracks.length === 0) {
  //           return;
  //       }

  //       const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${khuranaTracks.join(',')}`, {
  //           method: 'GET',
  //           headers: {
  //               'Authorization': 'Bearer ' + accessToken,
  //           },
  //       });

  //       const data = await response.json();
  //       const audioFeatures = data.audio_features;

  //       //calc average features
  //       const totalTracks = audioFeatures.length;
  //       const averageDanceability = audioFeatures.reduce((sum, track) => sum + track.danceability, 0) / totalTracks;
  //       const averageEnergy = audioFeatures.reduce((sum, track) => sum + track.energy, 0) / totalTracks;
  //       const averageValence = audioFeatures.reduce((sum, track) => sum + track.valence, 0) / totalTracks;
  //   };

  //   fetchKhuranaAudioFeatures();
  // }, [accessToken, khuranaTracks]);

//   useEffect(() => {
//     // Calculate similarity when both sets of audio features are available
//     if (userTopTracksAudioFeatures.length > 0 && khuranaTracksAudioFeatures.length > 0) {
//         const userAverageEnergy = userTopTracksAudioFeatures.reduce((sum, track) => sum + track.energy, 0) / userTopTracksAudioFeatures.length;
//         const userAverageDanceability = userTopTracksAudioFeatures.reduce((sum, track) => sum + track.danceability, 0) / userTopTracksAudioFeatures.length;
//         const userAverageValence = userTopTracksAudioFeatures.reduce((sum, track) => sum + track.valence, 0) / userTopTracksAudioFeatures.length;

//         const khuranaAverageEnergy = khuranaTracksAudioFeatures.reduce((sum, track) => sum + track.energy, 0) / khuranaTracksAudioFeatures.length;
//         const khuranaAverageDanceability = khuranaTracksAudioFeatures.reduce((sum, track) => sum + track.danceability, 0) / khuranaTracksAudioFeatures.length;
//         const khuranaAverageValence = khuranaTracksAudioFeatures.reduce((sum, track) => sum + track.valence, 0) / khuranaTracksAudioFeatures.length;

//         //use Euclidean distance to calculate distance between averages
//         const distance = Math.sqrt(
//             Math.pow(userAverageEnergy - khuranaAverageEnergy, 2) +
//             Math.pow(userAverageDanceability - khuranaAverageDanceability, 2) +
//             Math.pow(userAverageValence - khuranaAverageValence, 2)
//           );
        
//           //calc similarity
//           const maxDistance = Math.sqrt(3);
//           const similarityPercentage = ((maxDistance - distance) / maxDistance) * 100;
//           console.log(similarityPercentage);
//   }
// }, [userTopTracksAudioFeatures, khuranaTracksAudioFeatures]);

  const serverURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_SERVER : process.env.REACT_APP_PROD_SERVER;
  const [similarityPercentage, setSimilarityPercentage] = useState(0);

  useEffect(() => {
    fetch(`${serverURL}/percentage?access_token=${accessToken}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setSimilarityPercentage(data.similarityPercentage)
      })
  }, [accessToken]);

  return (
    <h2>{ similarityPercentage }%</h2>
  );
};
export default Percentage;