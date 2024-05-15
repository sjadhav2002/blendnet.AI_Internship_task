import React from 'react'
import "./home.css"
// import { useState, useEffect, useRef } from 'react';
import BasePage from '../../Components/Base_Page/base';
import { Typography } from '@mui/material';

const Home: React.FC = () => {
    const maincontent: React.ReactNode = (
        <div>
            {/* Your main content */}
            <Typography variant="h6" component="div">
                Instructions<br />
                <ol>
                    <li>Complete the setup as said in Readme.md</li>
                    <li>Please use "127.0.0.1:3000" in search bar "localhost:3000" <strong>does not work</strong></li>
                    <li>Use login/signup in top navigation bar.</li>
                    <li>Once Signed in create a watchlist using "+" button besides My Watchlists</li>
                    <li>To Delete watchlists press edit icon and select watchlists to delete</li>
                    <li>To add company in watchlist click on the watchlist and click on edit button</li>
                    <li>To Logout Press the logout button</li>
                </ol>
            </Typography>
        </div>
    );

    return <BasePage maincontent={maincontent} signin={false} />;
}

export default Home;