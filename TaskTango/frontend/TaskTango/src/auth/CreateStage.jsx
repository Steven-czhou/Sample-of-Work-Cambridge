import React, { useState, useContext, useEffect ,memo} from 'react';
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

const CreateStage = memo((props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stage, setStage] = useState('');
  const [render, setRender] = useContext(RenderContext);
  const [themeColor, setThemeColor] = useContext(ThemeColorContext);
  const [description, setDescription] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [msg, setMsg] = useState(false);
  const [failedMsg, setFailedMsg] = useState("Connection Error");
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState("Connection Error");
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  

  const handleDeleteModalOpen = () =>{
    setDeleteModal(true);
  }

  const handleDeleteModalClose = () =>{
    setDeleteModal(false);
    setRender(prev => prev + "1");
  }
  const handleDelete = () => {
    fetch(`/api/v1/boards/${props.boardId}`, {
      method: "DELETE",
      credentials:"include",
      headers:{
         "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
      }
    }).then((res) => {
      if(res.status !== 204){
        setDeleteSuccess(false);
        handleDeleteModalOpen();
      }
      return res.json();
    }).then((data) => {
      console.log(data);
      if(data.code === 0){
        setDeleteSuccess(false);
        setDeleteMsg(data.msg);
      }else if(data.code === 1){
        setDeleteSuccess(true);
      }
      handleDeleteModalOpen();
    })
  }
  const handleCreateModalClose = () => {
    setCreateModal(false);
  }

  const handleCreateModalOpen = () => {
    setCreateModal(true);
  }
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmit = () => {
    fetch("/api/v1/stages", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
      },
      body: JSON.stringify({
        boardId: props.boardId,
        title: stage,
        description: description
      })
    }).then((res) => {
      if (res.status !== 200) {
        setMsg(false);
        handleCreateModalOpen();
      } else {
      }
      return res.json();
    }).then(data => {
      if (data.code === 0) {
        setMsg(false);
        setFailedMsg(data.msg);
        handleCreateModalOpen();
      } else if (data.code === 1) {
        setMsg(true);
        setRender(prev => prev + "1");
        handleCreateModalOpen();
      }
    }).catch((error) => {
      console.error("Error: ", error);
    });
    handleCloseDialog();
  };

  return (
    <>
      <Box display="flex" alignItems="center" marginLeft="auto" gap={2} >
      <Button
          onClick={() => {
            props.setUpdateBoardId(props.boardId);
            props.handleDialogOpen();
          }}
          variant="contained"
          sx={{
            backgroundColor: themeColor.buttonColor,
            color: themeColor.wordColor,
            '&:hover': {
              backgroundColor: '#009ACD',
            },
          }}
        >
          Update Board
        </Button>
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
          Create Stage
        </Button>

        <Button
          onClick={handleDelete }
          variant="contained"
          sx={{
            backgroundColor: themeColor.buttonColor,
            color: themeColor.wordColor,
            '&:hover': {
              backgroundColor: '#009ACD',
            },
          }}
        >
          Delete
        </Button>
      </Box>

      <Dialog onClose={handleCloseDialog} open={dialogOpen} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: '#00BFFF', color: themeColor.wordColor }}>Create a new stage</DialogTitle>
        <DialogContent>
          <TextField
            label="Stage Title"
            type="text"
            fullWidth
            margin="dense"
            variant="outlined"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            multiline
          />
          <TextField
            label="Description"
            type="text"
            fullWidth
            margin="dense"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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

      <Modal open={createModal} onClose={handleCreateModalClose}>
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
              msg ? <Typography variant="h5" sx={{ fontWeight: "bold" }}>{stage} Created Successfully 🎉</Typography>
                : <Typography variant="h5" sx={{ fontWeight: "bold" }}>{stage} Created Failed 😞</Typography>
            }
          </Toolbar>

          <Box sx={{ p: 4 }}>
            {
              msg ? <Typography sx={{ mt: 2, fontSize: "18px" }}>Your <strong>{stage}</strong> has been created successfully and is ready to use 🙌</Typography>
                : <Typography sx={{ mt: 2, fontSize: "18px" }}>Your <strong>{stage}</strong> could not be created. Reason: {failedMsg} 💔</Typography>
            }

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCreateModalClose}
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


      <Modal open={deleteModal} onClose={handleDeleteModalClose}>
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
              deleteSuccess ? <Typography variant="h5" sx={{ fontWeight: "bold" }}>{props.board.title} Deleted Successfully 🎉</Typography>
                : <Typography variant="h5" sx={{ fontWeight: "bold" }}>{props.board.title} Deleted Failed 😞</Typography>
            }
          </Toolbar>

          <Box sx={{ p: 4 }}>
            {
              deleteSuccess ? <Typography sx={{ mt: 2, fontSize: "18px" }}>Your <strong>{props.board.title}</strong> has been delted successfully 🙌</Typography>
                : <Typography sx={{ mt: 2, fontSize: "18px" }}>Your <strong>{props.board.title}</strong> could not be deleted. Reason: {deleteMsg} 💔</Typography>
            }

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleDeleteModalClose}
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
}); export default CreateStage;