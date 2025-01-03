import {
  Button,
  Box,
  MenuItem,
  Modal,
  Toolbar,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  CardActions,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  TextField,
  InputLabel,
  Select,
} from '@mui/material';
import Task from "./TaskCard";
import { useState, useEffect, useContext } from 'react';
import CreateTask from '../auth/CreateTask';
import ThemeColorContext from '../context/ThemeColorContext';
import RenderContext from '../context/RenderContext';
export default function Board(props) {
  let color = "";
  const [themeColor, setThemeColor] = useContext(ThemeColorContext);
  

  return (
    <>
      <Box 

      sx={{ borderRadius: '3px', 
        border: '2px solid #000',
       }}>
        <Toolbar sx={{ backgroundColor: themeColor.stageColor, borderRadius: "3px" }}>
          <Typography sx={{ fontWeight: "bold", color: themeColor.wordColor }}>
            {props.title}
          </Typography>
          <CreateTask stage={props.stages.stageId} stageId={props.stageId} stageTitle={props.title} />
        </Toolbar>
        <Box
          sx={{
            width: "100%",
            overflowY: 'auto',
            height: '500px',
            padding: '10px',
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '4px' },
            '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
          }}
        >
          {Object.values(props.taskLists).map((task, index) => (
            <Task key={index} {...task} stages={props.stages} stageId={props.stages.stageId} />
          ))}
        </Box>
      </Box>

    
    </>
  );

}