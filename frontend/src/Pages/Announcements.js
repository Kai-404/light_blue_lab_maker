import React, { Component } from "react";
import { withRouter } from "react-router";
import { Card, ListGroup, Button } from "react-bootstrap";
import "../App.css";

class Announcements extends Component {
  render() {
    return (
      <Card>
        <Card.Body>
          <Card.Title as="h1" align="left">
            Announcements
          </Card.Title>
          <Card>
            <Card.Body>
              <Card.Title as="h4" align="left">
                Announcement Title
              </Card.Title>
              <Card.Text align="left">Announcement context goes here</Card.Text>
            </Card.Body>
          </Card>
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

export default withRouter(Announcements);
