import React, {useEffect} from "react";
import {Container, Dropdown, Form, FormControl, Navbar} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faEnvelope } from '@fortawesome/fontawesome-free-solid'
import './header.scss'
export default ({makeSendEnvelope, showSendEnvelope, makeReceivedEnvelope, showReceivedEnvelope, searchBtnClicked}) => {
  const submitClickedHandler = (event) => {
    event.preventDefault();
    searchBtnClicked(event.target.search.value)
  }
  useEffect(() => {
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        console.log(event.path[0].target.value);
        event.preventDefault();
        searchBtnClicked(event.path[0].value)
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

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

          <Form className="d-flex mr-1" onSubmit={submitClickedHandler}>
            <Button className="mr-1" variant="outline-success" type='submit'>
              <FontAwesomeIcon icon={faSearch} />
            </Button>
            <FormControl
              dir='rtl'
              type="search"
              name="search"
              placeholder="جستجو"
              className="me-2 search-bar"
              aria-label="Search"
            />
          </Form>
      </Container>
    </Navbar>
  );
};
