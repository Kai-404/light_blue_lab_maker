import React, { Component } from "react";
import { withRouter } from "react-router";
import { Card, CardColumns, Button } from "react-bootstrap";
import "../App.css";

class LabsPage extends Component {
  dolab = () => {
    this.props.history.push("/dolab");
  };

  render() {
    return (
      <CardColumns>
        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src="holder.js/100px180" />
          <Card.Body>
            <Card.Title>Lab #1</Card.Title>
            <Card.Text>Lab Description</Card.Text>
            <Button variant="primary" onClick={this.dolab}>
              Do Lab
            </Button>
          </Card.Body>
        </Card>

        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src="holder.js/100px180" />
          <Card.Body>
            <Card.Title>Lab #2</Card.Title>
            <Card.Text>Lab Description</Card.Text>
            <Button variant="primary">Do Lab</Button>
          </Card.Body>
        </Card>

        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src="holder.js/100px180" />
          <Card.Body>
            <Card.Title>Lab #3</Card.Title>
            <Card.Text>Lab Description</Card.Text>
            <Button variant="primary">Do Lab</Button>
          </Card.Body>
        </Card>
      </CardColumns>
    );
  }
}

export default withRouter(LabsPage);
