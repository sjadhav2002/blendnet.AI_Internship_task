import React from 'react'
import "./dashboard.css"
// import { useState, useEffect, useRef } from 'react';
import BasePage from '../../Components/Base_Page/base';

const Dashboard: React.FC = () => {
    const maincontent = (
        <div>
        
        </div>
    )
    return <BasePage maincontent={maincontent} signin={true} />;
}

export default Dashboard;