import React, { useContext, useState } from 'react';
import { Button, TextField, Box, Typography, Container, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Modal, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import logo from "../assets/LOGO.jpg";
import ThemeColorContext from '../context/ThemeColorContext';

const UserLogin = (props) => {
  // const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [error, setError] = useState(''); // State to hold error message
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [themeColor, setThemeColor] = useContext(ThemeColorContext);
  const [message, setMessage] = useState("");

  const handleCloseDialog = () => {
    setDialogOpen(false);
  }

  const handleOpenDialog = () => {
    setDialogOpen(true);
  }

  const handleOpen = () => {
    setModalOpen(true);
  }

  const handleClose = () => {
    setModalOpen(false);
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    let status = 0;

    try {
      const res = await fetch("api/v1/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      status = res.status;

      const data = await res.json();
      console.log("Response data:", data);

      if (data.code === 1) {
        let token = data.data.token;
        sessionStorage.setItem("token", token);
        props.handleLoggedin();
      } else {
        setMessage(data.msg);
        handleOpen();
      }

      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("An error occurred during login:", error);
    }

  };

  const handleRegister = () => {
    fetch("api/v1/auth/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
        phone: phone,
        userType: "user"
      })
    }).then((res) => {
      if (res.status != 200) {
        console.log(res.status);
        console.log("Registration failed!");
        setEmail("");
        setPassword("");
        setUsername("");
        setPhone("");
        setRePassword("");
      }
      return res.json();
    }).then((data) => {
      console.log(data);
    });

    handleCloseDialog();
  }

  return (
    <Container component="main" maxWidth="xs" className="main-container">
      <img src={logo} alt="Task Tango Logo" className="logo-image" />
      <Typography component="h1" variant="h5">
        Welcome to Task Tango
      </Typography>
      <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
        Task management made easy.
      </Typography>

      <Box component="form" onSubmit={handleLogin} className="form-container">
        <TextField
          margin="normal"
          required
          fullWidth
          label="User Name"
          name="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Log In
        </Button>
        <Typography>Not a user?</Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleOpenDialog}
        >
          Register
        </Button>
      </Box>
      <Dialog onClose={handleCloseDialog} open={dialogOpen} fullWidth maxWidth="sm">
        <DialogTitle>Register account</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="User Name"
            name="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Phone"
            name="phone"
            autoFocus
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={(email === "") || (username === "") || (phone === "") || (password === "") || (password !== rePassword)}
            onClick={handleRegister}
            sx={{ mt: 3, mb: 2 }}
          >
            Submit Registration
          </Button>
          {
            (email === "") ? <Typography sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Email address cannot be empty</Typography> :
              (username === "") ? <Typography sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Please Enter Your User Name</Typography> :
                (phone === "") ? <Typography sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Please Enter Your Phone Number</Typography> :
                  (password === "") ? <Typography sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Please Enter a Password</Typography> :
                    (password !== rePassword) ? <Typography sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Password Doesn't Match</Typography> : <></>
          }
        </DialogContent>
      </Dialog>

      <Modal open={modalOpen} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          <Toolbar sx={{
            backgroundColor: themeColor.barColor,
            borderRadius: "3px 3px 0 0",
            minHeight: "48px",
            display: "flex",
            alignItems: "center",
          }}>
            <Typography variant="h5" sx={{fontWeight:"bold"}}>Login Failed</Typography>
          </Toolbar>

          <Box sx={{ p: 4 }}>
            <Typography sx={{ mt: 2, fontSize:"18px"}}>{message}</Typography>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClose}
              sx={{
                mt: 2,
                display: "flex",
                marginLeft: "auto",
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>



  );
}
export default UserLogin;

