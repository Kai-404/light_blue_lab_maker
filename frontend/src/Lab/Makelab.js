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
import ToolModal from "./Toolmodal";
import Tooltip from "./Tooltip";
import "../App.css";

const stageW = window.innerWidth - window.innerWidth * 0.3;
const stageH = window.innerHeight - 200;

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
    showTooltip: false,
    countForTooltip: 3,
    editInstructions: false,
    newInstructions: ""
  };

  componentDidMount() {}

  getTotalStage() {
    axios.get("http://localhost:8080/gettotalstage").then(res => {
      this.setState({ getTotalStage: res.data });
    });
  }

  setCurrentStage = i => {
    let data = JSON.stringify(i);
    if (i > -1) {
      axios
        .post("http://localhost:8080/getstage", data, {
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
        "http://localhost:8080/duplicatestage",
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
        "http://localhost:8080/addstage",
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
      .post("http://localhost:8080/deletestage", JSON.stringify(stageNum), {
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
        this.setCurrentStage(stageNum);
      });
  };

  saveLab = () => {
    axios.get("http://localhost:8080/savelab").then(res => {
      if (res.data) {
        alert("successfully saved lab");
      } else {
        alert("fail to save the lab");
      }
    });
  };

  publishLab = () => {
    axios
      .get("http://localhost:8080/publishlab")
      .then(res => {
        if (res.data) {
          this.saveLab();
          alert("successfully published lab");
        } else {
          alert("fail to publish the lab");
        }
      })
      .catch(err => {
        alert("fail to publish the lab with", err);
      });
  };

  setCurrentTool = tool => {
    this.setState({ currentTool: tool });
  };

  setShowModal = () => {
    this.setState({ showPop: !this.state.showPop });
  };

  handleClickTool = e => {
    let id = e.target.attrs.name;
    let stageNum = this.state.currentStage.stageNum;
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
        this.setShowModal();
      });
  };

  showEditInstructions() {
    this.setState({ editInstructions: true });
  }

  changeInstructions(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  saveInstructions() {
    axios
      .post("http://localhost:8080/saveinstructions", null, {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: {
          stageNum: this.state.currentStage.stageNum,
          instructions: this.state.newInstructions
        }
      })
      .then(res => {
        this.setState({ editInstructions: false });
        this.setCurrentStage(this.state.currentStage.stageNum);
      });
  }

  hideEditInstructions() {
    this.setState({ editInstructions: false });
  }

  /*
    //not working!!!!!!!!
    setShowTooltip = () => {
      this.setState({ showTooltip: !this.state.showTooltip });
    };

    timer = () => {
      this.setState({
        countForTooltip: this.state.countForTooltip - 1
      });
      console.log(this.intervalId);
      if (this.state.countForTooltip < 1) {
        clearInterval(this.intervalId);
      }
    };

    handleMouseOver = e => {
      this.intervalId = setInterval(this.timer, 1000);
    };

    handleMouseOut = () => {
      console.log("out!!!!");
      clearInterval(this.intervalId);
      this.setState({ countForTooltip: 3 });
    };
  */
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
            active={i === this.state.currentStage.stageNum}
          >
            {i}
          </ListGroup.Item>
        );
      }
      return list;
    };

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
          onMouseOver={this.handleMouseOver}
          onMouseLeave={this.handleMouseOut}
        />
      );
      return img;
    };
    return (
      <React.Fragment>
        <p className="errmsg">{this.state.errMsg}</p>
        <ToolModal
          setTool={this.setCurrentTool}
          tool={this.state.currentTool}
          stageNum={this.state.currentStage.stageNum}
          showPop={this.state.showPop}
          setShow={this.setShowModal}
          setCurrentStage={this.setCurrentStage}
        />
        <ButtonGroup>
          {toolBar}
          <Dropdown className="toolButton" as={ButtonGroup}>
            {/*<Dropdown.Toggle variant="Secondary">More</Dropdown.Toggle>*/}
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
              <Text
                text={this.state.currentStage.instructions}
                fontSize={20}
                x={0.1 * stageW}
                y={0.05 * stageH}
                width={0.8 * stageW}
                align="center"
                onDblClick={() => {
                  this.showEditInstructions();
                }}
              />
            </Layer>
          </Stage>

          <Modal
            show={this.state.editInstructions}
            onHide={() => {
              this.hideEditInstructions();
            }}
          >
            <Modal.Body>
              <textarea
                name="newInstructions"
                onChange={e => {
                  this.changeInstructions(e);
                }}
              >
                {this.state.currentStage.instructions}
              </textarea>
              <br />
              <Button
                onClick={() => {
                  this.saveInstructions();
                }}
              >
                Ok
              </Button>
              <Button
                onClick={() => {
                  this.hideEditInstructions();
                }}
              >
                Cancel
              </Button>
            </Modal.Body>
          </Modal>

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
                    </ButtonGroup>
                  </ListGroup.Item>
                </ListGroup>
              </Modal.Body>
            </Card.Body>
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
