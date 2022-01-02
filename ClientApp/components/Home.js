import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from "react-bootstrap/InputGroup";
import {loadSavedData, saveDataInStorage} from "../renderer.js";
import List from "./List";
import Header from "./Header";
const { ipcRenderer } = require("electron");
const { HANDLE_FETCH_DATA, HANDLE_SAVE_DATA, HANDLE_REMOVE_DATA } = require("../../utils/constants")
import './home.scss'
import {Modal} from "react-bootstrap";

const Home = () => {
  const [val, setVal] = useState("");
  const [name, setName] = useState("");
  const [itemsToTrack, setItems] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // Grab the user's saved itemsToTrack after the app loads
  useEffect(() => {
    loadSavedData();
  }, []);

  // Listener functions that receive messages from main
  useEffect(() => {
    ipcRenderer.on(HANDLE_SAVE_DATA, handleNewItem);
    // If we omit the next step, we will cause a memory leak and & exceed max listeners
    return () => {
      ipcRenderer.removeListener(HANDLE_SAVE_DATA, handleNewItem);
    }
  });
  useEffect(() => {
    ipcRenderer.on(HANDLE_FETCH_DATA, handleReceiveData);
    return () => {
      ipcRenderer.removeListener(HANDLE_FETCH_DATA, handleReceiveData);
    }
  });
  useEffect(() => {
    ipcRenderer.on(HANDLE_REMOVE_DATA, handleReceiveData);
    return () => {
      ipcRenderer.removeListener(HANDLE_REMOVE_DATA, handleReceiveData);
    }
  });

  // Receives itemsToTrack from main and sets the state
  const handleReceiveData = (event, data) => {
    console.log('data',data)
    setItems([...data.message]);
  };

  // Receives a new item back from main
  const handleNewItem = (event, data) => {
    setItems([...itemsToTrack, data.message])
  }

  // Manage state and input field
  const handleChange = (e) => {
    setVal(e.target.value)
  }
  const handleChangeName = (e)=>{
   setName(e.target.value)
  }

  // Send the input to main
  const addItem = (val,name) => {
    let id
    if (itemsToTrack.length === 0){
     id = itemsToTrack.length
    }else{
     id = itemsToTrack[itemsToTrack.length -1][0] + 1
    }
    const data =[]
    data[0] = id
    data[1] = val
    data[2] = name
    saveDataInStorage(data)
    setVal("")
    setName("")
  }

  return (
    <React.Fragment>
      <Header/>
      <Button variant="primary" onClick={handleShow}>
        Launch static backdrop modal
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          I will not close if you click outside me. Don't even try to press
          escape key.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Understood</Button>
        </Modal.Footer>
      </Modal>

      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <Button variant="outline-primary" onClick={() => addItem(val,name)}>New Item</Button>
        </InputGroup.Prepend>
        <input type="text" onChange={handleChange} value={val}/>
        <input type="text" onChange={handleChangeName} value={name}/>
      </InputGroup>
      {itemsToTrack.length ? (
        <div className='table-container'>
          <List itemsToTrack={itemsToTrack} />
        </div>
      ) : (
        <p>Add an item to get started</p>
      )}
    </React.Fragment>
  )
}

export default Home
