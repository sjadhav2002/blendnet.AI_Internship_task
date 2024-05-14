import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom'; // Make sure you have react-router-dom installed
import "./navbar.css"
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface NavigationBarProps {
  signin: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ signin }) => {

  const logout = (): void => {
    // Delete access and refresh tokens from sessionStorage
    sessionStorage.removeItem('access');
    sessionStorage.removeItem('refresh');
  
    fetch('http://127.0.0.1:8000/auth/logout/', {
      method: 'GET',
    })
    .then(response => {
      // Handle response if needed
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle error
    });
  };

  return (
          <AppBar sx={{ height: '10vh' , backgroundColor:'var(--Dark-green)'}} position="static">
            <Toolbar>
              {signin ?(
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
                  </Typography>
              ):(
                
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  <Button color="inherit" component={Link} to="/">Home</Button>
                </Typography>
              )}
              {signin ? (
                <div className='ext_links'>
                  <Button color="inherit" onClick={logout} component={Link} to="/">Logout</Button>
                </div>
              ) : (
                <div className='ext_links'>
                  <Button color="inherit" component={Link} to="/login">Login</Button>
                  <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
                </div>
              )}
            </Toolbar>
          </AppBar>
    // <Navbar expand="lg">
    //   <Navbar.Toggle aria-controls="basic-navbar-nav" />
    //     <Navbar.Collapse id="basic-navbar-nav">
    //       <Nav className='page-links' >
    //         {signin &&(
    //           <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
    //         )}
    //         {!signin &&(
    //           <Nav.Link as={Link} to="/">Home</Nav.Link>
    //         )}
    //       </Nav>
    //       <div className='ext_links' style={{ display: signin ? 'flex' : 'none' }}>
    //         <Nav.Link className='mob' as={Link} to="/account"><img src="assets/user.svg" alt="" style={{width:'40px'}}/></Nav.Link>
    //       </div>
    //       <div className='ext_links' style={{ display: signin ? 'none' : 'flex' }}>
    //         <Nav.Link className='mob' as={Link} to="/signup">Sign Up</Nav.Link>
    //         <Nav.Link className='mob' as={Link} to="/login">Login</Nav.Link>
    //       </div>
    //     </Navbar.Collapse>
    // </Navbar>
  );
};

export default NavigationBar;