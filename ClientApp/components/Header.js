import React from "react";
import {Container, DropdownButton,Dropdown, Form, FormControl, Navbar} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faEnvelope } from '@fortawesome/fontawesome-free-solid'
import './header.scss'
export default ({makeSendEnvelope, showSendEnvelope, makeReceivedEnvelope, showReceivedEnvelope}) => {
  return (
    <Navbar bg="light">
      <Container fluid className='d-flex flex-row-reverse justify-content-start'>
        <Dropdown>
          <Dropdown.Toggle variant="primary" dir='rtl'>
            <FontAwesomeIcon icon={faEnvelope} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#"> <Button onClick={showSendEnvelope} className='dropdown-item'> نامه های ارسالی</Button></Dropdown.Item>
            <Dropdown.Item href="#"><Button onClick={makeSendEnvelope} className='dropdown-item'>ایجاد نامه ارسالی</Button></Dropdown.Item>
            <Dropdown.Item href="#"><Button onClick={showReceivedEnvelope} className='dropdown-item'>نامه های دریافتی</Button></Dropdown.Item>
            <Dropdown.Item href="#"><Button onClick={makeReceivedEnvelope} className='dropdown-item'>ایجاد نامه دریافتی</Button></Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

          <Form className="d-flex mr-1">
            <Button className="mr-1" variant="outline-success">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
            <FormControl
              dir='rtl'
              type="search"
              placeholder="جستجو"
              className="me-2 search-bar"
              aria-label="Search"
            />
          </Form>
      </Container>
    </Navbar>
  );
};
