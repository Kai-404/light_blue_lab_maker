import React, { Component } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";

class InteractionModal extends Component {
  state = {
    currentValue: 0
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    console.log(this.props.sourceTool);
    let maxValue;

    this.props.sourceTool.Prop.forEach(prop => {
      if (prop.Name == "Current Volume") {
        maxValue = prop.Value;
      }
    });

    this.props.destinationTool.Prop.forEach(prop => {
      if (prop.Name == "Current Volume" && maxValue < prop.Value) {
        maxValue = prop.Value;
      }
    });

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
              {this.props.interaction.Name} : {this.state.currentValue}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Label>{this.props.interaction.Prams.PramName}</Form.Label>
              <Row>
                <Col sm={2}>
                  <span className="font-weight-bold indigo-text mr-2">0</span>
                </Col>
                <Col>
                  <input
                    type="range"
                    className="custom-range"
                    name="currentValue"
                    min="0"
                    //max will be the current volume of the beaker
                    max={maxValue}
                    value={this.state.currentValue}
                    onChange={this.onChange}
                  />
                </Col>
                <Col sm={2}>
                  <span className="font-weight-bold indigo-text ml-2">
                    {maxValue}
                  </span>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>{this.props.interaction.Description}</Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default InteractionModal;
