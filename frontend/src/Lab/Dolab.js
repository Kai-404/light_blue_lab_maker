import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router";
import { Stage, Layer, Text } from "react-konva";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Modal,
  ProgressBar
} from "react-bootstrap";
import LabTool from "./LabTool";
import InteractionModal from "./InteractionModal";
import "../App.css";

const stageW = window.innerWidth - window.innerWidth * 0.3;
const stageH = window.innerHeight - 200;

class Dolab extends Component {
  state = {
    getTotalStage: -1,
    currentStage: -1,
    currentTool: [],
    stage: {
      stageNum: -1,
      stageTool: [],
      instructions: ""
    },
    hasInter: false,
    inter: {
      Description: "Some description",
      Name: "Name of interaction",
      Prams: {
        PramName: "",
        Value: ""
      }
    },
    sourceTool: { Prop: [] },
    destinationTool: { Prop: [] },
    eventTool: {}
  };

  back = () => {
    this.props.history.push("/labspage");
  };

  getTotalStage() {
    axios.get("http://localhost:8080/gettotalstage").then(res => {
      this.setState({ getTotalStage: res.data });
    });
  }

  getCurrentStage() {
    axios.get("http://localhost:8080/getcurrentstage").then(res => {
      console.log("test2");
      console.log(res.data);
      this.setState({ currentStage: res.data });
    });
  }

  getNextStage = () => {
    axios.get("http://localhost:8080/getnextstage").then(res => {
      if (res.data === true) {
        this.getCurrentStage();
        this.getStage();
      } else {
        alert("Wrong");
      }
    });
  };

  finishLab = () => {
    axios.get("http://localhost:8080/getnextstage").then(res => {
      if (res.data === true) {
        this.back();
      } else {
        alert("Wrong");
      }
    });
  };

  getStage = () => {
    axios.get("http://localhost:8080/getdolabstage").then(res => {
      this.setState({ stage: res.data });
    });
  };

  componentDidMount() {
    this.getStage();
    this.getTotalStage();
    this.getCurrentStage();
  }

  setCurrentTool = tool => {
    this.setState({ currentTool: tool });
  };

  setCurrentStage = i => {
    let data = JSON.stringify(i);
    if (i > -1) {
      axios
        .post("http://localhost:8080/getstage", data, {
          headers: { "Content-Type": "application/json;charset=UTF-8" },
          params: { stageNum: i }
        })
        .then(res => {
          console.log("test1");
          console.log(res.data);
          this.setState({ currentStage: res.data.stageNum });
        });
    } else {
      this.setState({ stage: { stageNum: -1, stageTool: [] } });
    }
  };

  setInteraction = inter => {
    console.log("pased:", inter);
    this.setState({ inter: inter });
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

  render() {
    return (
      <React.Fragment>
        <InteractionModal
          interaction={this.state.inter}
          setInteraction={this.setInteraction}
          show={this.state.hasInter}
          setShow={this.setShowInterModal}
          stageNum={this.state.currentStage.stageNum}
          sourceTool={this.state.sourceTool}
          destinationTool={this.state.destinationTool}
          eventTool={this.state.eventTool}
        />

        <Row>
          <Stage width={stageW} height={stageH} className="stage">
            <Layer>
              {this.state.stage.stageTool.map((tool, key) => (
                <LabTool
                  key={key}
                  src={tool.Img}
                  x={tool.x}
                  y={tool.y}
                  id={tool.id}
                  stageNum={this.state.stage.stageNum}
                  stageTool={this.state.stage.stageTool}
                  setCurrentStage={this.setCurrentStage}
                  setTool={this.setCurrentTool}
                  setShowModal={null}
                  setInteraction={this.setInteraction}
                  setShowInterModal={this.setShowInterModal}
                />
              ))}

              <Text
                text={this.state.stage.instructions}
                fontSize={20}
                x={0.1 * stageW}
                y={0.05 * stageH}
                width={0.8 * stageW}
                align="center"
              />
            </Layer>
          </Stage>

          <Card border="secondary" className="col-md-2">
            <Card.Body>
              <Card.Title>Lab Progress</Card.Title>
              <Modal.Body
                style={{
                  "max-height": "calc(100vh - 310px)",
                  "overflow-y": "auto"
                }}
              >
                <ProgressBar
                  now={Math.round(
                    100 * (this.state.currentStage / this.state.getTotalStage)
                  )}
                  label={Math.round(
                    100 * (this.state.currentStage / this.state.getTotalStage)
                  )}
                />
                <br />
                {this.state.currentStage + 1 === this.state.getTotalStage ? (
                  <Button onClick={this.finishLab}>Finish</Button>
                ) : (
                  <Button onClick={this.getNextStage}>Next</Button>
                )}
                <Button onClick={this.back}>Leave</Button>
              </Modal.Body>
            </Card.Body>
          </Card>
        </Row>
      </React.Fragment>
    );
  }
}
export default withRouter(Dolab);
