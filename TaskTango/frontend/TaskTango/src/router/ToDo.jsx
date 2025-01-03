import {
  Box,
  Toolbar,
  Typography
} from '@mui/material';
import RenderContext from '../context/RenderContext';
import Board from '../Board/Board';
import { Description } from '@mui/icons-material';
import { useState, useEffect, useContext } from 'react';
import { Row, Col, Pagination, Container } from "react-bootstrap";

const ToDo = () => {
  const [list, setList] = useState([]);
  const [render, setRender] = useContext(RenderContext);
  let stages = {title:"To-Do"};
  useEffect(() => {
    fetch("api/v1/tasks", {
      method: "GET",
      headers:{
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
      }
    })
      .then(res => {
        console.log(res.status);
        if (res.status !== 200) {
          console.log("Access get all boards failed\n");
        }
        return res.json();
      })
      .then(data => {
        setList(data.data);
        let newData = data.data;
        newData = newData.filter(item => item.stageId === 1);
        setList(newData);
      })
      .catch(error => {
        console.error("Error fetching boards:", error);
      });
  }, [render]);


  return (
    <>
      {list.length > 0 ? (
        <Container style={{ textAlign: "left", margin: "0" }}>
          <Row>
            <Col xs={12} md={12}>
              <Board  lists={list} stage={stages} title="To-Do"/>
            </Col>
          </Row>
        </Container>
      ) : (
        <Typography>No tasks available.</Typography>
      )}
    </>
  )
};
export default ToDo;
