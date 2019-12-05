import React, { Component } from "react";
import { withRouter } from "react-router";
import { Button, Col, InputGroup, Form, Modal } from "react-bootstrap";
import axios from "axios";
import "../App.css";

class AddAnnouncement extends Component {
  state = {
    validated: false,
    showAddAnnoun: false,
    announTitle: "",
    content: ""
  };

  setShowAdd = () => {
    this.setState({ showAddAnnoun: !this.state.showAddAnnoun });
  };

  addNewAnnouncement = event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      let title = this.state.announTitle;
      let content = this.state.content;
      let courseId = this.props.courseId;
      let data = JSON.stringify({
        courseId,
        title,
        content
      });
      axios
        .post("http://localhost:8080/newAnnouncement", data, {
          headers: { "Content-Type": "application/json;charset=UTF-8" },
          params: { courseId: courseId, title: title, content: content }
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
        content: ""
      });
    }
    this.setState({ validated: true });
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <React.Fragment>
        <Button
          variant="info"
          className="submitButton"
          onClick={this.setShowAdd}
        >
          Add Announcement
        </Button>

        <Modal show={this.state.showAddAnnoun} onHide={this.setShowAdd}>
          <Modal.Header>
            <Modal.Title>New Announcement</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              noValidate
              validated={this.state.validated}
              onSubmit={this.addNewAnnouncement}
            >
              <Form.Label>Announcement Title</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  name="announTitle"
                  value={this.state.announTitle}
                  onChange={this.onChange}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a title.
                </Form.Control.Feedback>
              </InputGroup>

              <Form.Label>Content</Form.Label>
              <InputGroup>
                <Form.Control
                  as="textarea"
                  rows="3"
                  required
                  name="content"
                  value={this.state.content}
                  onChange={this.onChange}
                />
                <Form.Control.Feedback type="invalid">
                  Please add content.
                </Form.Control.Feedback>
              </InputGroup>
              <Button variant="dark" type="submit">
                Add
              </Button>
              <Button variant="dark" onClick={this.setShowAdd}>
                Cancel
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}

export default AddAnnouncement;
