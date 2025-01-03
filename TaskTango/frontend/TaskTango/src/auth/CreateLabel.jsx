
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
import RenderContext from '../context/RenderContext';
import ThemeColorContext from '../context/ThemeColorContext';
import ClearIcon from '@mui/icons-material/Clear';
import { SketchPicker } from 'react-color';


export default function CreateLabel(props) {
  const [priority, setPriority] = useState("");
  const [labelId, setLabelId] = useState('');
  const [label, setLabel] = useState("");
  const [labelItem, setLabelItem] = useState([]);
  const [render, setRender] = useContext(RenderContext);
  const [dialogOpenLabel, setDialogOpenLabel] = useState(false);
  const [createLabelSuccess, setCreateLabelSuccess] = useState(false);
  const [createLabelModal, setCreateLabelModal] = useState(false);
  const [createLabelMsg, setCreateLabelMsg] = useState("Connection Error");
  const [themeColor, setThemeColor] = useContext(ThemeColorContext);
  const [labelMsg, setLabelMsg] = useState("");
  const [deleteLabelModal, setDeleteLabelModal] = useState(false);
  const [deleteLabelSuccess, setDeleteLabelSuccess] = useState(false);
  const [color, setColor] = useState('#FF0000');
  const [dialogColorOpen, setDialogColorOpen] = useState(false);
  const [labelColor, setLabelColor] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("Connection Error");

  const handleCloseDialogColor = () => {
    setDialogColorOpen(false);
  }

  const handleOpenDialogColor = () => {
    setDialogColorOpen(true);
  }

  const handleChangeComplete = (selectedColor) => {
    setColor(selectedColor.hex);
  };

  const handleSaveColor = () => {

    setLabelColor(color);
    console.log(labelColor);
    handleCloseDialogColor();
  }

  useEffect(() => {
    fetch("api/v1/labels", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
      }
    }).then((res) => {
      if (res.status != 200) {
        console.log(res.status + ": Get all labels failed!");
      }
      return res.json();
    }).then((data) => {
      setLabelItem(data.data);
      console.log(labelItem);
    })
  }, [render])


  const handleDeleteLabelModalClose = () => {
    setDeleteLabelModal(false);
  }

  const handleDeleteLabelModalOpen = () => {
    setDeleteLabelModal(true);
  }

  const handleDeleteLabel = (id) => {
    for( const i of labelItem){
      if(i.labelId === id){
        setLabelMsg(i.name);
      }
    }
    console.log(labelMsg);
    fetch(`/api/v1/labels/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
      }
    }).then((res) => {
      console.log("Delete label status: " + res.status);
      if (res.status !== 200) {
        setDeleteLabelSuccess(false);
        handleDeleteLabelModalOpen();
      } else {
      }
      return res.json();
    }).then((data) => {
      if(data.code === 0){
        setDeleteMsg(data.msg);
        setDeleteLabelSuccess(false);
        handleDeleteLabelModalOpen();
      }else{
        setRender(prev => prev + "1");
        setDeleteLabelSuccess(true);
        handleDeleteLabelModalOpen();
      }
    })
  }

  const handleCreateLabelModalClose = () => {
    setCreateLabelModal(false);
  }

  const handleCreateLabelModalOpen = () => {
    setCreateLabelModal(true);
  }
  const handleAddLabel = async () => {
    try {
      setLabelMsg(label);
      const res = await fetch("api/v1/labels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: label,
          color: labelColor
        })
      });

      if (res.status != 200) {
        setCreateLabelSuccess(false);
        handleCreateLabelModalOpen();
      } else {

      }

      const data = await res.json();

      if (data.code === 0) {
        setCreateLabelMsg(data.msg);
        setCreateLabelSuccess(false);
        handleCreateLabelModalOpen();
      } else {
        setCreateLabelSuccess(true);
        handleCreateLabelModalOpen();

      }

      setLabel("");
      setRender(prev => prev + "1");
      handleCloseDialogLabel();
    } catch (error) {

    }

  }

  const handleCloseDialogLabel = () => {
    setDialogOpenLabel(false);
  }

  const handleOpenDialogLabel = () => {
    setDialogOpenLabel(true);
  }

  const handleChange = (e) => {
    const name = e.target.value;
    for (const i of labelItem) {
      if (i.name === name) {
        props.setLabelId(i.labelId);

      }
    }
    setPriority(e.target.value);
    props.setPriority(e.target.value);


  }

  return (
    <>
      <FormControl fullWidth margin="dense">
        <InputLabel id="priority-label">Label</InputLabel>
        <Select
          value={priority}
          label="Priority"
          onChange={handleChange}
          renderValue={(selected) => selected}
        >
          {labelItem.map((labels, index) => (
            <MenuItem labelId="priority-label" key={index} value={labels.name} id={labels.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ backgroundColor: `${labels.color}`, borderRadius: "6px" }}>{labels.name}</span>
                <IconButton
                  edge="end"
                  size="small"
                  onClick={(e) => {
                    
                    e.stopPropagation();
                    handleDeleteLabel(labels.labelId);
                  }}
                >
                  <ClearIcon sx={{ color: "red" }} />
                </IconButton>
              </Box>
            </MenuItem>
          ))}
          <MenuItem onClick={handleOpenDialogLabel}> + </MenuItem>
        </Select>
      </FormControl>

      <Dialog onClose={handleCloseDialogLabel} open={dialogOpenLabel} fullWidth maxWidth="sm" >
        <DialogTitle sx={{ backgroundColor: '#00BFFF' }}>Create a new Label</DialogTitle>
        <TextField
          label="Label"
          type="text"
          fullWidth
          margin="dense"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <Typography id="colorPickTitle" sx={{ marginTop: "10px", marginLeft: "5px" }}>Color Pick</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '300px', }}>

          <Button title="Color Pick" sx={{ width: "80px", height: "55px", marginLeft: "5px", backgroundColor: `${color}` }} onClick={handleOpenDialogColor}></Button>
          <Dialog onClose={handleCloseDialogColor} open={dialogColorOpen}>
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
          <TextField
            type="text"
            fullWidth
            margin="dense"
            value={color}
            disabled
            sx={{color:color}}
          />
        </Box>
        <DialogActions>
          <Button onClick={handleCloseDialogLabel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddLabel} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={createLabelModal} onClose={handleCreateLabelModalClose}>
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
              createLabelSuccess ? <Typography variant="h5" sx={{ fontWeight: "bold" }}>{labelMsg} Created Successfully 🎉</Typography>
                : <Typography variant="h5" sx={{ fontWeight: "bold" }}>{labelMsg} Created Failed 😞</Typography>
            }

          </Toolbar>

          <Box sx={{ p: 4 }}>
            {
              createLabelSuccess ? <Typography sx={{ mt: 2, fontSize: "18px" }}>Your <strong>{labelMsg}</strong> has been created successfully and is ready to use 🙌</Typography>
                : <Typography sx={{ mt: 2, fontSize: "18px" }}>Your <strong>{labelMsg}</strong> could not be created. Reason: {createLabelMsg} 💔</Typography>
            }

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCreateLabelModalClose}
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


      <Modal open={deleteLabelModal} onClose={handleDeleteLabelModalClose}>
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
              deleteLabelSuccess ? <Typography variant="h5" sx={{ fontWeight: "bold" }}>{labelMsg} Deleted Successfully 🎉</Typography>
                : <Typography variant="h5" sx={{ fontWeight: "bold" }}>{labelMsg} Deleted Failed 😞</Typography>
            }

          </Toolbar>

          <Box sx={{ p: 4 }}>
            {
              deleteLabelSuccess ? <Typography sx={{ mt: 2, fontSize: "18px" }}>Your <strong>{labelMsg}</strong> has been Deleted successfully 🙌</Typography>
                : <Typography sx={{ mt: 2, fontSize: "18px" }}>Your <strong>{labelMsg}</strong> could not be deleted. Reason: {deleteMsg} 💔</Typography>
            }

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleDeleteLabelModalClose}
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