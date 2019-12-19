import React, {Component} from "react";
import axios from "axios";
import {withRouter} from "react-router";
import Konva from "konva";
import {Stage, Layer, Star, Text, Image} from "react-konva";
import useImage from "use-image";
import Sidebar from "../Layout/Sidebar";
import {LinkContainer} from "react-router-bootstrap";
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

const stageW = window.innerWidth - window.innerWidth * 0.3;
const stageH = window.innerHeight - 400;

class Dolab extends Component {
    state = {
        getTotalStage: -1,
        currentTool: [],
        stage: {
            stageNum: -1,
            stageTool: [],
            instructions: ""
        },
        studentProgress: -1,
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
        sourceTool: {Prop: []},
        destinationTool: {Prop: []},
        eventTool: {}
    };

    back = () => {
        this.props.history.push("/labspage");
    };

    resetState() {
      this.setState({
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
            tempTool: {},
            sourceTool: {Prop: []},
            destinationTool: {Prop: []},
            eventTool: {}
          }
      );
    }

    getStudentProgress() {
        axios
            .get("/getstudentprogress", {
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                params: {
                    id: sessionStorage.getItem("userID")
                }
            })
            .then(res => {
                console.log(res.data);
                this.setState({studentProgress: res.data});
            });
    }

    getTotalStage() {
        axios.get("/gettotalstage").then(res => {
            this.setState({getTotalStage: res.data});
        });
    }

    getStage = () => {
        axios
            .get("/getdolabstage", {
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                params: {
                    id: sessionStorage.getItem("userID"),
                    userType: sessionStorage.getItem("userType")
                }
            })
            .then(res => {
                this.setState({stage: res.data});
            });
    };

    componentDidMount() {
        if (sessionStorage.getItem("userType") === "Student") {
            this.getStudentProgress();
        }
        this.getTotalStage();
        this.getStage();
    }

    setCurrentTool = tool => {
        this.setState({currentTool: tool});
    };

    setCurrentStage = i => {
        let data = JSON.stringify(i);
        if (i > -1) {
            axios
                .post("/getstage", data, {
                    headers: {"Content-Type": "application/json;charset=UTF-8"},
                    params: {stageNum: i}
                })
                .then(res => {
                    this.setState({stage: res.data});
                });
        } else {
            this.setState({stage: {stageNum: -1, stageTool: []}});
        }
    };

    setInteraction = inter => {
        console.log("pased:", inter);
        this.setState({inter: inter});
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
                sourceTool: {Prop: []},
                destinationTool: {Prop: []},
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
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                params: {
                    stageNum: stageNum,
                    ID: source
                }
            })
            .then(res => {
                this.setState({sourceTool: res.data});
            });
        axios
            .post("/gettool", data, {
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                params: {
                    stageNum: stageNum,
                    ID: destination
                }
            })
            .then(res => {
                this.setState({destinationTool: res.data});
            });
    };

    check = () => {
        axios
            .get("/dolabcheckstage", {
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                params: {
                    stageNum: this.state.stage.stageNum,
                    id: sessionStorage.getItem("userID"),
                    userType: sessionStorage.getItem("userType")
                }
            })
            .then(res => {
                console.log(res.data);
                if (res.data === true) {
                    alert("You are correct! Click Next to go to next stage or leave to leave the lab.");
                    if (sessionStorage.getItem("userType") === "Student") {
                        this.getStudentProgress();
                    }
                } else {
                    alert("You are wrong. Please read the instruction carefully and try one more time.");
                }
            });
    };

    resetLab = () => {
        axios
            .get("/resetlabstage",
                {
                    headers: {"Content-Type": "application/json;charset=UTF-8"},
                    params: {
                        stageNum: this.state.stage.stageNum,
                    }
                }
            )
            .then(res => {
                this.resetState();
                this.setState({stage: res.data});
            });
    };

    getNextStage = () => {
        console.log("test");
        axios
            .get("/getnextstage", {
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                params: {stageNum: this.state.stage.stageNum}
            })
            .then(res => {
                console.log(res.data);
                this.setState({stage: res.data});
            });
    };

    disableNextButton = () => {
        if (sessionStorage.getItem("userType") === "Student") {
            return (
                this.state.stage.stageNum >= this.state.studentProgress ||
                this.state.stage.stageNum + 1 === this.state.getTotalStage
            );
        } else {
            return this.state.stage.stageNum + 1 === this.state.getTotalStage;
        }
    };

    disableStageSelector = i => {
        if (sessionStorage.getItem("userType") === "Student") {
            return i > this.state.studentProgress;
        }
        return false;
    };

    render() {
        let stageList = [];
        for (let i = 0; i < this.state.getTotalStage; i++) {
            stageList.push(
                <ListGroup.Item
                    action
                    active={i === this.state.stage.stageNum}
                    disabled={this.disableStageSelector(i)}
                    onClick={() => this.setCurrentStage(i)}
                >
                    {i}
                </ListGroup.Item>
            );
        }

        return (
            <React.Fragment>
                <InteractionModal
                    interaction={this.state.inter}
                    setInteraction={this.setInteraction}
                    show={this.state.hasInter}
                    setShow={this.setShowInterModal}
                    stageNum={this.state.stage.stageNum}
                    updateTools={this.updateTools}
                    sourceTool={this.state.sourceTool}
                    destinationTool={this.state.destinationTool}
                    eventTool={this.state.eventTool}
                    setCurrentStage={this.setCurrentStage}
                    getToolById={this.getToolById}
                />
                <Row>
                    <Col>
                        <div className="stage" id="stageInstructions">
              <textarea
                  readOnly={true}
                  id="stageInstructionsText"
                  value={this.state.stage.instructions}
              />
                        </div>
                        <Stage width={stageW} height={stageH} className="stage">
                            <Layer>
                                {this.state.stage.stageTool.map((tool, key) => (
                                    <LabTool
                                        key={key}
                                        src={tool.Img}
                                        x={tool.x}
                                        y={tool.y}
                                        id={tool.id}
                                        nickname={tool.nickname}
                                        stageNum={this.state.stage.stageNum}
                                        stageTool={this.state.stage.stageTool}
                                        setCurrentStage={this.setCurrentStage}
                                        setTool={this.setCurrentTool}
                                        setShowModal={null}
                                        setInteraction={this.setInteraction}
                                        setShowInterModal={this.setShowInterModal}
                                    />
                                ))}
                            </Layer>
                        </Stage>
                    </Col>

                    <Card border="secondary" className="col-md-2" id="labStageComponent">
                        <Card.Body>
                            <Card.Title>Lab Progress</Card.Title>
                            {sessionStorage.getItem("userType") === "Student" ? (
                                <ProgressBar
                                    now={Math.round(
                                        100 *
                                        (this.state.studentProgress / this.state.getTotalStage)
                                    )}
                                    label={
                                        Math.round(
                                            100 *
                                            (this.state.studentProgress / this.state.getTotalStage)
                                        ) + "%"
                                    }
                                />
                            ) : (
                                <ProgressBar now={100} label={"100%"}/>
                            )}
                            <br/>
                            <Modal.Body
                                style={{
                                    "max-height": "calc(100vh - 310px)",
                                    "overflow-y": "auto"
                                }}
                            >
                                <ListGroup id="stageGroup">{stageList}</ListGroup>
                            </Modal.Body>
                        </Card.Body>
                        <Button className="addtoolButton" onClick={this.check}>
                            Check
                        </Button>
                        <Button className="addtoolButton" onClick={this.resetLab}>
                            Reset
                        </Button>
                        <Button
                            className="addtoolButton"
                            onClick={this.getNextStage}
                            disabled={this.disableNextButton()}
                        >
                            Next
                        </Button>
                        <Button className="addtoolButton" onClick={this.back}>
                            Leave
                        </Button>
                    </Card>
                </Row>
            </React.Fragment>
        );
    }
}

export default withRouter(Dolab);
