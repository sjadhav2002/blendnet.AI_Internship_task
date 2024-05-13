import React from 'react';
import NavigationBar from '../Navbar/navbar';
import "./base.css"


interface BasePageProps {
  maincontent: React.ReactNode;
  signin: boolean;
}

const BasePage: React.FC<BasePageProps> = ({ maincontent, signin }) => {
    
    return (
      <div className="app" style={{display:'flex', flexDirection:'column'}}>
        <NavigationBar signin={signin}/>
        <div className="maincontent_base" style={{width:"100%"}}>
          {maincontent}
        </div>

      </div>
    );



};

export default BasePage;