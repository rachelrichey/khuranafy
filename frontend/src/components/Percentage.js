import React from 'react';

//PART 1: MAKE LIST OF TRACK IDS OF CURRENT USER
//figure out how to refer to access token in the code?
//const accessToken = '';
//fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50', {
//method: 'GET',
//headers: {
   //'Authorization': 'Bearer' + accessToken,
//},
//})
//.then(response => response.json())
//.then(data => {
    //get track IDs from the data and store into an array
    //const userTopTracks = data.items.map(track => track.id);
//})
//.catch(error => console.error('Error:', error));
//convert array to comma seperated string
//const userTracksString = userTopTracks.join(',');

//async function fetchAudioFeatures(trackIds) {
    //const response = await fetch('https://api.spotify.com/v1/audio-features?ids=${trackIds}', {
        //method: 'GET',
        //headers: {
            //'Authorization': 'Bearer' + accessToken,
        //},
    //});
    //const data = await response.json();
    //return data.audio.features;
//}
//const audioFeatures = await fetchAudioFeatures(userTracksString);
//calc average danceability, energy, etc.
//const totalTracks = audioFeatures.length;
//const averageDanceability = audioFeatures.reduce((sum, track) => sum + track.danceability, 0) / totalTracks;
//const averageEnergy = audioFeatures.reduce((sum, track) => sum + track.energy, 0) / totalTracks;
//const averageValence = audioFeatures.reduce((sum, track) => sum + track.valence, 0) / totalTracks;

//handle token refreshing?

//PART 2: MAKE LIST OF TRACK IDS OF 4 MOST RECENT KHURANA PLAYLISTS
//const playlistIds = ['40be701a204e4065', '5151163f0df2480a', '6fb00b3514044e88', '8761eeab09c343cd'];
//const khuranaTracks = [];
//async function fetchAndExtractTrackIds(playlistId) {
    //const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        //method: 'GET';
        //headers: {
            //'Authorization': 'Bearer' + accessToken,
        //},
    //});
    //const data = await response.json();
    //const trackIds = data.items.map(track => track.track.id);
    //khuranaTracks.push(...trackIds);
//}
//loop through each playlist and fetch track details
//for (const playlistId of playlistIds) {
    //await fetchAndExtractTrackIds(playlistId);
//}