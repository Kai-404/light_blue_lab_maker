import React, { Component } from "react";
import { withRouter } from "react-router";
import { Table } from "react-bootstrap";

class Discussion extends Component {
  render() {
    return (
      <React.Fragment>
        <br /> <br />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Lab Name</th>
              <th>Grade</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Lab 1</td>
              <td>89</td>
              <td>10/30/19</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Lab 2</td>
              <td>89</td>
              <td>10/30/19</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Lab 3</td>
              <td>89</td>
              <td>10/30/19</td>
            </tr>
          </tbody>
        </Table>
      </React.Fragment>
    );
  }
}

export default withRouter(Discussion);