import React from 'react';
import NavigationBar from '../Navbar/navbar';
import "./base.css"

const BasePage = ({ maincontent }) => {
    
    return (
      <div className="app" style={{display:'flex', flexDirection:'column'}}>
        <NavigationBar />
        <div className="maincontent_base" style={{width:"100%"}}>
          {maincontent}
        </div>

      </div>
    );



};

export default BasePage;