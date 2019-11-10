import React, { Component } from "react";
import { withRouter } from "react-router";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Beaker from "../Image/beaker.png";
import Burner from "../Image/burner.png";
import pH from "../Image/ph.png";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  Card,
  CardDeck,
  ListGroup,
  Container,
  Row,
  Modal
} from "react-bootstrap";
import Addtool from "./Addtool";
import LabStage from "./LabStage";
import "../App.css";
import axios from "axios";

class Makelab extends Component {
  state = {
    currentStage: -1,
    lab: {
      stageList: [],
      labTools: []
    },
    rerender: false
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
    this.state.lab.labTools = allTool;
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

  back = () => {
    this.props.history.push("/labspage");
  };

  componentDidMount() {
    axios.get("/getlab").then(res => {
      this.setState({ stageList: res.data.stageList });
    });
  }

  /*
  <Button className="toolButton">
            <img src={Beaker} className="UserIcon" alt="Beaker" />
          </Button>
          <Button className="toolButton">
            <img src={Burner} className="UserIcon" alt="Burner" />
          </Button>
          <Button className="toolButton">
            <img src={pH} className="UserIcon" alt="pH paper" />
          </Button>
          */

  render() {
    let toolBar;
    if (this.state.rerender) {
      toolBar = (
        <React.Fragment>
          {this.state.lab.labTools.map(tool => (
            <Button className="toolButton">
              <img src={tool.Img} className="UserIcon" alt={tool.Name} />
            </Button>
          ))}
        </React.Fragment>
      );
    } else {
      toolBar = (
        <React.Fragment>
          {this.state.lab.labTools.map(tool => (
            <Button className="toolButton">
              <img src={Beaker} className="UserIcon" alt={tool.Name} />
            </Button>
          ))}
        </React.Fragment>
      );
    }
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
          <LabStage />
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
          <Button className="submitButton" onClick={this.back}>
            Cancel
          </Button>
        </ButtonGroup>
      </React.Fragment>
    );
  }
}

export default withRouter(Makelab);
