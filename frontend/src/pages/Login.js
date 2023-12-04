import React from 'react';
import './Login.css';
import LoginButton from '../components/LoginButton.js';

function Login() {
    return (
        <div className='Login'>
            <h1>Welcome to Khuranafy!</h1>
            <img src='khuranalogin.jpg' alt='Dean Khurana with headphones'/>
            <LoginButton />
        </div>
    )
}

export default Login;