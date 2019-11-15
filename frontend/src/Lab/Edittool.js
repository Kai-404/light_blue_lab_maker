import React, { Component } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "../App.css";
import axios from "axios";

class Addtool extends Component {
  state = {
    show: false
  };

  setShow = () => {
    this.setState({ show: !this.state.show });
    this.props.show = this.state.show;
  };

  render() {
    return (
      <React.Fragment>
        <Modal
          show={this.state.show}
          onHide={this.setShow}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header>
            <Modal.Title id="example-custom-modal-styling-title">
              {"toolName"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Size</Form.Label>
                <Form.Control placeholder="100ml" />
                <Form.Text className="text-muted">---------------</Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Addtool;
