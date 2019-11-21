import React, { Component } from "react";
import { withRouter } from "react-router";
import { LinkContainer } from "react-router-bootstrap";
import { Card, CardColumns, Button } from "react-bootstrap";
import Addlab from "../Lab/Addlab";
import "../App.css";
import axios from "axios";

class LabsPage extends Component {
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
      })
      .then(res => {
        this.props.history.push("/makelab");
      });
  };

  render() {
    return (
      <React.Fragment>
        <CardColumns>
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>Lab #1</Card.Title>
              <Card.Text>Lab Description</Card.Text>
              <LinkContainer to="/dolab">
                <Button variant="primary">Do Lab</Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </CardColumns>
        <Addlab user={this.props.user} his={this.props.history} />
      </React.Fragment>
    );
  }
}

export default withRouter(LabsPage);
