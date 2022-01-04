import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from "react-bootstrap/InputGroup";
import {loadSavedData, saveDataInStorage} from "../renderer.js";
import List from "./List";
import Header from "./Header";
const { ipcRenderer } = require("electron");
const { HANDLE_FETCH_DATA, HANDLE_SAVE_DATA, HANDLE_REMOVE_DATA } = require("../../utils/constants")
import './home.scss'
import MyModal from "./MyModal";

const Home = () => {
  const [val, setVal] = useState("");
  const [name, setName] = useState("");
  const [receivedEnvelope, setReceivedEnvelope] = useState([]);
  const [sendEnvelope, setSendEnvelope] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [SModal, setSModal] = useState(false);
  const [REModal, setREModal] = useState(false);

  const [showReceivedEnvelope, setShowReceivedEnvelope] = useState(false);
  const [showSendEnvelope, setShowSendEnvelope] = useState(true);

  // Grab the user's saved sendEnvelope after the app loads
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

  // Receives sendEnvelope from main and sets the state
  const handleReceiveData = (event, data) => {
    console.log('data',data)
    setSendEnvelope([...data.message]);
  };

  // Receives a new item back from main
  const handleNewItem = (event, data) => {
    setSendEnvelope([...sendEnvelope, data.message])
  }

  // Manage state and input field
  const handleChange = (e) => {
    setVal(e.target.value)
  }
  const handleChangeName = (e)=>{
   setName(e.target.value)
  }

  // Send the input to main
  const addSendEnvelope = () => {
    let id
    if (sendEnvelope.length === 0){
     id = sendEnvelope.length
    }else{
     id = sendEnvelope[sendEnvelope.length -1][0] + 1
    }
    const data =[]
    data[0] = id
    data[1] = val
    data[2] = name
    saveDataInStorage(data)
    setVal("")
    setName("")
    setSModal(false)
  }

  const addReceivedEnvelope = () => {

  }
  const showSendEnvelopeHandler = () => {
    setShowReceivedEnvelope(false)
    setShowSendEnvelope(true)
  }
  const showReceivedEnvelopeHandler = () => {
    setShowSendEnvelope(false)
    setShowReceivedEnvelope(true)
  }

  return (
    <React.Fragment>
      <Header
        makeSendEnvelope={()=>setSModal(true)}
        makeReceivedEnvelope={()=>setREModal(true)}
        showSendEnvelope={showSendEnvelopeHandler}
        showReceivedEnvelope={showReceivedEnvelopeHandler}
      />

      <MyModal
        modalTitle='ایجاد نامه ارسالی'
        saveBtnTitle='ذخیره'
        closeBtnTitle='بستن'
        onSave={addSendEnvelope}
        show={SModal} onClick={()=>setSModal(false)}
        onHide={()=>setSModal(false)}>

          <input type="text" onChange={handleChange} value={val}/>
          <input type="text" onChange={handleChangeName} value={name}/>

      </MyModal>

      <MyModal
        modalTitle='ایجاد نامه دریافتی'
        saveBtnTitle='ذخیره'
        closeBtnTitle='بستن'
        onSave={addReceivedEnvelope}
        show={REModal} onClick={()=>setREModal(false)}
        onHide={()=>setREModal(false)}>

      </MyModal>

      {!!sendEnvelope.length && showSendEnvelope && (
        <div className='table-container'>
          <div className='send-envelope__title my-2'>لیست نامه های ارسالی</div>
          <List itemsToTrack={sendEnvelope} />
        </div>
      )}
      {!sendEnvelope.length && !showReceivedEnvelope &&(
        <div className='send-envelope__title my-2'>
          <p dir='rtl'>لیست نامه های ارسالی خالی است!</p>
        </div>

      )}
    </React.Fragment>
  )
}

export default Home
