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
  Modal,
  CardDeck,
  ProgressBar
} from "react-bootstrap";
import Addtool from "./Addtool";
import ToolModal from "./Toolmodal";
import LabStageBar from "./LabStageBar";
import LabTool from "./LabTool";
import InteractionModal from "./InteractionModal";
import "../App.css";
import TextField from "@material-ui/core/TextField";

const stageW = window.innerWidth - window.innerWidth * 0.3;
const stageH = window.innerHeight - 400;

class Makelab extends Component {
  state = {
    errMsg: "",
    labTools: [], //all the tools will be used for this lab
    //currentStage, //element of stage list
    getTotalStage: 0,
    currentStage: {
      stageNum: -1,
      stageTool: [],
      instructions: ""
    }, //all stage start at stage 0
    currentTool: [], //the tool prof want to change property with.
    showPop: false, //show popup
    hasInter: false,
    inter: {
      Description: "Some description",
      Name: "Name of interaction",
      Prams: {
        PramName: "",
        Value: ""
      }
    },
    tempTool: {},
    sourceTool: { Prop: [] },
    destinationTool: { Prop: [] },
    eventTool: {}
  };

  componentDidMount() {
    this.getTotalStage();
    this.setCurrentStage(-1);
    //  to display the lab tool bar when loading the page
    axios.get("/getalltools").then(res => {
      this.addLabTool(res.data);
    });
  }

  getTotalStage() {
    axios.get("/gettotalstage").then(res => {
      this.setState({ getTotalStage: res.data });
    });
  }

  setCurrentStage = i => {
    let data = JSON.stringify(i);
    if (i > -1) {
      axios
        .post("/getstage", data, {
          headers: { "Content-Type": "application/json;charset=UTF-8" },
          params: { stageNum: i }
        })
        .then(res => {
          this.setState({ currentStage: res.data });
        });
    } else {
      this.setState({ currentStage: { stageNum: -1, stageTool: [] } });
    }
  };

  duplicateStage() {
    axios
      .post(
        "/duplicatestage",
        JSON.stringify(this.state.currentStage.stageNum),
        {
          headers: { "Content-Type": "application/json;charset=UTF-8" }
        }
      )
      .then(res => {
        this.getTotalStage();
        this.setCurrentStage(this.state.currentStage.stageNum + 1);
      });
  }

  addStage() {
    axios
      .post(
        "/addstage",
        JSON.stringify(this.state.currentStage.stageNum),
        {
          headers: { "Content-Type": "application/json;charset=UTF-8" }
        }
      )
      .then(res => {
        this.getTotalStage();
        this.setCurrentStage(this.state.currentStage.stageNum + 1);
      });
  }

  deleteStage() {
    let stageNum = this.state.currentStage.stageNum;
    axios
      .post("/deletestage", JSON.stringify(stageNum), {
        headers: { "Content-Type": "application/json;charset=UTF-8" }
      })
      .then(res => {
        this.getTotalStage();
        if (stageNum === this.state.getTotalStage - 1) {
          this.setCurrentStage(stageNum - 1);
        } else {
          this.setCurrentStage(stageNum);
        }
      });
  }

  setInteraction = inter => {
    console.log("pased:", inter);
    this.setState({ inter: inter });
  };
  //add tool to whole lab
  addLabTool = tool => {
    let allTool = tool.filter(t => {
      if (t.Display) {
        return t;
      }
    });
    this.setState({ labTools: allTool });
    this.setCurrentStage(this.state.currentStage.stageNum);
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
      .post("/stageaddtool", data, {
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

  saveLab = () => {
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    if (title === "" || description === "") {
      alert("title and description must be filled");
    } else {
      sessionStorage.setItem("currentLabTitle", title);
      sessionStorage.setItem("currentLabDescription", description);
      axios
        .get("/savelab", {
          headers: { "Content-Type": "application/json;charset=UTF-8" },
          params: {
            courseID: sessionStorage.getItem("currentCourse"),
            username: sessionStorage.getItem("username"),
            title: title,
            description: description,
          }
        })
        .then(res => {
          if (res.data) {
            alert("successfully saved lab");
          } else {
            alert("fail to save the lab");
          }
        });
    }
  };

  publishLab = () => {
    const r = window.confirm(
      "Do you really want to publish the lab? After publish you cannot edit it."
    );
    if (r == true) {
      let title = document.getElementById("title").value;
      let description = document.getElementById("description").value;
      if (title === "" || description === "") {
        alert("title and description must be filled");
      } else {
        sessionStorage.setItem("currentLabTitle", title);
        sessionStorage.setItem("currentLabDescription", description);
        axios
          .get("/savelab", {
            headers: { "Content-Type": "application/json;charset=UTF-8" },
            params: {
              courseID: sessionStorage.getItem("currentCourse"),
              username: sessionStorage.getItem("username"),
              title: title,
              description: description
            }
          })
          .then(res => {
            if (res.data) {
              axios
                .get("/publishlab", {
                  params: {
                    courseID: sessionStorage.getItem("currentCourse")
                  }
                })
                .then(res => {
                  if (res.data == 0) {
                    alert("successfully published lab");
                  } else if (res.data == 1) {
                    alert("there has to be at least one stage");
                  } else if (res.data == 2) {
                    alert("each stage must have at least one tool");
                  } else if (res.data == 4) {
                     alert("instruction must not be empty");
                  } else {
                    alert("fail to publish the lab");
                  }
                })
                .catch(err => {
                  alert("fail to publish the lab with", err);
                });
            }
          })
          .catch(err => {
            alert("fail to publish the lab with", err);
          });
      }
    }
  };

  setCurrentTool = tool => {
    this.setState({ currentTool: tool });
  };

  setShowModal = () => {
    this.setState({ showPop: !this.state.showPop });
  };

  setShowInterModal = (source, destination, e) => {
    this.setState({
      hasInter: !this.state.hasInter
    });
    if (source && destination && e) {
      this.setState({
        sourceTool: source,
        destinationTool: destination,
        eventTool: e
      });
    } else {
      this.setState({
        sourceTool: { Prop: [] },
        destinationTool: { Prop: [] },
        eventTool: {}
      });
    }
  };
  updateTools = (source, destination, stageNum) => {
    let data = JSON.stringify({
      stageNum,
      source,
      destination
    });
    axios
      .post("/gettool", data, {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: {
          stageNum: stageNum,
          ID: source
        }
      })
      .then(res => {
        this.setState({ sourceTool: res.data });
      });
    axios
      .post("/gettool", data, {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: {
          stageNum: stageNum,
          ID: destination
        }
      })
      .then(res => {
        this.setState({ destinationTool: res.data });
      });
  };

  dataChanged(data) {
  }

  updateInstructions = event => {
    axios.post("/saveinstructions", null, {
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      params: {
        stageNum: this.state.currentStage.stageNum,
        instructions: event.target.value
      }
    });
    this.setState({
      currentStage: {
        stageNum: this.state.currentStage.stageNum,
        stageTool: this.state.currentStage.stageTool,
        instructions: event.target.value
      }
    });
  };

  render() {
    let toolBar = (
      <React.Fragment>
        {this.state.labTools.map(tool => (
          <Button
            className="toolButton"
            onClick={this.popTool}
            disabled={this.state.currentStage.stageNum === -1}
          >
            <img
              src={process.env.PUBLIC_URL + tool.Img}
              className="UserIcon"
              alt={tool.Name}
            />
          </Button>
        ))}
      </React.Fragment>
    );
    let textInput = (
      <React.Fragment>
        <div align="left">
          <TextField
            id="title"
            label="title"
            defaultValue={sessionStorage.getItem("currentLabTitle")}
          />
          <TextField
            id="description"
            label="description"
            defaultValue={sessionStorage.getItem("currentLabDescription")}
          />
        </div>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <p className="errmsg">{this.state.errMsg}</p>
        <InteractionModal
          interaction={this.state.inter}
          setInteraction={this.setInteraction}
          show={this.state.hasInter}
          setShow={this.setShowInterModal}
          stageNum={this.state.currentStage.stageNum}
          updateTools={this.updateTools}
          sourceTool={this.state.sourceTool}
          destinationTool={this.state.destinationTool}
          eventTool={this.state.eventTool}
          setCurrentStage={this.setCurrentStage}
          getToolById={this.getToolById}
        />

        <ToolModal
          setTool={this.setCurrentTool}
          tool={this.state.currentTool}
          stageNum={this.state.currentStage.stageNum}
          showPop={this.state.showPop}
          setShow={this.setShowModal}
          setCurrentStage={this.setCurrentStage}
        />
        {textInput}
        <ButtonGroup>
          {toolBar}
          {/*
                    <Dropdown className="toolButton" as={ButtonGroup}>
                        <Dropdown.Toggle variant="Secondary">More</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Tool 1</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    */}
          <Addtool addLabTool={this.addLabTool} />
        </ButtonGroup>
        <br />
        <Row>
          {/* append tools to the stageTool and rerender */}
          <Col>
            <div className="stage" id="stageInstructions">
              <textarea
                id="stageInstructionsText"
                placeholder={"Enter instructions here"}
                value={this.state.currentStage.instructions}
                onChange={this.updateInstructions}
                disabled={this.state.currentStage.stageNum === -1}
              />
            </div>
            <Stage width={stageW} height={stageH} className="stage">
              <Layer>
                {this.state.currentStage.stageTool.map(
                  (tool, key) => (
                    console.log(tool.nickname),
                    (
                      <LabTool
                        key={key}
                        src={tool.Img}
                        x={tool.x}
                        y={tool.y}
                        id={tool.id}
                        nickname={tool.nickname}
                        stageNum={this.state.currentStage.stageNum}
                        stageTool={this.state.currentStage.stageTool}
                        setCurrentStage={this.setCurrentStage}
                        setTool={this.setCurrentTool}
                        setShowModal={this.setShowModal}
                        setInteraction={this.setInteraction}
                        setShowInterModal={this.setShowInterModal}
                      />
                    )
                  )
                )}
              </Layer>
            </Stage>
          </Col>
          <Card border="secondary" className="col-md-2" id="labStageComponent">
            <Card.Body>
              <Card.Title>Lab Stages</Card.Title>
              <Modal.Body
                style={{
                  "max-height": "calc(100vh - 540px)",
                  "overflow-y": "auto"
                }}
              >
                <LabStageBar
                  totalStage={this.state.getTotalStage}
                  currentStageNum={this.state.currentStage.stageNum}
                  setCurrentStage={this.setCurrentStage}
                />
              </Modal.Body>
            </Card.Body>

            <Button onClick={() => this.addStage()} className="addtoolButton">
              New
                        </Button>
            <Button
              onClick={() => this.duplicateStage()}
              className="addtoolButton"
              disabled={this.state.currentStage.stageNum === -1}
            >
              Duplicate
                        </Button>
            <Button
              className="addtoolButton"
              onClick={() => this.deleteStage()}
              disabled={this.state.currentStage.stageNum === -1}
            >
              Delete
                        </Button>
          </Card>
        </Row>
        <br />
        <ButtonGroup>
          <Button className="submitButton" onClick={this.saveLab}>
            Save
                    </Button>
          <Button className="submitButton" onClick={this.publishLab}>
            Publish
                    </Button>
          <LinkContainer to="/labspage">
            <Button className="submitButton">Cancel</Button>
          </LinkContainer>
        </ButtonGroup>
      </React.Fragment>
    );
  }
}

export default withRouter(Makelab);
