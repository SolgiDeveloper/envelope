import React, {useState} from 'react';
import Table from "react-bootstrap/Table"
import Button from "react-bootstrap/Button";
import {removeDataFromStorage, pdfFileToShow} from "../renderer.js"
import './list.scss'
import MyModal from "./MyModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faPaperclip, faEnvelope} from "@fortawesome/fontawesome-free-solid";
const SendEnvList = ({itemsToTrack}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemId, setItemId] = useState(0);

  const deleteItemHandler = (item) => {
    removeDataFromStorage(item)
    setShowDeleteModal(false)
  }
  const callModal = (id) => {
    setShowDeleteModal(true)
    setItemId(id)
  }
  const callToOpenFile = (path) => {
    pdfFileToShow(path)
  }
  return (
    <React.Fragment>
        <MyModal
          modalTitle='حذف نامه ارسالی'
          saveBtnTitle='حذف'
          closeBtnTitle='انصراف'
          saveBtnColor='danger'
          onSave={() => deleteItemHandler(itemId)}
          show={showDeleteModal} onClick={()=>setShowDeleteModal(false)}
          onHide={()=>setShowDeleteModal(false)}>
          <span>آیا از حذف نامه اطمینان دارید؟</span>
        </MyModal>
        <Table striped bordered hover>
          <thead>
          <tr>
            <th></th>
            <th>فایل پیوست</th>
            <th>فایل نامه</th>
            <th>اقدامگر</th>
            <th>گیرنده نامه</th>
            <th>موضوع نامه</th>
            <th>تاریخ ارسال</th>
            <th>تاریخ</th>
            <th>شماره اندیکاتور</th>
          </tr>
          </thead>
          <tbody>
            {itemsToTrack.map((item, i) => {
              {if(item[0] === 'send') return (
                  <tr key={i + 1}>
                    <td>
                      <Button
                        variant="outline-danger"
                        onClick={() => callModal(item[1])}
                      >
                        <FontAwesomeIcon icon={faTrash}/>
                      </Button>
                    </td>
                    <td>
                    {item[8].length !== 0 ? (
                      <Button
                      variant="outline-success"
                      onClick={() => callToOpenFile(item[8])}>
                      <FontAwesomeIcon icon={faPaperclip}/>
                      </Button>) : "ندارد"}
                    </td>

                    <td>
                      {item[9].length !== 0 ? (
                        <Button
                          variant="outline-success"
                          onClick={() => callToOpenFile(item[9])}>
                          <FontAwesomeIcon icon={faEnvelope}/>
                        </Button>) : "ندارد"}
                    </td>
                    <td>{item[6]}</td>
                    <td>{item[5]}</td>
                    <td>{item[4]}</td>
                    <td>{item[7]}</td>
                    <td>{item[3]}</td>
                    <td>{item[2]}</td>
                  </tr>)}
            })}
          </tbody>
        </Table>
    </React.Fragment>
  )
}

export default SendEnvList;
