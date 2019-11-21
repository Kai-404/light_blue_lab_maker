import React, { Component } from "react";
import { withRouter } from "react-router";
import { LinkContainer } from "react-router-bootstrap";
import { Card, CardColumns, Button } from "react-bootstrap";
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
