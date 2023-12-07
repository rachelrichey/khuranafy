import React from 'react';
import './Home.css';
import Percentage from '../components/Percentage';
import PlaylistGenerator from '../components/PlaylistGenerator.js';
import UserImage from '../components/UserImage.js';
import useAuth from '../hooks/useAuth';

function Home() {
    const {accessToken} = useAuth();

    return (
        <div className ="Home">
            <h1>Khuranafy</h1>
            {/* <UserImage accessToken={accessToken} />
            <p>*user name* and Dean Khurana's taste match is...</p> */}
            < Percentage />
            {/* <p>< PlaylistGenerator /></p> */}
        </div>
    )
}

export default Home;