import React from 'react';
import {Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";

const MyModal = ({show, modalTitle ,closeBtnTitle, saveBtnTitle, children, onHide, onClick, onSave, saveBtnColor}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        {closeBtnTitle && <Button variant="secondary" onClick={onClick}>{closeBtnTitle}</Button>}
        <Button variant={saveBtnColor} onClick={onSave}>{saveBtnTitle}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MyModal
