import React, {useState, useEffect} from 'react';
import {loadSavedData, saveDataInStorage} from "../renderer.js";
import SendEnvList from "./SendEnvList";
import Header from "./Header";
const { ipcRenderer } = require("electron");
const { HANDLE_FETCH_DATA, HANDLE_SAVE_DATA, HANDLE_REMOVE_DATA } = require("../../utils/constants")
import './home.scss'
import MyModal from "./MyModal";
import {DatePicker} from "react-advance-jalaali-datepicker";
import RecEnvList from "./RecEnvList";
const Home = () => {
  const [sendEnvDate, setSendEnvDate] = useState("");
  const [sendEnvSubject, setSendEnvSubject] = useState("");
  const [sendEnvReceiver, setSendEnvReceiver] = useState("");
  const [sendEnvActor, setSendEnvActor] = useState("");
  const [sendEnvSendDate, setSendEnvSendDate] = useState("");
  const [sendEnvAtach, setSendEnvAtach] = useState("");
  const [sendEnvAtach2, setSendEnvAtach2] = useState("");
  const [sendEnvFile, setSendEnvFile] = useState("");

  const [recEnvNumber, setRecEnvNumber] = useState("");
  const [recEnvDate, setRecEnvDate] = useState("");
  const [recEnvSubject, setRecEnvSubject] = useState("");
  const [recEnvOwner, setRecEnvOwner] = useState("");
  const [recEnvActor, setRecEnvActor] = useState("");
  const [recEnvRecDate, setRecEnvRecDate] = useState("");
  const [recEnvAtach, setRecEnvAtach] = useState("");
  const [recEnvAtach2, setRecEnvAtach2] = useState("");
  const [recEnvFile, setRecEnvFile] = useState("");

  // all envelop items
  const [sendEnvelope, setSendEnvelope] = useState([]);
  const [searchedEnvelopeState, setSearchedEnvelopeState] = useState([]);

  const [SModal, setSModal] = useState(false);
  const [REModal, setREModal] = useState(false);

  const [showReceivedEnvelope, setShowReceivedEnvelope] = useState(false);
  const [showSendEnvelope, setShowSendEnvelope] = useState(true);
  const [showSearchedEnvelope, setShowSearchedEnvelope] = useState(false);

  let searchedEnvelope = [];
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
    setSendEnvelope([...data.message]);
  };

  // Receives a new item back from main
  const handleNewItem = (event, data) => {
    setSendEnvelope([...sendEnvelope, data.message])
  }


  // Send the SendEnvelope to main.js
  const addSendEnvelope = () => {
    let id
    if (sendEnvelope.length === 0){
     id = sendEnvelope.length
    }else{
     id = sendEnvelope[0][1] + 1
    }
    const sendEnvNumber = 1000 + id
    const data =[]
    data[0] = 'send'
    data[1] = id
    data[2] = `${sendEnvNumber}`
    data[3] = sendEnvDate
    data[4] = sendEnvSubject
    data[5] = sendEnvReceiver
    data[6] = sendEnvActor
    data[7] = sendEnvSendDate
    data[8] = sendEnvAtach
    data[9] = sendEnvFile
    data[10] = sendEnvAtach2
    saveDataInStorage(data)
    setSendEnvDate("")
    setSendEnvSubject("")
    setSendEnvReceiver("")
    setSendEnvActor("")
    setSendEnvSendDate("")
    setSendEnvAtach("")
    setSendEnvAtach2("")
    setSendEnvFile("")
    setSModal(false)
    setShowSendEnvelope(true)
    setShowReceivedEnvelope(false)
    setShowSearchedEnvelope(false)
    loadSavedData()
  }
  // Send the ReceivedEnvelope to main.js
  const addReceivedEnvelope = () => {
    let id
    if (sendEnvelope.length === 0){
      id = sendEnvelope.length
    }else{
      id = sendEnvelope[0][1] + 1
    }
    const receiveEnvNumber = 1000 + id
    const data =[]
    data[0] = 'receive'
    data[1] = id
    data[2] = `${receiveEnvNumber}`
    data[3] = recEnvDate
    data[4] = recEnvSubject
    data[5] = recEnvOwner
    data[6] = recEnvActor
    data[7] = recEnvRecDate
    data[8] = recEnvAtach
    data[9] = recEnvNumber
    data[10] = recEnvFile
    data[11] = recEnvAtach2
    saveDataInStorage(data)
    setRecEnvDate("")
    setRecEnvSubject("")
    setRecEnvOwner("")
    setRecEnvActor("")
    setRecEnvRecDate("")
    setRecEnvAtach("")
    setRecEnvAtach2("")
    setRecEnvNumber("")
    setRecEnvFile("")
    setREModal(false)
    setShowReceivedEnvelope(true)
    setShowSendEnvelope(false)
    setShowSearchedEnvelope(false)
    loadSavedData()
  }
  const showSendEnvelopeHandler = () => {
    searchedEnvelope=[]
    setShowSearchedEnvelope(false)
    setShowReceivedEnvelope(false)
    setShowSendEnvelope(true)
  }
  const showReceivedEnvelopeHandler = () => {
    searchedEnvelope=[]
    setShowSearchedEnvelope(false)
    setShowSendEnvelope(false)
    setShowReceivedEnvelope(true)
  }

  const DatePickerInput =(props) => {
    return <input className="date-picker__input px--1" {...props} />;
  }

  const searchBtnClickedHandler = (searchItem) => {
    if(searchItem.length < 1){
      searchedEnvelope=[]
      setShowSearchedEnvelope(false)
      setShowSendEnvelope(true)
      setShowReceivedEnvelope(false)
    }
   if (!showSearchedEnvelope && searchItem.length >= 1){
     if(showSendEnvelope){
       sendEnvelope.map((item, i) => {
         if(item[0] === 'send'){
           if(item[4].search(searchItem) !== -1){
             searchedEnvelope=[...searchedEnvelope, item]
           }else if(item[2].search(searchItem) !== -1){
             searchedEnvelope=[...searchedEnvelope, item]
           }else if(item[5].search(searchItem) !== -1){
             searchedEnvelope=[...searchedEnvelope, item]
           }else if(item[6].search(searchItem) !== -1){
             searchedEnvelope=[...searchedEnvelope, item]
           }}})
     }else if(showReceivedEnvelope){
       sendEnvelope.map((item, i) => {
         if(item[0] === 'receive'){
           if(item[4].search(searchItem) !== -1){
             searchedEnvelope=[...searchedEnvelope, item]
           }else if(item[2].search(searchItem) !== -1){
             searchedEnvelope=[...searchedEnvelope, item]
           }else if(item[9].search(searchItem) !== -1){
             searchedEnvelope=[...searchedEnvelope, item]
           }else if(item[5].search(searchItem) !== -1){
             searchedEnvelope=[...searchedEnvelope, item]
           }else if(item[6].search(searchItem) !== -1){
             searchedEnvelope=[...searchedEnvelope, item]
           }}})
     }
     setSearchedEnvelopeState([...searchedEnvelope]);
     setShowSearchedEnvelope(true)
   }
  }

  return (
    <React.Fragment>
      <Header
        makeSendEnvelope={()=>setSModal(true)}
        makeReceivedEnvelope={()=>setREModal(true)}
        showSendEnvelope={showSendEnvelopeHandler}
        showReceivedEnvelope={showReceivedEnvelopeHandler}
        searchBtnClicked={searchBtnClickedHandler}
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
            <div className='d-flex justify-content-between w-390 mb-1'>
              <DatePicker
                inputComponent={DatePickerInput}
                placeholder="انتخاب تاریخ"
                format="jYYYY/jMM/jDD"
                onChange={(unix, formatted)=>setSendEnvDate(formatted)}
                id="datePicker"
                preSelected={sendEnvDate}
              />
             <span>تاریخ</span>
            </div>
            <div className='d-flex justify-content-between w-390 mb-1'>
              <input className='px--1' dir='rtl' type="text" onChange={(e)=>setSendEnvSubject(e.target.value)} value={sendEnvSubject}/>
              <span>موضوع نامه</span>
            </div>
            <div className='d-flex justify-content-between w-390 mb-1'>
            <input className='px--1' dir='rtl' type="text" onChange={(e)=>setSendEnvReceiver(e.target.value)} value={sendEnvReceiver}/>
              <span>گیرنده نامه</span>
            </div>
            <div className='d-flex justify-content-between w-390 mb-1'>
            <input className='px--1' dir='rtl' type="text" onChange={(e)=>setSendEnvActor(e.target.value)} value={sendEnvActor}/>
              <span>اقدامگر</span>
            </div>
            <div className='d-flex justify-content-between w-390 mb-1'>
              <DatePicker
                inputComponent={DatePickerInput}
                placeholder="انتخاب تاریخ"
                format="jYYYY/jMM/jDD"
                onChange={(unix, formatted)=>setSendEnvSendDate(formatted)}
                id="datePicker"
                preSelected={sendEnvSendDate}
              />
              <span>تاریخ ارسال</span>
            </div>
            <div className='d-flex justify-content-between w-390'>
              <div className="btn d-flex">
                <input type="file" id="send-env-atach"  accept="image/jpeg,image/png,application/pdf,.xlsx"
                       onChange={(e)=>setSendEnvFile(e.target.files[0].path)}/>
              </div>
              <span>فایل نامه</span>
            </div>
            <div className='d-flex justify-content-between w-390'>
              <div className="btn d-flex">
                <input type="file" id="send-env-atach"  accept="image/jpeg,image/png,application/pdf,.xlsx"
                       onChange={(e)=>setSendEnvAtach(e.target.files[0].path)}/>
              </div>
              <span>فایل پیوست 1</span>
            </div>
            <div className='d-flex justify-content-between w-390'>
              <div className="btn d-flex">
                <input type="file" id="send-env-atach"  accept="image/jpeg,image/png,application/pdf,.xlsx"
                       onChange={(e)=>setSendEnvAtach2(e.target.files[0].path)}/>
              </div>
              <span>فایل پیوست 2</span>
            </div>
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
        <div className='d-flex flex-column'>
          <div className='d-flex justify-content-between w-390 mb-1'>
            <input className='px--1' dir='rtl' type="text" onChange={(e)=>setRecEnvNumber(e.target.value)} value={recEnvNumber}/>
            <span>شماره نامه</span>
          </div>
          <div className='d-flex justify-content-between w-390 mb-1'>
            <DatePicker
              inputComponent={DatePickerInput}
              placeholder="انتخاب تاریخ"
              format="jYYYY/jMM/jDD"
              onChange={(unix, formatted)=>setRecEnvDate(formatted)}
              id="datePicker"
              preSelected={recEnvDate}
            />
            <span>تاریخ</span>
          </div>
          <div className='d-flex justify-content-between w-390 mb-1'>
            <input className='px--1' dir='rtl' type="text" onChange={(e)=>setRecEnvSubject(e.target.value)} value={recEnvSubject}/>
            <span>موضوع نامه</span>
          </div>
          <div className='d-flex justify-content-between w-390 mb-1'>
            <input className='px--1' dir='rtl' type="text" onChange={(e)=>setRecEnvOwner(e.target.value)} value={recEnvOwner}/>
            <span>صاحب نامه</span>
          </div>
          <div className='d-flex justify-content-between w-390 mb-1'>
            <input className='px--1' dir='rtl' type="text" onChange={(e)=>setRecEnvActor(e.target.value)} value={recEnvActor}/>
            <span>مرجع رسیدگی کننده</span>
          </div>
          <div className='d-flex justify-content-between w-390 mb-1'>
            <DatePicker
              inputComponent={DatePickerInput}
              placeholder="انتخاب تاریخ"
              format="jYYYY/jMM/jDD"
              onChange={(unix, formatted)=>setRecEnvRecDate(formatted)}
              id="datePicker"
              preSelected={recEnvRecDate}
            />
            <span>تاریخ دریافت</span>
          </div>
          <div className='d-flex justify-content-between w-390'>
            <div className="btn d-flex">
              <input type="file" id="send-env-atach"  accept="image/jpeg,image/png,application/pdf,.xlsx"
                     onChange={(e)=>setRecEnvFile(e.target.files[0].path)}/>
            </div>
            <span>فایل نامه</span>
          </div>
          <div className='d-flex justify-content-between w-390'>
            <div className="btn d-flex">
              <input type="file" id="send-env-atach"  accept="image/jpeg,image/png,application/pdf,.xlsx"
                     onChange={(e)=>setRecEnvAtach(e.target.files[0].path)}/>
            </div>
            <span>فایل پیوست 1</span>
          </div>
          <div className='d-flex justify-content-between w-390'>
            <div className="btn d-flex">
              <input type="file" id="send-env-atach"  accept="image/jpeg,image/png,application/pdf,.xlsx"
                     onChange={(e)=>setRecEnvAtach2(e.target.files[0].path)}/>
            </div>
            <span>فایل پیوست 2</span>
          </div>

        </div>
      </MyModal>

      {(!showSearchedEnvelope && showSendEnvelope) && (
        <div className='table-container'>
          <div className='send-envelope__title my-2'>لیست نامه های ارسالی</div>
          <SendEnvList itemsToTrack={sendEnvelope} />
        </div>
      )}
      {(showSearchedEnvelope && showSendEnvelope) && (
        <div className='table-container'>
          <div className='send-envelope__title my-2'>جستجو در لیست نامه های ارسالی</div>
          <SendEnvList itemsToTrack={searchedEnvelopeState} />
        </div>
      )}
      {(!showSearchedEnvelope && showReceivedEnvelope) &&(
        <div className='table-container'>
          <div className='send-envelope__title my-2'>لیست نامه های دریافتی</div>
          <RecEnvList itemsToTrack={sendEnvelope}/>
        </div>
      )}
      {(showSearchedEnvelope && showReceivedEnvelope) &&(
        <div className='table-container'>
          <div className='send-envelope__title my-2'>جستجو در لیست نامه های دریافتی</div>
          <RecEnvList itemsToTrack={searchedEnvelopeState}/>
        </div>
      )}
    </React.Fragment>
  )
}

export default Home
