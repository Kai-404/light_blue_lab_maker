import React, { Component } from "react";
import { withRouter } from "react-router";
import { LinkContainer } from "react-router-bootstrap";
import { Card, CardColumns, Button, ButtonGroup } from "react-bootstrap";
import Addlab from "../Lab/Addlab";
import "../App.css";
import axios from "axios";

class LabsPage extends Component {
  state = {
    labList: []
  };

  componentDidMount() {
    this.getLabPage();
  }

  getLabPage = () => {
    axios
      .get("http://localhost:8080/getlablist", {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: { professor: this.props.user.username }
      })
      .then(res => {
        console.log("lab list: ", res.data);
        this.setState({ labList: res.data });
      });
  };

  render() {
    let labs = [];
    labs.push(
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>Lab #1</Card.Title>
          <Card.Text>Lab Description</Card.Text>
          <ButtonGroup>
            <LinkContainer to="/dolab">
              <Button variant="primary">Do</Button>
            </LinkContainer>
            <Button variant="primary">Edit</Button>
            <Button variant="primary">Delete</Button>
          </ButtonGroup>
        </Card.Body>
      </Card>
    );
    if (this.state.labList) {
      labs.pop();
      this.state.labList.map(lab => {
        labs.push(
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>{lab.title}</Card.Title>
              <Card.Text>{lab.description}</Card.Text>
              <ButtonGroup>
                <LinkContainer to="/dolab">
                  <Button variant="primary">Do</Button>
                </LinkContainer>
                <Button variant="primary">Edit</Button>
                <Button variant="primary">Delete</Button>
              </ButtonGroup>
            </Card.Body>
          </Card>
        );
      });
    }
    return (
      <React.Fragment>
        <CardColumns>{labs}</CardColumns>
        <Addlab user={this.props.user} his={this.props.history} />
      </React.Fragment>
    );
  }
}

export default withRouter(LabsPage);
