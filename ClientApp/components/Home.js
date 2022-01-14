import React, {useState, useEffect} from 'react';
import {loadSavedData, removeDataFromStorage, saveDataInStorage} from "../renderer.js";
import SendEnvList from "./SendEnvList";
import Header from "./Header";
const { ipcRenderer } = require("electron");
const { HANDLE_FETCH_DATA, HANDLE_SAVE_DATA, HANDLE_REMOVE_DATA } = require("../../utils/constants")
import './home.scss'
import MyModal from "./MyModal";
import {DatePicker} from "react-advance-jalaali-datepicker";
import RecEnvList from "./RecEnvList";
import { ToastContainer, toast } from 'react-toastify';
import './ReactToastify.css';
const Home = () => {
  const [sendEnvDate, setSendEnvDate] = useState("");
  const [sendEnvSubject, setSendEnvSubject] = useState("");
  const [sendEnvReceiver, setSendEnvReceiver] = useState("");
  const [sendEnvActor, setSendEnvActor] = useState("");
  const [sendEnvSendDate, setSendEnvSendDate] = useState("");
  const [sendEnvAtach, setSendEnvAtach] = useState("");
  const [sendEnvAtach2, setSendEnvAtach2] = useState("");
  const [sendEnvFile, setSendEnvFile] = useState("");
  const [editingSendEnv, setEditingSendEnv] = useState(false)
  const [editingSendEnvId, setEditingSendEnvId] = useState(0)

  const [recEnvNumber, setRecEnvNumber] = useState("");
  const [recEnvDate, setRecEnvDate] = useState("");
  const [recEnvSubject, setRecEnvSubject] = useState("");
  const [recEnvOwner, setRecEnvOwner] = useState("");
  const [recEnvActor, setRecEnvActor] = useState("");
  const [recEnvRecDate, setRecEnvRecDate] = useState("");
  const [recEnvAtach, setRecEnvAtach] = useState("");
  const [recEnvAtach2, setRecEnvAtach2] = useState("");
  const [recEnvFile, setRecEnvFile] = useState("");
  const [editingResEnv, setEditingResEnv] = useState(false)
  const [editingResEnvId, setEditingResEnvId] = useState(0)

  // all envelop items
  const [sendEnvelope, setSendEnvelope] = useState([]);
  const [searchedEnvelopeState, setSearchedEnvelopeState] = useState([]);

  const [SModal, setSModal] = useState(false);
  const [REModal, setREModal] = useState(false);
  const [expiry, setExpiry] = useState(false);

  const [showReceivedEnvelope, setShowReceivedEnvelope] = useState(false);
  const [showSendEnvelope, setShowSendEnvelope] = useState(true);
  const [showSearchedEnvelope, setShowSearchedEnvelope] = useState(false);

  let searchedEnvelope = [];
  const realDate =  Date.now();
  const localExpiry = localStorage.getItem('localExpiry');
  const expiryDate = 1695414600000
  // Grab the user's saved sendEnvelope after the app loads
  useEffect(() => {
    loadSavedData();
    checkExpiry();
  }, []);
  const checkExpiry = () => {
    if(realDate > expiryDate){
      setExpiry(true)
      localStorage.setItem('localExpiry', 'true');
    }
  }
  // Listener functions that receive messages from main
  useEffect(() => {
    checkExpiry();
    ipcRenderer.on(HANDLE_SAVE_DATA, handleNewItem);
    // If we omit the next step, we will cause a memory leak and & exceed max listeners
    return () => {
      ipcRenderer.removeListener(HANDLE_SAVE_DATA, handleNewItem);
    }
  });
  useEffect(() => {
    checkExpiry();
    ipcRenderer.on(HANDLE_FETCH_DATA, handleReceiveData);
    return () => {
      ipcRenderer.removeListener(HANDLE_FETCH_DATA, handleReceiveData);
    }
  });
  useEffect(() => {
    checkExpiry();
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
    if(editingSendEnv){
      removeDataFromStorage(editingSendEnvId);
      id = editingSendEnvId;
    }else {
      if (sendEnvelope.length === 0){
        id = sendEnvelope.length
        localStorage.setItem('envId', id )
      }else{
        id = Number(localStorage.getItem('envId')) + 1
        localStorage.setItem('envId', id)
      }
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
    data[11] = ["admin"]
    setTimeout(()=>{
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
      loadSavedData();
      setEditingSendEnv(false);
      editingSendEnv && toast.info('نامه با موفقیت ویرایش شد.', {theme: 'colored'});
      !editingSendEnv && toast.success('نامه با موفقیت افزوده شد.', {theme: 'colored'});
    },200)
  }
  // Send the ReceivedEnvelope to main.js
  const addReceivedEnvelope = () => {
    let id
    if(editingResEnv){
      removeDataFromStorage(editingResEnvId);
      id = editingResEnvId;
    }else {
      if (sendEnvelope.length === 0){
        id = sendEnvelope.length
        localStorage.setItem('envId', id)
      }else{
        id = Number(localStorage.getItem('envId')) + 1
        localStorage.setItem('envId', id)
    }}
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
    data[12] = ["admin"]
    setTimeout(()=>{
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
      loadSavedData();
      setEditingResEnv(false)
      editingResEnv && toast.info('نامه با موفقیت ویرایش شد.', {theme: 'colored'});
      !editingResEnv && toast.success('نامه با موفقیت افزوده شد.', {theme: 'colored'});
    },200)
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
    if(!localStorage.getItem('envId')){
      return localStorage.setItem('envId', `${searchItem}`)
    }
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
  const sendEnvToEdit = (item) => {
    setEditingSendEnv(true)
    setSendEnvDate(item[3])
    setSendEnvSendDate(item[7])
    setSendEnvSubject(item[4])
    setSendEnvReceiver(item[5])
    setSendEnvActor(item[6])
    setEditingSendEnvId(item[1])
    setSModal(true)
  }
  const closeSModal = () => {
    setSModal(false)
    setEditingSendEnv(false)
    setSendEnvDate("")
    setSendEnvSubject("")
    setSendEnvReceiver("")
    setSendEnvActor("")
    setSendEnvSendDate("")
    setSendEnvAtach("")
    setSendEnvAtach2("")
    setSendEnvFile("")
  }
  const resEnvToEdit = (item) => {
    setEditingResEnv(true)
    setEditingResEnvId(item[1])
    setRecEnvDate(item[3])
    setRecEnvSubject(item[4])
    setRecEnvOwner(item[5])
    setRecEnvActor(item[6])
    setRecEnvRecDate(item[7])
    setRecEnvNumber(item[9])
    setREModal(true)
  }
  const closeREModal = () => {
    setREModal(false)
    setEditingResEnv(false)
    setRecEnvDate("")
    setRecEnvSubject("")
    setRecEnvOwner("")
    setRecEnvActor("")
    setRecEnvRecDate("")
    setRecEnvAtach("")
    setRecEnvAtach2("")
    setRecEnvNumber("")
    setRecEnvFile("")
  }
  return (
    <React.Fragment>
      { (expiry || localExpiry) && <div className='expiry-layout d-flex flex-column justify-content-center align-items-start'>
        <div className='m-auto'>
          <div className="expiry-container d-flex flex-column align-items-start">
            <p dir='rtl'>اعتبار لایسنس نرم افزار به پایان رسیده است. لطفا برای تهیه لایسنس با برنامه نویس تماس حاصل فرمایید.</p>
            <p>09337985568</p>
          </div>
        </div>
      </div>}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover/>
      <Header
        makeSendEnvelope={()=>setSModal(true)}
        makeReceivedEnvelope={()=>setREModal(true)}
        showSendEnvelope={showSendEnvelopeHandler}
        showReceivedEnvelope={showReceivedEnvelopeHandler}
        searchBtnClicked={searchBtnClickedHandler}
      />

      <MyModal
        modalTitle={editingSendEnv ? 'ویرایش نامه ارسالی' :'ایجاد نامه ارسالی'}
        saveBtnTitle='ذخیره'
        closeBtnTitle='بستن'
        saveBtnColor='success'
        onSave={addSendEnvelope}
        show={SModal} onClick={closeSModal}
        onHide={closeSModal}>
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
            {editingSendEnv && <div className='error-in-editing'>فایل نامه و پیوست ها را مجدد وارد کنید!</div>}
            <div className='d-flex justify-content-between w-390'>
              <div className="btn input-file__holder d-flex">
                <input type="file" id="send-env-atach"  accept="image/jpeg,image/png,application/pdf,.xlsx"
                       onChange={(e)=>setSendEnvFile(e.target.files[0].path)}/>
              </div>
              <span>فایل نامه</span>
            </div>
            <div className='d-flex justify-content-between w-390'>
              <div className="btn input-file__holder d-flex">
                <input type="file" id="send-env-atach"  accept="image/jpeg,image/png,application/pdf,.xlsx"
                       onChange={(e)=>setSendEnvAtach(e.target.files[0].path)}/>
              </div>
              <span>فایل پیوست 1</span>
            </div>
            <div className='d-flex justify-content-between w-390'>
              <div className="btn input-file__holder d-flex">
                <input type="file" id="send-env-atach"  accept="image/jpeg,image/png,application/pdf,.xlsx"
                       onChange={(e)=>setSendEnvAtach2(e.target.files[0].path)}/>
              </div>
              <span>فایل پیوست 2</span>
            </div>
          </div>
      </MyModal>

      <MyModal
        modalTitle={editingResEnv ? 'ویرایش نامه دریافتی' :'ایجاد نامه دریافتی'}
        saveBtnTitle='ذخیره'
        closeBtnTitle='بستن'
        saveBtnColor='success'
        onSave={addReceivedEnvelope}
        show={REModal} onClick={closeREModal}
        onHide={closeREModal}>
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
          {editingResEnv && <div className='error-in-editing'>فایل نامه و پیوست ها را مجدد وارد کنید!</div>}
          <div className='d-flex justify-content-between w-390'>
            <div className="btn input-file__holder d-flex">
              <input type="file" id="send-env-atach"  accept="image/jpeg,image/png,application/pdf,.xlsx"
                     onChange={(e)=>setRecEnvFile(e.target.files[0].path)}/>
            </div>
            <span>فایل نامه</span>
          </div>
          <div className='d-flex justify-content-between w-390'>
            <div className="btn input-file__holder d-flex">
              <input type="file" id="send-env-atach"  accept="image/jpeg,image/png,application/pdf,.xlsx"
                     onChange={(e)=>setRecEnvAtach(e.target.files[0].path)}/>
            </div>
            <span>فایل پیوست 1</span>
          </div>
          <div className='d-flex justify-content-between w-390'>
            <div className="btn input-file__holder d-flex">
              <input type="file" id="send-env-atach"  accept="image/jpeg,image/png,application/pdf,.xlsx"
                     onChange={(e)=>setRecEnvAtach2(e.target.files[0].path)}/>
            </div>
            <span>فایل پیوست 2</span>
          </div>

        </div>
      </MyModal>

      {(!showSearchedEnvelope && showSendEnvelope) && (
        <div>
          <div className='send-envelope__title my-2'>لیست نامه های ارسالی</div>
          <div className='table-container'>
            <SendEnvList itemsToTrack={sendEnvelope} sendEnvToEdit={sendEnvToEdit} />
          </div>
        </div>
      )}
      {(showSearchedEnvelope && showSendEnvelope) && (
        <div>
          <div className='send-envelope__title my-2'>جستجو در لیست نامه های ارسالی</div>
          <div className='table-container'>
            <SendEnvList itemsToTrack={searchedEnvelopeState} sendEnvToEdit={sendEnvToEdit}/>
          </div>
        </div>
      )}
      {(!showSearchedEnvelope && showReceivedEnvelope) &&(
        <div>
          <div className='send-envelope__title my-2'>لیست نامه های دریافتی</div>
          <div className='table-container'>
            <RecEnvList itemsToTrack={sendEnvelope} resEnvToEdit={resEnvToEdit}/>
          </div>
        </div>
      )}
      {(showSearchedEnvelope && showReceivedEnvelope) &&(
        <div>
          <div className='send-envelope__title my-2'>جستجو در لیست نامه های دریافتی</div>
          <div className='table-container'>
            <RecEnvList itemsToTrack={searchedEnvelopeState} resEnvToEdit={resEnvToEdit}/>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default Home
