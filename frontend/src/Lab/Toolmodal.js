import React, { Component } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import "../App.css";
import axios from "axios";

class Toolmodal extends Component {
  /**
   * take in stageNum and tool as props
   * stageNum : currently at stage #
   * tool : the tool user want to change
   * showPop : to pop the modal
   */
  state = {
    tool: {}
  };
  //change the tool prop
  handleChangeProps = e => {
    let tool = JSON.parse(JSON.stringify(this.props.tool));
    let name = e.target.name;
    let value = e.target.value;
    console.log(e.target.name, e.target.value);
    tool.Prop.map(prop => {
      if (prop.Name == name) {
        prop.Value = value;
      }
    });
    this.setState({ tool: tool });
  };

  handleSubmit = () => {
    //update tool
    let stageNum = this.props.stageNum;
    let ctool = this.state.tool;
    let id = ctool.id;
    let data = JSON.stringify({
      stageNum,
      id,
      ctool
    });
    console.log("handle submit current tool: ", ctool);
    axios
      .post("http://localhost:8080/updatetoolprop", data, {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: {
          stageNum: stageNum,
          ID: id
        },
        toolProps: ctool
      })
      .then(res => {
        //get back the whole stage
        this.props.setCurrentStage(stageNum);
        this.props.setShow();
      });
  };

  deleteTool = () => {
    let tool = JSON.parse(JSON.stringify(this.props.tool));
    let stageNum = this.props.stageNum;
    let id = tool.id;
    let data = JSON.stringify({
      stageNum,
      id
    });
    axios
      .post("http://localhost:8080/deletetool", data, {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: {
          stageNum: stageNum,
          ID: id
        }
      })
      .then(res => {
        //get back the whole stage
        this.props.setCurrentStage(stageNum);
        this.props.setShow();
      });
  };

  render() {
    let modalBody;
    try {
      modalBody = (
        <Form>
          <Form.Group>
            Properties:
            <br />
            {this.props.tool.Prop.map((prop, key) => {
              let control = (
                <Form.Control
                  name={prop.Name}
                  required
                  type={prop.Name}
                  defaultValue={prop.Value}
                  onChange={this.handleChangeProps}
                />
              );
              if (!prop.Editable) {
                control = (
                  <Form.Control
                    name={prop.Name}
                    required
                    type={prop.Name}
                    defaultValue={prop.Value}
                  />
                );
              }
              return (
                <React.Fragment>
                  <Form.Group as={Row}>
                    <Form.Label column sm={2}>
                      {prop.Name}
                    </Form.Label>
                    <Col sm={10}>{control}</Col>
                  </Form.Group>
                </React.Fragment>
              );
            })}
          </Form.Group>
          <Form.Group>
            Interaction: <br />
            <br />
            No interaction yet!
          </Form.Group>
          <Button onClick={this.handleSubmit} className="addtoolButton">
            Submit
          </Button>
          {"  "}
          <Button onClick={this.deleteTool} className="addtoolButton">
            Delete
          </Button>
        </Form>
      );
    } catch (err) {
      modalBody = (
        <>
          <Form>
            <Form.Group>This tool has no property</Form.Group>
            <Button onClick={this.props.setShow} className="addtoolButton">
              OK
            </Button>
          </Form>
        </>
      );
    }
    return (
      <React.Fragment>
        <Modal
          size="sm"
          centered
          show={this.props.showPop}
          onHide={this.props.setShow}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header>
            <Modal.Title id="example-custom-modal-styling-title">
              {this.props.tool.Name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalBody}</Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Toolmodal;
