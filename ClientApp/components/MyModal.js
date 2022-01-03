import React from 'react';
import {Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";

const MyModal = ({show, modalTitle ,closeBtnTitle, saveBtnTitle, children, onHide, onClick, onSave}) => {
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
        <Button variant="primary" onClick={onSave}>{saveBtnTitle}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MyModal
