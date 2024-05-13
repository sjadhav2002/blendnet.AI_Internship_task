import React from 'react'
import "./home.css"
// import { useState, useEffect, useRef } from 'react';
import BasePage from '../../Components/Base_Page/base';

const Home: React.FC = () => {
    const maincontent: React.ReactNode = (
        <div>
            {/* Your main content */}
        </div>
    );

    return <BasePage maincontent={maincontent} signin={false} />;
}

export default Home;