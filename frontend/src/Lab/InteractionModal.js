import React, { Component } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";

class InteractionModal extends Component {
  render() {
    return (
      <React.Fragment>
        <Modal
          centered
          show={this.props.show}
          onHide={this.props.setShowM}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header>
            <Modal.Title id="example-custom-modal-styling-title">
              {this.props.interaction.Name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form></Form>
          </Modal.Body>
          <Modal.Footer>{this.props.interaction.Description}</Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default InteractionModal;
