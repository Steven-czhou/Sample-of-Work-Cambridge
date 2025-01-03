import { useState, useContext } from 'react';

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
  InputLabel,
  Select,
  TextField
} from '@mui/material';
import ThemeColorContext from '../context/ThemeColorContext';
import RenderContext from '../context/RenderContext';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CreateLabel from '../auth/CreateLabel';

export default function Task(props) {
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletTask, setDeleteTask] = useState("");
  const [themeColor, setThemeColor] = useContext(ThemeColorContext);
  const [render, setRender] = useContext(RenderContext);
  const [stageMoveDialog, setStageMoveDialog] = useState(false);
  const [stageToMove, setStageToMove] = useState("");
  const [stageToMoveId, setStageToMoveId] = useState("");
  const [moveConfirmationModal, setMoveConfirmationModal] = useState(false);
  const [stageMoveSuccess, setStageMoveSuccess] = useState(false);
  const [stageMoveSuccessModal, setStageMoveSuccessModal] = useState(false);
  const [stageMoveMsg, setStageMoveMsg] = useState("Connection Error");
  const [updateDialog, setUpdataDialog] = useState(false);
  const [updateTitle, setUpdateTitle] = useState(props.title);
  const [updateDescription, setUpdateDescription] = useState(props.description);
  const [date, setDate] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("Connection Error");

  const handleUpdateModalOpen = () =>{
    setUpdateModal(true);
    handleUpdataDialogClose();
  }

  const handleUpdateModalClose = () =>{
    setUpdateModal(false);
    setRender(prev => prev + "1");  
  }

  const handleUpdataDialogOpen = () => {
    setUpdataDialog(true);
  }

  const handleUpdataDialogClose = () => {
    setUpdataDialog(false);
  }
  const handleUpdateTask = () => {
    console.log(1);
    let dueDate = `${date.toISOString()}`;
    fetch(`api/v1/tasks/${props.itemId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
      },
      body: JSON.stringify({
        title:updateTitle,
        description:updateDescription,
        dueDate:dueDate
      })
    }).then((res) => {
      if(res.status !== 200){
        setUpdateSuccess(false);
        handleUpdateModalOpen();
      }
      return res.json();
    }).then((data) => {
      console.log(data);
      if(data.code === 0){
        setUpdateSuccess(false);
        setUpdateMsg(data.msg);
      }else if(data.code === 1){
        setUpdateSuccess(true);

      }
      handleUpdateModalOpen();
    })
  }

  const handleStageMoveSuccessModalOpen = () => {
    setStageMoveSuccessModal(true);
  }

  const handleStageMoveSuccessModalClose = () => {
    setStageMoveSuccessModal(false);
    handleMoveConfirmationModalClose();
    handleStageMoveDialogClose();
  }

  const handleChange = (e) => {
    const selectedStageTitle = e.target.value;
    setStageToMove(selectedStageTitle);

    const selectedStage = props.stages.find(stage => stage.title === selectedStageTitle);
    if (selectedStage) {
      setStageToMoveId(selectedStage.stageId);
      console.log("Updated Stage ID: ", selectedStage.stageId);
    } else {
      console.error("Stage not found!");
    }
  };

  const handleMoveConfirmationModalOpen = () => {
    setMoveConfirmationModal(true);
  }

  const handleMoveConfirmationModalClose = () => {
    setMoveConfirmationModal(false);
  }

  const handleStageMoveDialogOpen = () => {
    setStageMoveDialog(true);
  }

  const handleStageMoveDialogClose = () => {
    setStageMoveDialog(false);
  }

  const handleDeleteModalOpen = () => {
    setDeleteModal(true);
  }

  const handleDeleteModalClose = () => {
    setDeleteModal(false);
    setRender(prev => prev + "1");
  }
  const handleMoveStage = () => {
    let a;
    for (const i of props.stages) {
      for (const j of i.items) {
        if (j.title === props.title) {
          a = i.title;
        }
      }
    }
    if (a === stageToMove) {
      setStageMoveSuccess(false);
      setStageMoveMsg("You cannot move the stage to itself. Please select a different stage to proceed.");
      handleStageMoveSuccessModalOpen();
      return;
    } else {
      fetch(`api/v1/stages/change/${props.itemId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({
          stageId: parseInt(stageToMoveId)
        })
      }).then((res) => {
        console.log(res.status);
        if (res.status !== 200) {
          setStageMoveSuccess(false);
          handleStageMoveSuccessModalOpen();
        }
        return res.json();
      }).then((data) => {
        if (data.code === 0) {
          setStageMoveSuccess(false);
          setStageMoveMsg(data.msg);
          handleStageMoveSuccessModalOpen();
        } else if (data.code === 1) {
          setStageMoveSuccess(true);
          setRender(prev => prev + "1");
          handleStageMoveSuccessModalOpen();
        }
      })
    }
  }

  const handleDelete = () => {
    setDeleteTask(props.title);
    fetch(`api/v1/tasks/${props.itemId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
      }
    }).then((res) => {
      if (res.status !== 200) {
        setDeleteSuccess(false);
        handleDeleteModalOpen();
      } else {
        setDeleteSuccess(true);
        handleDeleteModalOpen();
      }
    })
  }


  return (
    <>
      <Card sx={{
        width: '100%',
        marginBottom: '40px',
        padding: '10px',
      }} >
        <CardContent >
          <Typography variant="h5" component="div">
            {props.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginTop: '10px' }}>
            <strong>Description:</strong> {props.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginTop: '10px' }}>
            <strong>Due:</strong> {`${props.dueDate[0]}-${props.dueDate[1]}-${props.dueDate[2]}`}
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: '10px', }}>
              <strong>Label:</strong>
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                marginTop: "7px",
                marginLeft: "2px",
                marginRight: "1px",
                "&::before": {
                  content: '""',
                  display: "inline-block",
                  width: "12px",
                  height: "8px",
                  borderRadius: "30px",
                  backgroundColor: `${props.labels[0]?.color}`,
                },
              }}
            ></Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: '10px', }}>
              {props.labels?.[0]?.name || 'No Label'}
            </Typography>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-start' }}>
          <Button variant='outlined' onClick={handleUpdataDialogOpen}>Update Task</Button>
          <Button variant='outlined' onClick={handleStageMoveDialogOpen}>Move Stage</Button>
          <Button variant='outlined' onClick={handleDelete}>Delete Task</Button>
        </CardActions>
      </Card>
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
              deleteSuccess ? <Typography variant="h5" sx={{ fontWeight: "bold" }}>{deletTask} Deleted Successfully 🎉</Typography>
                : <Typography variant="h5" sx={{ fontWeight: "bold" }}>{deletTask} Deleted Failed 😞</Typography>
            }

          </Toolbar>

          <Box sx={{ p: 4 }}>
            {
              deleteSuccess ? <Typography sx={{ mt: 2, fontSize: "18px" }}>Your <strong>{deletTask}</strong> has been Deleted successfully 🙌</Typography>
                : <Typography sx={{ mt: 2, fontSize: "18px" }}>Your <strong>{deletTask}</strong> could not be deleted 💔</Typography>
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

      <Dialog onClose={handleDeleteModalClose} open={stageMoveDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: '#00BFFF' }}>Choose a Stage to Move</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel id="stageMove-id">Stage</InputLabel>
            <Select
              value={stageToMove}
              label="stageMove"
              onChange={handleChange}
            >
              {
                props.stages.map((stageItem) => {
                  return (
                    <MenuItem labelId="stageMove-id" value={stageItem.title}>{stageItem.title}</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStageMoveDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleMoveConfirmationModalOpen} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={moveConfirmationModal} onClose={handleMoveConfirmationModalClose}>
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
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>Stage Move Confirmation </Typography>

          </Toolbar>

          <Box sx={{ p: 4 }}>
            <Typography sx={{ mt: 2, fontSize: "18px" }}>Are you sure move <strong>{props.title}</strong> from <strong>{props.stages.title}</strong> to <strong>{stageToMove}</strong> 🙌</Typography>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleMoveConfirmationModalClose}
              >
                Close
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={handleMoveStage}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>


      <Modal open={stageMoveSuccessModal} onClose={handleStageMoveSuccessModalClose}>
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
              stageMoveSuccess ? <Typography variant="h5" sx={{ fontWeight: "bold" }}>{props.title} Moved Successfully 🎉</Typography>
                : <Typography variant="h5" sx={{ fontWeight: "bold" }}>{props.title} Moved Failed 😞</Typography>
            }

          </Toolbar>

          <Box sx={{ p: 4 }}>
            {
              stageMoveSuccess ? <Typography sx={{ mt: 2, fontSize: "18px" }}>Your <strong>{props.title}</strong> has been moved successfully and is ready to use 🙌</Typography>
                : <Typography sx={{ mt: 2, fontSize: "18px" }}>Your <strong>{props.title}</strong> could not be moved. Reason: {stageMoveMsg} 💔</Typography>
            }

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleStageMoveSuccessModalClose}
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


      <Dialog onClose={handleUpdataDialogClose} open={updateDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: '#00BFFF' }}>Update Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Update Title"
            type="text"
            fullWidth
            margin="dense"
            variant="outlined"
            value={updateTitle}
            onChange={(e) => setUpdateTitle(e.target.value)}
            multiline
          />

          <TextField
            label="Update Description"
            type="text"
            fullWidth
            margin="dense"
            variant="outlined"
            value={updateDescription}
            onChange={(e) => setUpdateDescription(e.target.value)}
            multiline
          />

          <Box display="flex" gap={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Select a New Duedate" format="YYYY/MM/DD" sx={{ width: "100%" }} value={date} onChange={(date) => setDate(date)} />
            </LocalizationProvider>
          </Box>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdataDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateTask} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>


      <Modal open={updateModal} onClose={handleUpdateModalClose}>
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
              updateSuccess ? <Typography variant="h5" sx={{ fontWeight: "bold" }}>{updateTitle} Updated Successfully 🎉</Typography>
                : <Typography variant="h5" sx={{ fontWeight: "bold" }}>{updateTitle} Updated Failed 😞</Typography>
            }

          </Toolbar>

          <Box sx={{ p: 4 }}>
            {
              updateSuccess ? <Typography sx={{ mt: 2, fontSize: "18px" }}>Your <strong>{updateTitle}</strong> has been updated successfully and is ready to use 🙌</Typography>
                : <Typography sx={{ mt: 2, fontSize: "18px" }}>Your <strong>{updateTitle}</strong> could not be updated. Reason: {updateMsg} 💔</Typography>
            }

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleUpdateModalClose}
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


  )
}