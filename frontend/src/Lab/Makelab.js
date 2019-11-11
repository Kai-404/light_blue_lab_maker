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
  Dropdown,
  Card,
  ListGroup,
  Row,
  Modal
} from "react-bootstrap";
import Addtool from "./Addtool";
import LabStage from "./LabStage";
import "../App.css";

class Makelab extends Component {
  state = {
    labTools: [], //all the tools will be used for this lab
    stageTool: [], //tool for the current stage
    currentStage: -1,
    lab: {
      stageList: [],
      labTools: []
    }
  };

  addStage() {
    axios.post("http://localhost:8080/addstage", {stage: this.state.currentStage+1}).then(res => {
      this.setState({
        lab: res.data,
        currentStage: this.state.currentStage+1
      });
    });
  }

  deleteStage() {
    axios
      .post("http://localhost:8080/deletestage", {
        currentStage: this.state.currentStage
      })
      .then(res => {
        this.setState({ lab: res.data, currentStage: this.state.currentStage-1 });
      });
  }

  setCurrentStage(i) {
    this.setState({ currentStage: i });
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

  //add tool to a stage
  addStageTool = tool => {
    axios
      .post("http://localhost:8080/addstagetool", {
        tool: tool,
        currentStage: this.state.currentStage
      })
      .then(res => {
        this.setState({ lab: res.data });
      });
  };

  componentDidMount() {
    axios.get("/getlab").then(res => {
      this.setState({ stageList: res.data.stageList });
    });
  }

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
    console.log(e.target.attrs.x);
    e.target.to({
      duration: 1.0,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    });
  };

  // pop a tool to the center of the stage with defalut
  popTool = e => {
    let tools = [...this.state.stageTool];
    tools.push(e.target.src);
    this.setState({ stageTool: tools });
  };

  render() {
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
    const stageW = window.innerWidth - window.innerWidth * 0.3;
    const stageH = window.innerHeight - 200;
    let ToolImg = Img => {
      let [tool] = useImage(Object.values(Img)[0]);
      let img = (
        <Image
          width={100}
          height={100}
          x={stageW / 2}
          y={stageH / 2}
          image={tool}
          draggable
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd}
        />
      );
      return img;
    };
    return (
      <React.Fragment>
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
              {this.state.stageTool.map(toolImg => (
                <ToolImg Img={toolImg} />
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
                  {this.state.lab.stageList.map((stage) => (
                    <ListGroup.Item
                      action
                      onClick={() => {
                        this.setCurrentStage(stage.stageNum);
                      }}
                      active={stage.stageNum === this.state.currentStage}
                    >
                      {stage.stageNum}
                    </ListGroup.Item>
                  ))}
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
          <Button className="submitButton">Save</Button>
          <Button className="submitButton">Submit</Button>
          <LinkContainer to="/labspage">
            <Button className="submitButton">Cancel</Button>
          </LinkContainer>
        </ButtonGroup>
      </React.Fragment>
    );
  }
}

export default withRouter(Makelab);
