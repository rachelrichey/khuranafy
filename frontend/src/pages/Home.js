import React from 'react';
import './Home.css';
import Percentage from '../components/Percentage';

function Home() {
    return (
        <div className ="Home">
            <h1>Khuranafy</h1>
            <p>*user name* and Dean Khurana's taste match is...</p>
            <h1>{ Percentage }</h1>
        </div>
    )
}

export default Home;