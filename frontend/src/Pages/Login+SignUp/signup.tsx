import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
// import { Container, Form, Col, Row } from 'react-bootstrap';
import { Container, Grid, TextField, Button, Typography } from "@mui/material";
// import Button from '@mui/material/Button'
import "./login.css";
import BasePage from "../../Components/Base_Page/base";

function Signup() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setmessage] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [PasswordMatch, setPasswordMatch] = useState<boolean | "empty">(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setIsAvailable(null);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  useEffect(() => {
    if (confirmPassword === "") {
      setPasswordMatch("empty");
    } else if (password === confirmPassword) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  }, [password, confirmPassword]);

  const handleCheckAvailability = () => {
    // Perform GET request to check username availability
    fetch(`http://127.0.0.1:8000/auth/check_username/${username}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.available);
        setIsAvailable(data.available);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error
      });
  };

  const check_params = () => {
    if (firstName === "") {
      return "Please Enter First Name";
    } else if (lastName === "") {
      return "Please Enter last Name";
    } else if (!isAvailable) {
      return "Please Check Username";
    } else if (email === "") {
      return "Please Enter Email";
    } else if (PasswordMatch !== true) {
      return "Passwords Don't Match";
    } else {
      return "success";
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const msg = check_params();
    setmessage(msg);
    if (msg !== "success") {
      return "failes";
    }
    const data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: password,
      confirmPassword: confirmPassword,
    };
    console.log(data);

    fetch("http://127.0.0.1:8000/auth/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        window.location.href = "/login";
        // Add redirection or further logic here
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error
      });

    // Reset fields after submission
    setFirstName("");
    setLastName("");
    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };
  const maincontent = (
    <div className="login_container mt-5" style={{ width: "60vw" }}>
      <Container>
        <Typography style={{ width: "100%", textAlign: "center" }} variant="h3">
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                className="m-3"
                id="formFirstName"
                label="First Name"
                variant="outlined"
                placeholder="Enter first name"
                value={firstName}
                onChange={handleFirstNameChange}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={9}>
                  <TextField
                    fullWidth
                    className="m-3"
                    id="formUsername"
                    label="Username"
                    variant="outlined"
                    placeholder="Enter username"
                    value={username}
                    onChange={handleUsernameChange}
                  />
                  {isAvailable !== null && username !== "" && (
                    <Typography
                      style={{ marginLeft: "0.8rem" }}
                      variant="subtitle2"
                    >
                      {isAvailable
                        ? "Username is available"
                        : "Username is not available"}
                    </Typography>
                  )}
                </Grid>
                <Grid container item xs={12} sm={3} alignItems="center">
                  <Button
                    variant="contained"
                    className="m-3"
                    size="small"
                    color="primary"
                    style={{ backgroundColor: "var(--Dark-green)" }}
                    onClick={handleCheckAvailability}
                  >
                    Check
                  </Button>
                </Grid>
              </Grid>

              <TextField
                fullWidth
                className="m-3"
                id="formPassword"
                label="Password"
                variant="outlined"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={handlePasswordChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                className="m-3"
                id="formLastName"
                label="Last Name"
                variant="outlined"
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={handleLastNameChange}
              />

              <TextField
                fullWidth
                className="m-3"
                id="formEmail"
                label="Email"
                variant="outlined"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={handleEmailChange}
              />

              <TextField
                fullWidth
                className="m-3"
                id="formConfirmPassword"
                label="Confirm Password"
                variant="outlined"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                style={
                  PasswordMatch === "empty"
                    ? { border: "none" }
                    : PasswordMatch
                    ? { boxShadow: "0px 0px 5px 2px green" }
                    : { boxShadow: "0px 0px 5px 2px red" }
                }
              />
            </Grid>
          </Grid>

          <Button className="submit_btn mt-4" type="submit">
            Sign Up
          </Button>
          {message !== "" && message !== "success" && (
            <Typography
              style={{ width: "100%", textAlign: "center" }}
              variant="subtitle1"
            >
              {message}
            </Typography>
          )}
        </form>
      </Container>
    </div>
  );
  return <BasePage maincontent={maincontent} signin={false} />;
}

export default Signup;
