import React, { useContext, useState } from 'react';
import { Row, Col, Pagination, Container, Form } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Menu,
  MenuItem as DropdownMenuItem,
  Avatar
} from '@mui/material';
import ToolbarComponent from '@mui/material/Toolbar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LoopIcon from '@mui/icons-material/Loop';
import DoneIcon from '@mui/icons-material/Done';
import MenuIcon from '@mui/icons-material/Menu';
import Home from '../router/Home'
import ToDo from '../router/ToDo';
import InProgress from '../router/InProgress';
import Done from '../router/Done';
import HomeIcon from '@mui/icons-material/Home';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Drawer from '@mui/material/Drawer';
import { styled, useTheme } from '@mui/material/styles';
import CreateBoard from "./CreateBoard";
import { grey } from '@mui/material/colors';
import ColorPicker from './ColorPicker';
import ThemeColorContext from '../context/ThemeColorContext';
import ColorLensIcon from '@mui/icons-material/ColorLens';

// Two new components: tutorial pop-up window and change avatar pop-up window
import TutorialDialog from './TutorialDialog'; // Import the tutorial pop-up component
import ChangeAvatarDialog from './ChangeAvatarDialog'; // Import and change avatar pop-up window component

export default function UserLoggedin(props){
    const drawerWidth = 240;
    const theme = useTheme();
  const [page, setPage] = useState("Home");
  const [open, setOpen] = useState(true);
  const [pageName, setPageName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [themeColor, setThemeColor] = useContext(ThemeColorContext);

// New state variables
const [tutorialOpen, setTutorialOpen] = useState(false); // Controls whether the tutorial pop-up window is open
const [avatarOpen, setAvatarOpen] = useState(false); // Controls whether the pop-up window for changing avatar is open
const [avatar, setAvatar] = useState(""); // Store avatar images uploaded by users

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

    // Avatar menu handlers
    const handleAvatarClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleAvatarClose = () => {
      setAnchorEl(null);
    };
  
    const handleLogout = () => {
      console.log('Logout clicked');
      sessionStorage.setItem("token", "");
      props.handleLoggedOut();
      handleAvatarClose();
    };
  
    const handleDeleteAccount = () => {
      console.log('Delete Account clicked');
      props.handleDeleteAccount();
      sessionStorage.setItem("token", "");
      handleAvatarClose();
    };



  return (
  <Router >
      <AppBar position="fixed" open={open} sx={{ backgroundColor: themeColor.barColor }}>
        <Toolbar sx={{}}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon sx={{ color: "black", fontWeight: "bold", marginRight: "10px" }} />
          </IconButton>
          <ListItemText>{pageName}</ListItemText>
          <CreateBoard/>
          <IconButton onClick={handleAvatarClick}>
          <Avatar sx={{ bgcolor: grey[500] }}>R</Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleAvatarClose}
        >

            {/* New menu item: Open tutorial pop-up window */}
            <DropdownMenuItem onClick={() => setTutorialOpen(true)}>Tutorial</DropdownMenuItem> 
            {/* New menu item: Open the pop-up window for changing avatar */}
            <DropdownMenuItem onClick={() => setAvatarOpen(true)}>Change Avatar</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeleteAccount}>Delete Account</DropdownMenuItem>
        </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: themeColor.barColor, },
        }}
        anchor='left'
        open={open}
      >

        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <List >

          <ListItemButton
            component={NavLink}
            to="*"
            onClick={() => { setPage("Home"); setPageName("Home Page") }
            }
            sx={() => ({
              borderRadius: '200px',
              backgroundColor: page === "Home" ? 'primary.dark' : themeColor.buttonColor,
              color: page === "Home" ? 'white' : '#00BFFF',
              '&:hover': {
                backgroundColor: page === "Home" ? 'primary.dark' : 'action.hover',
              },
              marginBottom: "20px",
            })}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <HomeIcon sx={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="Home Page" primaryTypographyProps={{
              sx: {
                fontSize: '20px',
                color: themeColor.wordColor,
              },
            }} />
          </ListItemButton>

         

          <ListItemButton
            component={NavLink}
            to="/color"
            onClick={() => { setPage("Color"); setPageName("Home Page") }
            }
            sx={() => ({
              borderRadius: '200px',
              backgroundColor: page === "Color" ? 'primary.dark' : themeColor.buttonColor,
              color: page === "Color" ? 'white' : '#00BFFF',
              '&:hover': {
                backgroundColor: page === "Color" ? 'primary.dark' : 'action.hover',
              },
              marginBottom: "20px",
            })}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <ColorLensIcon sx={{color:"black"}}/>
            </ListItemIcon>
            <ListItemText primary="Color Page" primaryTypographyProps={{
              sx: {
                fontSize: '20px',
                color: themeColor.wordColor,
              },
            }} />
          </ListItemButton>
        </List>

      </Drawer>
      <main
        style={{
          
        }}
      >
        <ToolbarComponent  />
        <Routes >
          <Route path='*' element={<Home />} />
          <Route path="/todo" element={<ToDo />} />
          <Route path="/inprogress" element={<InProgress />} />
          <Route path="/done" element={<Done />} />
          <Route path="/color" element={<ColorPicker/>}/>
        </Routes>
      </main>

       {/* New tutorial pop-up component */}
       <TutorialDialog
        open={tutorialOpen} // Control the open state of the pop-up window
        onClose={() => setTutorialOpen(false)} // Set the state to false when closing the popup
      />

      {/* Newly added pop-up window component for changing avatar */}
      <ChangeAvatarDialog
        open={avatarOpen} // Control the open state of the pop-up window
        avatar={avatar} // Current profile picture
        onAvatarChange={(newAvatar) => setAvatar(newAvatar)} // Update status when user uploads a new avatar
        onClose={() => setAvatarOpen(false)} // Set the state to false when closing the popup
      />
    </Router>
  );
}