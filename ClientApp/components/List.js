import React, {useState} from 'react';
import Table from "react-bootstrap/Table"
import Button from "react-bootstrap/Button";
import {removeDataFromStorage} from "../renderer.js"
import './list.scss'
import MyModal from "./MyModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/fontawesome-free-solid";
const List = ({itemsToTrack}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteItemHandler = (item) => {
    removeDataFromStorage(item)
  }
  return (
    <React.Fragment>
        <Table striped bordered hover>
          <thead>
          <tr>
            <th></th>
            <th>پیوست</th>
            <th>تاریخ ارسال</th>
            <th>اقدامگر</th>
            <th>گیرنده نامه</th>
            <th>موضوع نامه</th>
            <th>تاریخ</th>
            <th>شماره نامه</th>
          </tr>
          </thead>
          <tbody>
            {itemsToTrack.map((item, i) => {
              return (
                <tr key={i+1}>
                  <td>
                    <Button
                      variant="outline-danger"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                    <MyModal
                      modalTitle='حذف نامه ارسالی'
                      saveBtnTitle='حذف'
                      closeBtnTitle='انصراف'
                      onSave={() => deleteItemHandler(item[0])}
                      show={showDeleteModal} onClick={()=>setShowDeleteModal(false)}
                      onHide={()=>setShowDeleteModal(false)}>
                      <span>آیا از حذف نامه اطمینان دارید؟</span>
                    </MyModal>
                  </td>
                  <td>{item[0]}</td>
                  <td>{item[1]}</td>
                  <td>{item[1]}</td>
                  <td>{item[1]}</td>
                  <td>{item[1]}</td>
                  <td>{item[1]}</td>
                  <td>{item[1]}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
    </React.Fragment>
  )
}

export default List;
