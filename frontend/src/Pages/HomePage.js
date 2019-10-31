import React, { Component } from "react";
import { withRouter } from "react-router";
import { Card, ListGroup, Button } from "react-bootstrap";
import "../App.css";

class HomePage extends Component {
  render() {
    return (
      <ListGroup>

        <Card>
          <Card.Header>CSE 308 - Fall 2019</Card.Header>
          <Card.Body>
            <Card.Title>Software Engineering</Card.Title>
            <Card.Text>
              Richard McKenna
            </Card.Text>
            <Button variant="primary">Go to the course</Button>
          </Card.Body>
        </Card>
        <br>
        </br>
        <Card>
          <Card.Header>Course Name- Term</Card.Header>
          <Card.Body>
            <Card.Title>Course Title</Card.Title>
            <Card.Text>
              Instructor Name
            </Card.Text>
            <Button variant="primary">Go to the course</Button>
          </Card.Body>
        </Card>
        <br>
        </br>
        <Button variant="primary">Add course</Button>
      </ListGroup>

    );
  }
}

export default withRouter(HomePage);