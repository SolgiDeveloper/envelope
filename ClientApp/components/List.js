import React from 'react';
import Table from "react-bootstrap/Table"
import Button from "react-bootstrap/Button";
import {removeDataFromStorage} from "../renderer.js"
import './list.scss'
const List = ({itemsToTrack}) => {
  return (
    <Table striped bordered hover>
      <thead>
      <tr>
        <th></th>
        <th>Item</th>
        <th>Item</th>
        <th>Item</th>
        <th>Item</th>
        <th>Item</th>
        <th>Item</th>
        <th>Item</th>
      </tr>
      </thead>
      <tbody>
        {itemsToTrack.map((item, i) => {
          return (
            <tr key={i+1}>
              <td>
                <Button
                  variant="outline-danger"
                  onClick={() => removeDataFromStorage(item[0])}
                >حذف</Button>
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
  )
}

export default List;
