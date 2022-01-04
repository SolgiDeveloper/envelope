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
  const [sendEnvDate, setSendEnvDate] = useState("");
  const [sendEnvSubject, setSendEnvSubject] = useState("");
  const [sendEnvReceiver, setSendEnvReceiver] = useState("");
  const [sendEnvActor, setSendEnvActor] = useState("");
  const [sendEnvSendDate, setSendEnvSendDate] = useState("");
  const [sendEnvAtach, setSendEnvAtach] = useState("");






  const [receivedEnvelope, setReceivedEnvelope] = useState([]);
  const [sendEnvelope, setSendEnvelope] = useState([]);


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


  // Send the input to main
  const addSendEnvelope = () => {
    let id
    if (sendEnvelope.length === 0){
     id = sendEnvelope.length
    }else{
     id = sendEnvelope[sendEnvelope.length -1][1] + 1
    }
    const sendEnvNumber = 1000 + id
    const data =[]
    data[0] = 'send'
    data[1] = id
    data[2] = sendEnvNumber
    data[3] = sendEnvDate
    data[4] = sendEnvSubject
    data[5] = sendEnvReceiver
    data[6] = sendEnvActor
    data[7] = sendEnvSendDate
    data[8] = sendEnvAtach
    saveDataInStorage(data)
    setSendEnvDate("")
    setSendEnvSubject("")
    setSendEnvReceiver("")
    setSendEnvActor("")
    setSendEnvSendDate("")
    setSendEnvAtach("")
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
        saveBtnColor='success'
        onSave={addSendEnvelope}
        show={SModal} onClick={()=>setSModal(false)}
        onHide={()=>setSModal(false)}>
          <div className='d-flex flex-column'>
            <input type="text" onChange={(e)=>setSendEnvDate(e.target.value)} value={sendEnvDate}/>
            <input type="text" onChange={(e)=>setSendEnvSubject(e.target.value)} value={sendEnvSubject}/>
            <input type="text" onChange={(e)=>setSendEnvReceiver(e.target.value)} value={sendEnvReceiver}/>
            <input type="text" onChange={(e)=>setSendEnvActor(e.target.value)} value={sendEnvActor}/>
            <input type="text" onChange={(e)=>setSendEnvSendDate(e.target.value)} value={sendEnvSendDate}/>
            <input type="text" onChange={(e)=>setSendEnvAtach(e.target.value)} value={sendEnvAtach}/>
          </div>
      </MyModal>

      <MyModal
        modalTitle='ایجاد نامه دریافتی'
        saveBtnTitle='ذخیره'
        closeBtnTitle='بستن'
        saveBtnColor='success'
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
