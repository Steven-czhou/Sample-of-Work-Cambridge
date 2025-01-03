
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
import RenderContext from '../context/RenderContext';
import Board from '../Board/Board';
import { Description } from '@mui/icons-material';
import { useState, useEffect, useContext, useMemo } from 'react';
import { Row, Col, Pagination, Container } from "react-bootstrap";
import CreateTask from '../auth/CreateTask';
import ThemeColorContext from '../context/ThemeColorContext';
import CreateStage from '../auth/CreateStage';

const Home = () => {
  const [list, setList] = useState([]);
  const [render, setRender] = useContext(RenderContext);
  const [themeColor, setThemeColor] = useContext(ThemeColorContext);
  const [updateModal, setUpdateModal] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("Connection Error");
  const [updateDialog, setUpdateDialog] = useState(false);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateBoardId, setUpdateBoardId] = useState("");

  const [stageSelection, setStageSelection] = useState({});

  const handleDialogOpen = () =>{
    setUpdateDialog(true);
  }

  const handleDialogClose = () =>{
    setUpdateDialog(false);
  }
  const handleUpdateModalOpen = () =>{
    setUpdateModal(true);
  }

  const handleUpdateModalClose = () =>{
    setUpdateModal(false);
    setRender(prev => prev + "1");
    handleDialogClose();
  }
  const handleUpdateBoard = () =>{
    console.log(updateBoardId);
    fetch(`api/v1/boards/${updateBoardId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
      },
      body:JSON.stringify({
        title:updateTitle,
      })
    }).then((res) => {
      if(res.status !== 200){
        setUpdateSuccess(false);
        handleUpdateModalOpen();
      }
      return res.json();
    }).then((data) => {
      if(data.code === 0){
        setUpdateSuccess(false);
        setUpdateMsg(data.msg);
      }else if(data.code === 1){
        setUpdateSuccess(true);
      }
      handleUpdateModalOpen();
    })
  }
  const handleChangeStageSelect = (boardId, stageId) => {
    
    setStageSelection((prev) => ({
      ...prev,
      [boardId]: stageId,
    }));
  };

  
  useEffect(() => {
    fetch("api/v1/boards", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          console.log("Access get all boards failed\n");
        }
        return res.json();
      })
      .then((data) => {
        setList(data.data);
        const initialSelection = data.data.reduce((acc, board) => {
          acc[board.boardId] = "None";
          return acc;
        }, {});
        setStageSelection(initialSelection);
      })
      .catch((error) => {
        console.error("Error fetching boards:", error);
      });
  }, [render]);

  return (
    <>
    <Box
      sx={{
        marginTop: "64px",
        height: "calc(100vh - 64px)",
      }}
    >
      {list.map((board) => (
        <Box
          key={board.boardId}
          sx={{
            borderRadius: "3px",
            border: "2px solid #000",
            marginBottom: "40px",
        //     transition: 'transform 0.5s, box-shadow 0.5s',
        //     '&:active': {
        //   transform: 'scale(0.8)',
        //   boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.15)',
        // },
          }}
        >
          <Toolbar
            sx={{
              backgroundColor: themeColor.boardColor,
              borderRadius: "3px",
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", color: themeColor.wordColor }}
            >
              {board.title}
            </Typography>
            {
              
              <CreateStage boardId={board.boardId} board={board} setUpdateBoardId={setUpdateBoardId} handleDialogOpen={handleDialogOpen}/>
            }


            <FormControl margin="dense" sx={{ width: "150px" ,marginLeft:"5px"}}>
              <InputLabel id={`stage-${board.boardId}`}>Choose Stage</InputLabel>
              <Select
                labelId={`stage-${board.boardId}`}
                id={`stage-${board.boardId}`}
                value={stageSelection[board.boardId] || "None"}
                onChange={(e) =>
                  handleChangeStageSelect(board.boardId, e.target.value)
                }
              >
                <MenuItem value="None">None</MenuItem>
                {board.stages.map((stage) => (
                  <MenuItem key={stage.stageId} value={stage.stageId}>
                    {stage.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Toolbar>

          <Box
            sx={{
              width: "1300px",
              overflowY: "scroll",
              height: "500px",
              padding: "10px",
              "&::-webkit-scrollbar": { width: "8px" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#ccc",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-track": { backgroundColor: "#f1f1f1" },
              marginTop: "1px",
            }}
          >
            <Container style={{ textAlign: "left", margin: "0" }}>
              <Row>
                {board.stages
                  .filter(
                    (stageItem) =>
                      stageSelection[board.boardId] === "None" ||
                      stageSelection[board.boardId] === stageItem.stageId
                  )
                  .map((stageItem, index) => (
                    <Col key={index} xs={12} md={4}>
                      <Board
                        key={stageItem.stageId}
                        stageId={stageItem.stageId}
                        boardId={board.boardId}
                        stages={board.stages}
                        taskLists={stageItem.items}
                        title={stageItem.title}
                      />
                    </Col>
                  ))}
              </Row>
            </Container>
          </Box>
        </Box>
      ))}
    </Box>

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

      <Dialog onClose={handleDialogClose} open={updateDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: '#00BFFF' }}>Update Board</DialogTitle>
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

        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateBoard} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default Home;