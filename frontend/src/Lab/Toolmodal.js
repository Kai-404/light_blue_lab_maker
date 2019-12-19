import React, { Component } from "react";
import {
  Button,
  Dropdown,
  DropdownButton,
  Form,
  Modal,
  Row,
  Col
} from "react-bootstrap";
import "../App.css";
import axios from "axios";

class Toolmodal extends Component {
  /**
   * When clicking on the tool, show modal to let prof to change the tool prop
   * stageNum : currently at stage #
   * tool : the tool user want to change
   * showPop : to pop the modal
   * setShow: show/close modal
   * setTool(Tool tool): set the tool
   * setCurrentStage(int stageNum): update the stage accordingly
   */
  state = {
    errMsg: ""
  };

  //change the tool prop
  handleChangeProps = e => {
    let tool = JSON.parse(JSON.stringify(this.props.tool));
    let name = e.target.name;
    let value = e.target.value;
    let type = e.target.id; //init or final
    if (type == "init") {
      tool.Prop.map(prop => {
        if (prop.Name == name) {
          prop.Value = value;
        }
      });
    } else if (type == "nickname") {
      tool.nickname = value;
    } else {
      tool.FinalProp.map(prop => {
        if (prop.Name == name) {
          prop.Value = value;
        }
      });
    }
    this.props.setTool(tool);
  };

  handleSubmit = e => {
    e.preventDefault();
    //update tool
    let stageNum = this.props.stageNum;
    let ctool = this.props.tool;
    let id = ctool.id;
    let data = JSON.stringify({
      stageNum,
      id,
      ctool
    });
    axios
      .post("/updatetoolprop", data, {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: {
          stageNum: stageNum,
          ID: id
        },
        toolProps: ctool
      })
      .then(res => {
        if (res.status == 200) {
          //get back the whole stage
          this.props.setCurrentStage(stageNum);
          this.props.setShow();
        } else {
          this.setState({ errMsg: "wrong value entered, try again" });
        }
      })
      .catch(err => {
        this.setState({ errMsg: "wrong value entered, try again" });
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
      .post("/stagedeletetool", data, {
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
    let interaction;

    try {
      interaction = (
        <Form.Group>
          <React.Fragment>
            Interactions:
            <Col sm={10}>
              <Form.Control
                name={this.props.tool.Interactions.Name}
                plaintext
                readOnly
                defaultValue={this.props.tool.Interactions.Name}
              />
            </Col>
          </React.Fragment>
        </Form.Group>
      );
    } catch (err) {
      interaction = (
        <>
          <Form.Group>
            Interaction: <br />
            <br />
            No interaction yet!
          </Form.Group>
        </>
      );
    }

    let modalBody;
    try {
      modalBody = (
        <Form onSubmit={this.handleSubmit}>
          <Form.Group as={Row} controlId="formPlaintextPassword">
            <Form.Label column sm="2">
              Nick Name:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                required
                id="nickname"
                placeholder="nick name for the tool"
                defaultValue={this.props.tool.nickname}
                onChange={this.handleChangeProps}
              />
            </Col>
          </Form.Group>
          <Row>
            <Col>
              <Form.Group>
                Initial Properties:
                <br />
                {this.props.tool.Prop.map((prop, key) => {
                  let control = (
                    <Form.Control
                      id={"init"}
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
                        disabled
                      />
                    );
                  } else {
                    if (prop.Name == "Color") {
                      control = (
                        <Form.Control
                          as="select"
                          id={"init"}
                          name={prop.Name}
                          defaultValue={prop.Value}
                          onChange={this.handleChangeProps}
                        >
                          {prop.ValidColor.map(s => {
                            return <option>{s}</option>;
                          })}
                        </Form.Control>
                      );
                    } else if (prop.Name == "PH Status") {
                      control = (
                        <Form.Control
                          as="select"
                          id={"init"}
                          name={prop.Name}
                          defaultValue={prop.Value}
                          onChange={this.handleChangeProps}
                        >
                          {prop.ValidStatus.map(s => {
                            return <option>{s}</option>;
                          })}
                        </Form.Control>
                      );
                    } else if (prop.Name == "Chemicals List") {
                      control = (
                        <Form.Control
                          id={"init"}
                          name={prop.Name}
                          type={prop.Name}
                          defaultValue={prop.Value}
                          onChange={this.handleChangeProps}
                        />
                      );
                    }
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
            </Col>
            <Col>
              <Form.Group>
                Final Properties:
                <br />
                {this.props.tool.FinalProp.map((prop, key) => {
                  let control = (
                    <Form.Control
                      id={"final"}
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
                        disabled
                      />
                    );
                  } else {
                    if (prop.Name == "PH Status") {
                      control = (
                        <Form.Control
                          as="select"
                          name={prop.Name}
                          defaultValue={prop.Value}
                          onChange={this.handleChangeProps}
                        >
                          {prop.ValidStatus.map(s => {
                            return <option>{s}</option>;
                          })}
                        </Form.Control>
                      );
                    } else if (prop.Name == "Color") {
                      control = (
                        <Form.Control
                          as="select"
                          name={prop.Name}
                          defaultValue={prop.Value}
                          onChange={this.handleChangeProps}
                        >
                          {prop.ValidColor.map(s => {
                            return <option>{s}</option>;
                          })}
                        </Form.Control>
                      );
                    } else if (prop.Name == "Chemicals List") {
                      control = (
                        <Form.Control
                          id={"final"}
                          name={prop.Name}
                          type={prop.Name}
                          defaultValue={prop.Value}
                          onChange={this.handleChangeProps}
                        />
                      );
                    }
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
            </Col>
          </Row>
          {interaction}
          <Button type="submit" className="addtoolButton">
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
            {"  "}
            <Button onClick={this.deleteTool} className="addtoolButton">
              Delete
            </Button>
          </Form>
        </>
      );
    }
    return (
      <React.Fragment>
        <Modal
          size="lg"
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
          <p className="errmsg">{this.state.errMsg}</p>
          <Modal.Body>{modalBody}</Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Toolmodal;
