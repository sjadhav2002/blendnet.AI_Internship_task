import React from 'react';
import { Navbar, Nav} from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Make sure you have react-router-dom installed
import "./navbar.css"

const NavigationBar = ({signin}) => {
  
  return (
    <Navbar expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className='page-links' >
            <Nav.Link as={Link} to="/">Home</Nav.Link>
          </Nav>
          <div className='ext_links' style={{ display: signin ? 'flex' : 'none' }}>
            <Nav.Link className='mob' as={Link} to="/account"><img src="assets/user.svg" alt="" style={{width:'40px'}}/></Nav.Link>
          </div>
          <div className='ext_links' style={{ display: signin ? 'none' : 'flex' }}>
            <Nav.Link className='mob' as={Link} to="/signup">Sign Up</Nav.Link>
            <Nav.Link className='mob' as={Link} to="/login">Login</Nav.Link>
          </div>
        </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;