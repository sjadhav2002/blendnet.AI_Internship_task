import "./login.css"
// import { useState, useEffect, useRef } from 'react';
import BasePage from '../../Components/Base_Page/base';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';


const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [failed, setFailed] = useState<boolean>(false);

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      username: username,
      password: password
    };

    fetch('http://127.0.0.1:8000/auth/signin/', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const access_token = data["access"];
        const refresh_token = data["refresh"];
        window.sessionStorage.setItem("access", access_token)
        window.sessionStorage.setItem("refresh", refresh_token)

        window.location.href = '/dashboard';
        // Add redirection or further logic here
      }).catch(error => {
        console.error('Error:', error);
        setFailed(true);
      });
  };


  const maincontent: JSX.Element = (
    <div className="login_container">
      <Container>
        <Typography variant="h3" style={{ width: '100%', textAlign: 'center', color: 'black' }}>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            className='mt-2'
            id="formUsername"
            label="Username"
            variant="outlined"
            placeholder="Enter username"
            value={username}
            onChange={handleUsernameChange}
          />
          <TextField
            fullWidth
            className='mt-2'
            id="formPassword"
            label="Password"
            variant="outlined"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <Button
            className="submit_btn mt-4"
            type="submit"
            variant="contained"
          >
            Submit
          </Button>
        </form>
        {failed && (
          <Typography variant="body1" style={{ color: 'red', width: '100%', textAlign: 'center' }}>Wrong Pasword/Username Please Retry!</Typography>
        )}
      </Container>
    </div>
  )
  return <BasePage maincontent={maincontent} signin={false} />;
}

export default Login;