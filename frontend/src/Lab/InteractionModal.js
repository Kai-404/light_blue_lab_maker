import React, { Component } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";

class InteractionModal extends Component {
  render() {
    return (
      <React.Fragment>
        <Modal
          size="sm"
          centered
          show={this.props.show}
          onHide={this.props.setShow}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header>
            <Modal.Title id="example-custom-modal-styling-title">
              {this.props.interaction.Name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Label>{this.props.interaction.Prams.PramName}</Form.Label>
              <Col sm={10}>
                <input
                  type="range"
                  className="custom-range"
                  min="0"
                  //max will be the current volume of the beaker
                  max="100"
                  defaultValue={this.props.interaction.Prams.Value}
                />
              </Col>
            </Form>
          </Modal.Body>
          <Modal.Footer>{this.props.interaction.Description}</Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default InteractionModal;
