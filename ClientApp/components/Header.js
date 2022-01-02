import React from "react";
import {Container, Form, FormControl, Navbar} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/fontawesome-free-solid'
import './header.scss'
export default () => {
  return (
    <Navbar bg="light">
      <Container fluid className='d-flex flex-row-reverse justify-content-start'>
        <Button> نامه های ارسالی</Button>
        <Button className='mx-2'>نامه های دریافتی</Button>
          <Form className="d-flex">
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
