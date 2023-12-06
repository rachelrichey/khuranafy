import React from 'react';
import './Login.css';
import LoginButton from '../components/LoginButton.js';

function Login() {
    return (
        <div className='Login'>
            <h1>Welcome to Khuranafy!</h1>
            <div className="image-container">
                <img id='khuranalogin' src={process.env.PUBLIC_URL + '/images/khuranalogin.jpg'} alt='Dean Khurana with headphones'/>
                <img id='spotifybar' src={process.env.PUBLIC_URL + '/images/spotifybar.PNG'} alt='Spotify track progress bar'/>
                <LoginButton />
            </div>
        </div>
    )
}

export default Login;