import React, { useState, useContext, useEffect } from 'react';
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
  Modal,
  Toolbar,
  Typography
} from '@mui/material';
import ThemeColorContext from '../context/ThemeColorContext';
import RenderContext from '../context/RenderContext';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CreateLabel from './CreateLabel';

export default function CreateTask(props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(1);
  const [themeColor, setThemeColor] = useContext(ThemeColorContext);
  const [render, setRender] = useContext(RenderContext);
  const [date, setDate] = useState(null);
  const [createTask, setCreateTask] = useState(false);
  const [msg, setMsg] = useState(false);
  const [msgD, setMsgD] = useState(false);
  const [deleteStage, setDeleteStage] = useState(false);
  const [failedMsg, setFailedMsg] = useState("Connection Error");
  const [priority, setPriority] = useState("");
  const [labelId, setLabelId] = useState('');
  const [deleteMsg, setDeleteMsg] = useState("");

  const handleDeleteStageClose = () => {
    setDeleteStage(false);
    setRender(prev => prev + "1");
  }

  const handleDeleteStageOpen = () =>{
    setDeleteStage(true);
  }

  const handleCreateTaskClose = () =>{
    setCreateTask(false);
  }

  const handleCreateTaskOpen = () =>{
    setCreateTask(true);
  }


  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTitle('');
    setDescription('');
    setPriority('');
    setColor('');
  };

  const handleDelete = () => {
    fetch(`api/v1/stages/${props.stageId}`, {
      method:"DELETE",
      credentials:"include",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
      },
    }).then((res) => {
      if(res.status !== 200){
        setMsgD(false);
        handleDeleteStageOpen();
      }else{
        
      }
      return res.json();
    }).then((data) => {
      if(data.code === 0){
        setMsgD(false);
        setDeleteMsg(data.msg);
        handleDeleteStageOpen();
      }else if(data.code === 1){
        setMsgD(true);
        handleDeleteStageOpen();
        
      }
    });

  }

  const handleSubmit = () => {
    let dueDate = `${date.toISOString()}`;
    
    console.log("Create task information: " + title + "  " + description + "  " + labelId + "  " + dueDate + "  " + priority + "  " + props.stageId);
    fetch("/api/v1/tasks", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
      },
      body: JSON.stringify({
        title: title,
        description: description,
        stageId: parseInt(props.stageId),
        labels: [{
          labelId: parseInt(labelId),
          name: priority,
          color: 0
        }],
        dueDate: dueDate,
      })
    }).then((res) => {
      if (res.status !== 200) {
        setMsg(false);
        handleCreateTaskOpen();
      } else {
        

      }
      return res.json();
    }).then((data) => {
      if(data.code === 0){
        setMsg(false);
        setFailedMsg(data.msg);
        handleCreateTaskOpen();
      }else if(data.code === 1){
        setMsg(true);
        handleCreateTaskOpen();
      }
    })
    setRender(prev => prev + "1");
    handleCloseDialog();
  };

  return (
    <>
      <Box display="flex" alignItems="center" marginLeft="auto" gap={2}>
        <Button
          onClick={handleOpenDialog}
          variant="contained"
          sx={{
            backgroundColor: themeColor.buttonColor,
            color: themeColor.wordColor,
            '&:hover': {
              backgroundColor: '#009ACD',
            },
          }}
        >
          Create Task
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          sx={{
            backgroundColor: themeColor.buttonColor,
            color: themeColor.wordColor,
            '&:hover': {
              backgroundColor: '#009ACD',
            },
          }}>Delete</Button>
      </Box>

      <Dialog onClose={handleCloseDialog} open={dialogOpen} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: '#00BFFF' }}>Create a new task</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            type="text"
            fullWidth
            margin="dense"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Description"
            type="text"
            fullWidth
            margin="dense"
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Box display="flex" gap={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="Basic date picker" format="YYYY/MM/DD" sx={{width:"100%"}} value={date} onChange={(date) => setDate(date)} />
            </LocalizationProvider>
          </Box>

          <CreateLabel setLabelId={setLabelId} setPriority={setPriority} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>


      <Modal open={createTask} onClose={handleCreateTaskClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
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
            {
              msg ? <Typography variant="h5" sx={{ fontWeight: "bold" }}>{title} Created Successfully 🎉</Typography> 
              : <Typography variant="h5" sx={{ fontWeight: "bold" }}>{title} Created Failed 😞</Typography>
            }
            
          </Toolbar>

          <Box sx={{ p: 4 }}>
            {
              msg ? <Typography sx={{ mt: 2, fontSize: "18px" }}>Your <strong>{title}</strong> has been created successfully and is ready to use 🙌</Typography> 
              : <Typography sx={{ mt: 2, fontSize: "18px" }}>Your <strong>{title}</strong> could not be created. Reason: {failedMsg} 💔</Typography> 
            }
            
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCreateTaskClose}
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


      <Modal open={deleteStage} onClose={handleDeleteStageClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
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
            {
              msgD ? <Typography variant="h5" sx={{ fontWeight: "bold" }}>{props.stageTitle} Deleted Successfully 🚮</Typography> 
              : <Typography variant="h5" sx={{ fontWeight: "bold" }}>{props.stageTitle} Deleted Failed ⚠️</Typography>
            }
            
          </Toolbar>

          <Box sx={{ p: 4 }}>
            {
              msgD ? <Typography sx={{ mt: 2, fontSize: "18px" }}>Your <strong>{props.stageTitle}</strong> has been deleted successfully ✨</Typography> 
              : <Typography sx={{ mt: 2, fontSize: "18px" }}>Your <strong>{props.stageTitle}</strong> could not be deleted. Reason: {deleteMsg} ❌</Typography> 
            }
            
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleDeleteStageClose}
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
    </>
  );
}
