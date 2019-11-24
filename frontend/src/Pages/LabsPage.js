import React, { Component } from "react";
import { withRouter } from "react-router";
import { LinkContainer } from "react-router-bootstrap";
import { Card, CardColumns, Button, ButtonGroup, Form } from "react-bootstrap";
import Addlab from "../Lab/Addlab";
import axios from "axios";
import "./labsPage.css";

class LabsPage extends Component {
  state = {
    labList: [],
    currentLab: [],
    message: "",
    searchInput: "" //lab name for search
  };

  componentDidMount() {
    //this.getLabPage();
  }

  getLabPage = () => {
    axios
      .get("http://localhost:8080/getlablist", {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: { professor: this.props.user.username }
      })
      .then(res => {
        this.setState({ labList: res.data });
        console.log("lab list: ", this.state.labList);
      });
  };

  deleteLab = id => {
    console.log(id);
    axios
      .get("http://localhost:8080//deletelab", {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: { id: id }
      })
      .then(res => {
        if (res.data) {
          this.setState({ labList: res.data });
          alert("lab is being delete");
        } else {
          alert("Cannot delete this lab");
        }
      })
      .catch(err => {
        alert("Cannot delete this lab now, try again later");
      });
  };

  editLab = id => {
    axios
      .get("http://localhost:8080//editlab", {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: { id: id }
      })
      .then(res => {
        this.setState({ currentLab: res.data });
      })
      .catch(err => {
        alert("Cannot load the lab to edit, try again later");
      });
  };

  handleOnChange = e => {
    this.setState({ message: "" });
  };

  searchLab = e => {
    if (e.key === "Enter") {
      axios
        .get("http://localhost:8080//searchlab", {
          headers: { "Content-Type": "application/json;charset=UTF-8" },
          params: { id: this.state.searchInput }
        })
        .then(res => {
          this.setState({ currentLab: res.data, messgae: "" });
        })
        .catch(err => {
          this.setState({ message: "No such lab" });
        });
    }
  };

  render() {
    let labs = [];
    labs.push(
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Text>
            You don't have any lab yet, click "Add" button to create a new lab
          </Card.Text>
        </Card.Body>
      </Card>
    );
    if (this.state.labList.length > 0) {
      labs.pop();
      this.state.labList.map(lab => {
        let buttonGroup = (
          <ButtonGroup>
            <LinkContainer to="/dolab">
              <Button variant="primary">Do</Button>
            </LinkContainer>
            <Button variant="primary" onClick={() => this.editLab(lab.id)}>
              Edit
            </Button>
            <Button variant="primary" onClick={() => this.deleteLab(lab.id)}>
              Delete
            </Button>
          </ButtonGroup>
        );
        if (lab.published) {
          buttonGroup = (
            <ButtonGroup>
              <LinkContainer to="/dolab">
                <Button variant="primary">Do</Button>
              </LinkContainer>
            </ButtonGroup>
          );
        }

        labs.push(
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>{lab.title}</Card.Title>
              <Card.Text>{lab.description}</Card.Text>
              {buttonGroup}
            </Card.Body>
          </Card>
        );
      });
    }
    return (
      <React.Fragment>
        <p className="errmsg">{this.state.message}</p>
        <Form.Control
          className="control"
          type="search"
          placeholder="Search by Lab Name"
          input={this.state.searchInput}
          onKeyPress={this.searchLab}
          onChange={this.handleOnChange}
        />
        <br />
        <>
          <CardColumns>{labs}</CardColumns>
        </>
        <Addlab user={this.props.user} his={this.props.history} />
      </React.Fragment>
    );
  }
}

export default withRouter(LabsPage);
