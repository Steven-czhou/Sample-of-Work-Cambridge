import React, { useState, useContext } from 'react';
import { SketchPicker } from 'react-color';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem as DropdownMenuItem,
  Toolbar,
  Typography
} from '@mui/material';
import ThemeColorContext from '../context/ThemeColorContext';
import InputColor from 'react-input-color';
import RenderContext from '../context/RenderContext';

function ColorPicker() {
  const [color, setColor] = useState('#fff');
  const [part, setPart] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [themeColor, setThemeColor] = useContext(ThemeColorContext);
  const [render, setRender] = useContext(RenderContext);

  const handleChangeComplete = (selectedColor) => {
    setColor(selectedColor.hex);
  };

  const barClick = () => {
    setPart("bar");
    handleOpenDialog();
  }

  const wordClick = () => {
    setPart("word");
    handleOpenDialog();
  }

  const buttonClick = () => {
    setPart("button");
    handleOpenDialog();
  }

  const boardClick = () => {
    setPart("board");
    handleOpenDialog();
  }

  const todoClick = () => {
    setPart("todo");
    handleOpenDialog();
  }



  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSaveColor = () => {
    console.log(themeColor);
    console.log('Before update:', themeColor);

    if(part === "bar"){
      const newThemeColor = { ...themeColor, barColor: color };
      setThemeColor(newThemeColor);
    }else if(part === "word"){
      const newThemeColor = { ...themeColor, wordColor: color };
    setThemeColor(newThemeColor);
    }else if(part === "button"){
      const newThemeColor = { ...themeColor, buttonColor: color };
    setThemeColor(newThemeColor);
    }else if(part === "board"){
      const newThemeColor = { ...themeColor, boardColor: color };
    setThemeColor(newThemeColor);
    }else if(part === "todo"){
      const newThemeColor = { ...themeColor, stageColor: color };
    setThemeColor(newThemeColor);
    }

    handleCloseDialog();
  }


  return (
    <>
      <Box display="flex" flexDirection="column " alignItems="center" justifyContent="center" gap={2} sx={{ height: '100vh' }} >
        <Button variant="contained"
          sx={{
            width: "220px",
            backgroundColor: themeColor.barColor,
            color: 'black',
            '&:hover': {
              backgroundColor: '#009ACD',
            },
          }}
          onClick={barClick}>
          Bar Color Setting
        </Button>
        <Button variant="contained"
          sx={{
            width: "220px",
            backgroundColor: themeColor.wordColor,
            color: 'black',
            '&:hover': {
              backgroundColor: '#009ACD',
            },
          }}
          onClick={wordClick}>
          Word Color Setting
        </Button>

        <Button variant="contained"
          sx={{
            width: "220px",
            backgroundColor: themeColor.buttonColor,
            color: 'black',
            '&:hover': {
              backgroundColor: '#009ACD',
            },
          }}
          onClick={buttonClick}>
          Button Color Setting
        </Button>

        <Button variant="contained"
          sx={{
            width: "220px",
            backgroundColor: themeColor.boardColor,
            color: 'black',
            '&:hover': {
              backgroundColor: '#009ACD',
            },
          }}
          onClick={boardClick}>
          Board Color Setting
        </Button>

        <Button variant="contained"
          sx={{
            width: "220px",
            backgroundColor: themeColor.todoBoardColor,
            color: 'black',
            '&:hover': {
              backgroundColor: '#009ACD',
            },
          }}
          onClick={todoClick}>
          Stage Color Setting
        </Button>

      </Box>

      <Dialog onClose={handleCloseDialog} open={dialogOpen}>
        <div>
          <SketchPicker
            color={color}
            onChangeComplete={handleChangeComplete}
          />
          <div style={{ backgroundColor: color, width: '100px', height: '100px', marginTop: '10px' }}>
            Selected Color
          </div>
        </div>
        <Button onClick={handleSaveColor}>Save</Button>
      </Dialog>
    </>
  );
}

export default ColorPicker;
