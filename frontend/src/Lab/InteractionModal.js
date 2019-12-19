import React, { Component } from "react";
import axios from "axios";
import { Button, Form, Modal, Row, Col, ListGroup } from "react-bootstrap";
import "../App.css";

class InteractionModal extends Component {
  state = {
    errMsg: "",
    Value: 0,
    maxValue: null
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });
  onClose = e => {
    if (this.props.eventTool.target) {
      this.props.eventTool.target.to({
        rotation: 0
      });
    }
    this.props.setShow();
  };
  onSubmit = e => {
    e.preventDefault();
    let interaction = this.props.interaction,
      stageNum = this.props.stageNum,
      id = this.props.sourceTool.id,
      id2 = this.props.destinationTool.id;
    if (this.props.interaction.Name == "Pour")
      interaction.Prams.Value = this.state.Value;

    //interaction
    let data = JSON.stringify({
      stageNum,
      id,
      id2,
      interaction
    });
    console.log("Stupid Kai Look here for do interaction:", data);
    axios
      .post("/doInteraction", data, {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: {
          stageNum,
          id,
          id2,
          interaction
        }
      })
      .then(res => {
        if (res.status == 200) {
          this.props.updateTools(id, id2, stageNum);
          this.props.setCurrentStage(stageNum);
        } else {
          this.setState({ errMsg: "wrong action try again" });
        }
      })
      .catch(err => {
        console.log("err: ");
        this.setState({ errMsg: "wrong action try again" });
      });
  };

  render() {
    this.props.sourceTool.Prop.forEach(prop => {
      if (prop.Name == "Current Volume") {
        this.state.maxValue = prop.Value;
      }
    });

    let interactionForm;
    switch (this.props.interaction.Name) {
      case "Pour":
        if (this.props.eventTool.target) {
          this.props.eventTool.target.setAttrs({
            rotation: 45
          });
        }
        interactionForm = (
          <Form onSubmit={this.onSubmit}>
            <p className="errmsg">{this.state.errMsg}</p>
            <Form.Label>
              {this.props.interaction.Prams.PramName} : {this.state.Value}
            </Form.Label>
            <Row>
              <Col sm={2}>
                <span className="font-weight-bold indigo-text mr-2">0</span>
              </Col>
              <Col>
                <input
                  type="range"
                  className="custom-range"
                  name="Value"
                  min="0"
                  //max will be the current volume of the beaker
                  max={this.state.maxValue}
                  value={this.state.Value}
                  onChange={this.onChange}
                />
              </Col>
              <Col sm={2}>
                <span className="font-weight-bold indigo-text ml-2">
                  {this.state.maxValue}
                </span>
              </Col>
            </Row>
            <Button type="submit">Submit</Button>
            <Button onClick={this.onClose}>Close</Button>
          </Form>
        );
        break;
      case "Measure":
        interactionForm = (
          <ListGroup>
            <ListGroup.Item>{this.props.interaction.Prams}</ListGroup.Item>
          </ListGroup>
        );
        break;
      default:
        if (this.props.eventTool.target) {
          this.props.eventTool.target.setAttrs({
            rotation: 45
          });
        }
        interactionForm = (
          <ListGroup>
            <ListGroup.Item>Fk U</ListGroup.Item>
          </ListGroup>
        );
    }

    return (
      <React.Fragment>
        <Modal show={this.props.show} onHide={this.onClose}>
          <Modal.Header>
            <Modal.Title id="example-custom-modal-styling-title">
              {this.props.interaction.Name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{interactionForm}</Modal.Body>
          <Modal.Footer>{this.props.interaction.Description}</Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default InteractionModal;
