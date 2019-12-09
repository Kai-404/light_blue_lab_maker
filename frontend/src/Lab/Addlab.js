import React, { Component } from "react";
import { withRouter } from "react-router";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import "../App.css";

class Addlab extends Component {
  state = {
    showAddLab: false,
    labTitle: "",
    description: ""
  };

  setShowAddLab = () => {
    this.setState({ showAddLab: !this.state.showAddLab });
  };

  addNewLab = () => {
    let title = this.state.labTitle;
    //for testing
    let author = "kai";
    if (sessionStorage.getItem("username")) author = sessionStorage.getItem("username");
    let description = this.state.description;
    let data = JSON.stringify({
      author,
      title,
      description
    });
    axios
      .post("http://localhost:8080/newlab", data, {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: { title: title, author: author, description: description }
      })
      .then(res => {
        this.props.his.push("/makelab");
      })
      .catch(err => {
        alert("Fail to add a new lab");
      });
    this.setState({
      showAddLab: false,
      labTitle: "",
      description: ""
    });
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <div>
        <Button variant="info" onClick={this.setShowAddLab}>
          Add Lab
        </Button>

        <Modal show={this.state.showAddLab} onHide={this.setShowAddLab}>
          <Modal.Header>
            <Modal.Title>Add a Lab</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              Lab Name
              <br />
              <input
                className="input"
                name="labTitle"
                value={this.state.courseName}
                onChange={this.onChange}
              ></input>
              <br />
              <br />
              Discription
              <br />
              <input
                className="input"
                name="description"
                value={this.state.term}
                onChange={this.onChange}
              ></input>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="info" onClick={this.addNewLab}>
              Add
            </Button>
            <Button variant="info" onClick={this.setShowAddLab}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Addlab;
