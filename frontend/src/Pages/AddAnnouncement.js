import React, { Component } from "react";
import { withRouter } from "react-router";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import "../App.css";

class AddAnnouncement extends Component {
  state = {
    showAddAnnoun: false,
    announTitle: "",
    context: ""
  };

  setShowAdd = () => {
    this.setState({ showAddAnnoun: !this.state.showAddAnnoun });
  };

  addNewAnnouncement = () => {
    let title = this.state.announTitle;
    let context = this.state.context;
    let data = JSON.stringify({
      title,
      context
    });
    axios
      .post("http://localhost:8080/newAnnouncement", data, {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: { title: title, context: context }
      })
      .then(res => {
        this.props.his.push("/announcements");
      })
      .catch(err => {
        alert("Fail to add a new announcement");
      });
    this.setState({
      showAddAnnoun: false,
      announTitle: "",
      context: ""
    });
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <div>
        <Button variant="info" className="submitButton" onClick={this.setShowAdd}>
          Add Announcement
        </Button>

        <Modal show={this.state.showAddAnnoun} onHide={this.setShowAdd}>
          <Modal.Header>
            <Modal.Title>New Announcement</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              Announcement
              <br />
              <input
                className="input"
                name="announTitle"
                value={this.state.announTitle}
                onChange={this.onChange}
              ></input>
              <br />
              <br />
              Context
              <br />
              <input
                className="input"
                name="context"
                value={this.state.context}
                onChange={this.onChange}
              ></input>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="dark" onClick={this.addNewAnnouncement}>
              Add
            </Button>
            <Button variant="dark" onClick={this.setShowAdd}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default AddAnnouncement;
