// getAudioFeatures.js

import fetch from 'node-fetch';
import fs from 'fs';

const fetchAudioFeatures = async (trackIds, accessToken) => {
  const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
    },
  });

  // Log the response status
  console.log(response.status, response.statusText);
  const data = await response.json();

  return data.audio_features;
};

const calculateAverages = (audioFeatures) => {
  const totalTracks = audioFeatures.length;
  const averageDanceability = audioFeatures.reduce((sum, track) => sum + track.danceability, 0) / totalTracks;
  const averageEnergy = audioFeatures.reduce((sum, track) => sum + track.energy, 0) / totalTracks;
  const averageValence = audioFeatures.reduce((sum, track) => sum + track.valence, 0) / totalTracks;

  console.log('Total Tracks:', totalTracks);
  console.log('Average Danceability:', averageDanceability);
  console.log('Average Energy:', averageEnergy);
  console.log('Average Valence:', averageValence);
};

const runScript = async () => {
  try {
    // Read track IDs from file
    const rawData = fs.readFileSync('trackIds.json');
    const trackIds = JSON.parse(rawData);
    const khuranaTracks = trackIds.items.map(item => item.track.id).slice(0, 95);

    console.log("TRACKS LENGTH", khuranaTracks.length);

    // Replace 'YOUR_ACCESS_TOKEN' with your actual Spotify access token
    const accessToken = 'BQC-ya3Iamh4eq1ZDTyKmphH4KofQdu0g5x10-iWoPOSjidvckUWtKJ5GlDP0SCe5I_dFLGF6COKIqGEUhQHssu8c7JM_BC2rPk_AOYURgGl6dIQIPQw95LqWnvdt2juuv9BP7WiFQoHwx-uz0lTLEenUXKBcd4c_Xf9UPFYi1yk7Xaa-aqvlOIO8Poi456wznhMY-dD219o0H7up1N0lYRFwdo';

    // Fetch audio features
    const audioFeatures = await fetchAudioFeatures(khuranaTracks, accessToken);

    // Calculate and log averages
    calculateAverages(audioFeatures);

  } catch (error) {
    console.error('Error:', error);
  }
};

// Run the script
runScript();
