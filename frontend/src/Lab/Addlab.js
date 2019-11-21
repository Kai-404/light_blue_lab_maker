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
    //let author = this.props.user.username;
    let author = "kai";
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
        <Button onClick={this.setShowAddLab}>Add Lab</Button>

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
            <Button onClick={this.addNewLab}>Add</Button>
            <Button onClick={this.setShowAddLab}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Addlab;
