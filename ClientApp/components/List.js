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
  const [itemId, setItemId] = useState(0);

  const deleteItemHandler = (item) => {
    removeDataFromStorage(item)
    setShowDeleteModal(false)
  }
  const callModal = (id) => {
    setShowDeleteModal(true)
    setItemId(id)
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
                      onClick={()=> callModal(item[1])}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                  <td>{item[1]}</td>
                  <td>{item[7]}</td>
                  <td>{item[6]}</td>
                  <td>{item[5]}</td>
                  <td>{item[4]}</td>
                  <td>{item[3]}</td>
                  <td>{item[2]}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
    </React.Fragment>
  )
}

export default List;
