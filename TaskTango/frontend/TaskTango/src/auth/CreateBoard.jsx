import React, { useState, useContext } from 'react';
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
  Modal,
  Toolbar,
  Typography
} from '@mui/material';
import { grey } from '@mui/material/colors';
import RenderContext from '../context/RenderContext';
import ThemeColorContext from '../context/ThemeColorContext';

export default function CreateBoard() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [boardTitle, setTitle] = useState('');
  const [render, setRender] = useContext(RenderContext);
  const [themeColor, setThemeColor] = useContext(ThemeColorContext);
  const [message, setMessage] = useState("");
  const [createBoardSuccess, setCreateBoardSuccess] = useState(false);
  const [createBoardModal, setCreateBoardModal] = useState(false);

  const handleOpenCreateBoardModal = () =>{
    setCreateBoardModal(true);
  }

  const handleCloseCreateBoardModal = () =>{
    setCreateBoardModal(false);
  }

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmit = () => {
    console.log(boardTitle);
    fetch("/api/v1/boards", {
      method: "POST",
      credentials: "include",
       headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
      },
      body:JSON.stringify({
        title:boardTitle
      })
    }).then((res) => {
      if (res.status !== 200) {
        
        console.log(res.status + ": Create board failed!");
      }else{

        
      }
      return res.json();
    }).then(data => {
      console.log(data);
      if(data.code === 0){
        setMessage(data.msg);
        setCreateBoardSuccess(false);
        handleOpenCreateBoardModal();
      }else if(data.code === 1){
        setCreateBoardSuccess(true);
        handleOpenCreateBoardModal();
        setRender(prev => prev + "1");
      }
    }).catch((error) => {
      console.error("Error: ", error);
    });
    
    handleCloseDialog();
  };


  return (
    <>
      <Box display="flex" alignItems="center" gap={2}>
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
          Create Board
        </Button>

        
      </Box>

      <Dialog onClose={handleCloseDialog} open={dialogOpen} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: '#00BFFF', color:themeColor.wordColor}}>Create a new board</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            type="text"
            fullWidth
            margin="dense"
            variant="outlined"
            value={boardTitle}
            onChange={(e) => setTitle(e.target.value)}
            multiline
          />
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


      <Modal open={createBoardModal} onClose={handleCloseCreateBoardModal}>
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
              createBoardSuccess ? <Typography variant="h5" sx={{ fontWeight: "bold" }}>{boardTitle} Created Successfully 🎉</Typography> 
              : <Typography variant="h5" sx={{ fontWeight: "bold" }}>{boardTitle} Created Failed 😞</Typography>
            }
          </Toolbar>

          <Box sx={{ p: 4 }}>
            {
              createBoardSuccess ? <Typography sx={{ mt: 2, fontSize: "18px" }}>Your <strong>{boardTitle}</strong> has been created successfully and is ready to use 🙌</Typography> 
              : <Typography sx={{ mt: 2, fontSize: "18px" }}>We couldn’t create <strong>{boardTitle}</strong> 😞 Reason: {message} 💔</Typography> 
            }
            
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseCreateBoardModal}
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
