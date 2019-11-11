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
  Dropdown,
  Form,
  ListGroup,
  Row,
  Modal
} from "react-bootstrap";
import Addtool from "./Addtool";
import LabStage from "./LabStage";
import "../App.css";

const stageW = window.innerWidth - window.innerWidth * 0.3;
const stageH = window.innerHeight - 200;
var idNum = 1;
var toolName = "Default";

class Makelab extends Component {
  state = {
    labTools: [], //all the tools will be used for this lab
    stageTool: [
      {
        id: "1",
        Name: "Beaker",
        Img: "beakerTool.png",
        x: 0,
        y: 0,
        Prop: [
          { Name: "Size", Value: "100", Editable: true },
          { Name: "Color", Value: "Green", Editable: true }
        ],
        Interaction: ["Pour"]
      }
    ], //tool for the current stage
    showPop: false, //show popup
    currentStage: -1,
    lab: {
      stageList: [],
      labTools: []
    }
  };

  addStage() {
    axios.post("http://localhost:8080/addstage").then(res => {
      this.setState({ lab: res.data });
    });
  }

  deleteStage() {
    axios
      .post("http://localhost:8080/deletestage", {
        currentStage: this.state.currentStage
      })
      .then(res => {
        this.setState({ lab: res.data, currentStage: -1 });
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
    this.state.stageTool.map(tool => {
      // e.target.attrs.name is the id of img
      if (tool.id === e.target.attrs.name) {
        tool.x = e.target.attrs.x;
        tool.y = e.target.attrs.y;
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
  };
  setShow = () => {
    this.setState({ showPop: !this.state.showPop });
  };
  handleClickTool = e => {
    this.setShow();
    console.log(this.state.showPop);
    console.log(e.target);
  };

  handleSubmit = event => {
    const form = event.currentTarget;
    console.log(form);
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  // pop a tool to the center of the stage with defalut
  popTool = e => {
    /* 
    //request a tool with toolName, get back a default tool
    axios
      .post("http://localhost:8080/addstagetool", {
        tool: e.target.alt, //name of tool
        currentStage: this.state.currentStage
      })
      .then(res => {
        let tools = [...this.state.stageTool];
        tools.push(res.data);
        this.setState({ stageTool: tools });
      });
    */
    let tools = [...this.state.stageTool];
    idNum++;
    tools.push({
      id: JSON.stringify(idNum),
      Name: "Beaker",
      Img: e.target.src,
      x: 0,
      y: 0,
      Prop: [
        { Name: "Size", Value: "100", Editable: true },
        { Name: "Color", Value: "Green", Editable: true }
      ],
      Interaction: ["Pour"]
    });
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
        <Modal
          show={this.state.showPop}
          onHide={this.setShow}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header>
            <Modal.Title id="example-custom-modal-styling-title">
              {toolName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Size</Form.Label>
                <Form.Control placeholder="100ml" />
                <Form.Text className="text-muted">---------------</Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
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
              {this.state.stageTool.map(toolImg => (
                <ToolImg
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
                  {this.state.lab.stageList.map((stage, i) => (
                    <ListGroup.Item
                      action
                      onClick={() => {
                        this.setCurrentStage(i);
                      }}
                      active={i === this.state.currentStage}
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
