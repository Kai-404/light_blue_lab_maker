import React, { Component } from "react";
import { withRouter } from "react-router";
import { Card, ListGroup, Button } from "react-bootstrap";
import "../App.css";

class Discussion extends Component {
  render() {
    return (
      <Card>
        <Card.Body>
          <Card.Title as="h1" align="left">
            Discussion
          </Card.Title>
          <Card>
            <Card.Body>
              <Card.Title as="h4" align="left">
                Hello World
              </Card.Title>
              <Card.Text align="left">
                "Hello World!" from Light Blue Lab Maker
              </Card.Text>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    );
  }
}

export default withRouter(Discussion);
