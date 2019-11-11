import React, { Component } from "react";
import { withRouter } from "react-router";
import { Card, CardColumns, Button } from "react-bootstrap";
import "../App.css";
import axios from "axios";

class LabsPage extends Component {
  dolab = () => {
    this.props.history.push("/dolab");
  };
  //TODO: Zoey will do it!!! just a placeholder
  makeLab = () => {
    let index1 = "kai_lab";
    let index2 = "kai";
    let data = JSON.stringify({
      index1,
      index2
    });
    axios
      .post("http://localhost:8080/newlab", data, {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: { title: index1, author: index2 }
      }
      )
      .then(res => {
        this.props.history.push("/makelab");
      });
  };

  render() {
    return (
      <React.Fragment>
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
        <Button onClick={this.makeLab}>Add Lab</Button>
      </React.Fragment>
    );
  }
}

export default withRouter(LabsPage);
