import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router";
import Konva from "konva";
import { Stage, Layer, Star, Text, Image } from "react-konva";
import useImage from "use-image";
import Sidebar from "../Layout/Sidebar";
import { LinkContainer } from "react-router-bootstrap";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Dropdown,
  Form,
  ListGroup,
  Row,
  Modal
} from "react-bootstrap";
import uuid from "uuid";
import Addtool from "./Addtool";
import "../App.css";

const stageW = window.innerWidth - window.innerWidth * 0.3;
const stageH = window.innerHeight - 200;

class Makelab extends Component {
  state = {
    errMsg: "",
    labTools: [], //all the tools will be used for this lab
    //currentStage, //element of stage list
    getTotalStage: 1,
    currentStage: {
      stageNum: 0,
      stageTool: []
    }, //all stage start at stage 0
    currentTool: [], //the tool prof want to change property with.
    showPop: false //show popup
  };

  componentDidMount() {
    /*axios.get("/getlab").then(res => {
      this.setState({ stageList: res.data.stageList });
    }); */
    this.getTotalStage();
    this.setCurrentStage(0);
  }

  getTotalStage() {
    axios.get("http://localhost:8080/gettotalstage").then(res => {
      this.setState({ getTotalStage: res.data });
    });
  }

  setCurrentStage(i) {
    console.log("currentstage is: ", i);
    let data = JSON.stringify(i);
    axios
      .post("http://localhost:8080/getstage", data, {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: { stageNum: i }
      })
      .then(res => {
        this.setState({ currentStage: res.data });
      });
    console.log(this.state.currentStage);
  }

  addStage() {
    axios
      .post(
        "http://localhost:8080/addstage",
        JSON.stringify(this.state.currentStage.stageNum),
        {
          headers: { "Content-Type": "application/json;charset=UTF-8" }
        }
      )
      .then(res => {
        this.getTotalStage();
      });
  }

  deleteStage() {
    let stageNum = this.state.currentStage.stageNum;
    axios
      .post("http://localhost:8080/deletestage", JSON.stringify(stageNum), {
        headers: { "Content-Type": "application/json;charset=UTF-8" }
      })
      .then(res => {
        this.getTotalStage();
        this.setCurrentStage(stageNum);
      });
  }

  //add tool to whole lab
  addLabTool = tool => {
    let allTool = tool.filter(t => {
      if (t.Display) {
        return t;
      }
    });
    this.state.labTools = allTool;
    this.setState({ rerender: !this.state.rerender });
  };

  // pop a tool to the center of the stage with defalut
  popTool = e => {
    const uuidv4 = require("uuid/v4");
    let id = uuidv4();
    let name = e.target.alt;
    let stageNum = this.state.currentStage.stageNum;
    let data = JSON.stringify({
      id,
      name,
      stageNum
    });
    //request a tool with , get back a default tool
    axios
      .post("http://localhost:8080/stageaddtool", data, {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: {
          stageNum: stageNum,
          toolName: name, //name of tool
          ID: id
        }
      })
      .then(res => {
        if (res.data) {
          this.setCurrentStage(stageNum);
        }
      });
  };

  //draging a tool animation
  handleDragStart = e => {
    e.target.setAttrs({
      shadowOffset: {
        x: 2,
        y: 2
      },
      scaleX: 1.1,
      scaleY: 1.1
    });
  };
  //drag tool end animation
  handleDragEnd = e => {
    let stageNum = this.state.currentStage.stageNum;
    let id = e.target.attrs.name;
    this.state.currentStage.stageTool.map(tool => {
      // e.target.attrs.name is the id of img
      if (tool.id === id) {
        tool.x = e.target.attrs.x;
        tool.y = e.target.attrs.y;
        this.setState({ currentTool: tool });
      }
    });
    e.target.to({
      duration: 1.0,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    });
    let ctool = this.state.currentTool;
    let data = JSON.stringify({
      stageNum,
      id,
      ctool
    });

    console.log(data);
    console.log("handle drag: ", ctool);
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
        console.log("drag end: ", res.data);
        this.setCurrentStage(stageNum);
      });
  };
  saveLab = () =>{
    axios.get("http://localhost:8080/savelab").then(res=>{
      console.log("saved to database");
    });
  }
  setShow = () => {
    this.setState({ showPop: !this.state.showPop });
  };

  handleClickTool = e => {
    console.log("id of the tool:", e.target.attrs.name);
    let stageNum = this.state.currentStage.stageNum;
    let id = e.target.attrs.name;
    let data = JSON.stringify({
      stageNum,
      id
    });
    axios
      .post("http://localhost:8080/gettool", data, {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: {
          stageNum: stageNum,
          ID: id
        }
      })
      .then(res => {
        this.setState({ currentTool: res.data });
        console.log(res.data);
      });
    this.setShow();
  };

  onchange = e => {
    let tool = this.state.currentTool;
    let type = e.target.name;
    let value = e.target.value;
    console.log(e.target);
    console.log(type, value);
    //  if (type === "Prop") {
    tool.Prop.map(prop => {
      console.log("onchange: ", prop.Name);
      if (prop.Name == type) {
        prop.Value = value;
        this.setState({ currentTool: tool });
        console.log(tool);
      }
    });
    //  }
  };

  handleSubmit = () => {
    //update tool
    let stageNum = this.state.currentStage.stageNum;
    let ctool = this.state.currentTool;
    let id = ctool.id;
    let data = JSON.stringify({
      stageNum,
      id,
      ctool
    });
    console.log("current tool: ", ctool);
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
        this.setCurrentStage(stageNum);
        console.log(res.data);
        this.setShow();
      });
  };

  render() {
    let Stages = () => {
      let list = [];
      for (let i = 0; i < this.state.getTotalStage; i++) {
        list.push(
          <ListGroup.Item
            action
            onClick={() => {
              this.setCurrentStage(i);
            }}
            active={i === this.state.currentStage}
          >
            {i}
          </ListGroup.Item>
        );
      }
      return list;
    };

    let ModalTool = () => {
      let tool = this.state.currentTool;
      let name, modalBody;
      try {
        name = tool.Name;
        modalBody = (
          <Form>
            <Form.Group>
              Properties:
              <br />
              {tool.Prop.map((prop, key) => {
                let control = (
                  <Form.Control
                    name={prop.Name}
                    required
                    type={prop.Name}
                    defaultValue={prop.Value}
                    onChange={this.onchange}
                  />
                );
                if (!prop.Editable) {
                  control = (
                    <Form.Control
                      required
                      type={prop.Name}
                      value={prop.Value}
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
            </Form.Group>
            <Button variant="primary" type="button" onClick={this.handleSubmit}>
              Submit
            </Button>
          </Form>
        );
      } catch (err) {
        name = "Error, no such tool";
        modalBody = (
          <>
            <Button onClick={this.setShow} className="addtoolButton">
              Ok
            </Button>
          </>
        );
      }
      let pop = (
        <React.Fragment>
          <Modal.Header>
            <Modal.Title id="example-custom-modal-styling-title">
              {name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalBody}</Modal.Body>
        </React.Fragment>
      );
      return pop;
    };

    let toolBar = (
      <React.Fragment>
        {this.state.labTools.map(tool => (
          <Button className="toolButton" onClick={this.popTool}>
            <img
              src={process.env.PUBLIC_URL + tool.Img}
              className="UserIcon"
              alt={tool.Name}
            />
          </Button>
        ))}
      </React.Fragment>
    );
    let ToolImg = Img => {
      let [tool] = useImage(Object.values(Img)[0]);
      let img = (
        <Image
          name={Img.id}
          width={stageW * 0.05}
          height={stageH * 0.1}
          x={Img.xVal}
          y={Img.yVal}
          image={tool}
          draggable
          onClick={this.handleClickTool}
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd}
        />
      );
      return img;
    };
    return (
      <React.Fragment>
        <p className="errmsg">{this.state.errMsg}</p>
        <Modal
          size="sm"
          centered
          show={this.state.showPop}
          onHide={this.setShow}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <ModalTool />
        </Modal>
        <ButtonGroup>
          {toolBar}
          <Dropdown className="toolButton" as={ButtonGroup}>
            <Dropdown.Toggle variant="Secondary">More</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Tool 1</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Addtool addLabTool={this.addLabTool} />
        </ButtonGroup>
        <br />
        <Row>
          {/* append tools to the stageTool and rerender */}
          <Stage width={stageW} height={stageH} className="stage">
            <Layer>
              {this.state.currentStage.stageTool.map((toolImg, key) => (
                <ToolImg
                  key={key}
                  Img={toolImg.Img}
                  xVal={toolImg.x}
                  yVal={toolImg.y}
                  id={toolImg.id}
                />
              ))}
            </Layer>
          </Stage>

          <Card border="secondary" className="col-md-2">
            <Card.Body>
              <Card.Title>Lab Stages</Card.Title>
              <Modal.Body
                style={{
                  "max-height": "calc(100vh - 310px)",
                  "overflow-y": "auto"
                }}
              >
                <ListGroup>
                  <Stages />
                  <ListGroup.Item>
                    <ButtonGroup vertical>
                      <Button
                        onClick={() => this.addStage()}
                        className="addtoolButton"
                      >
                        New
                      </Button>
                      <Button
                        className="addtoolButton"
                        onClick={() => this.deleteStage()}
                        disabled={this.state.currentStage === -1}
                      >
                        Delete
                      </Button>
                    </ButtonGroup>
                  </ListGroup.Item>
                </ListGroup>
              </Modal.Body>
            </Card.Body>
          </Card>
        </Row>

        <br />
        <ButtonGroup>
          <Button className="submitButton" onClick={this.saveLab}>Save</Button>
          <Button className="submitButton">Publish</Button>
          <LinkContainer to="/labspage">
            <Button className="submitButton">Cancel</Button>
          </LinkContainer>
        </ButtonGroup>
      </React.Fragment>
    );
  }
}

export default withRouter(Makelab);
