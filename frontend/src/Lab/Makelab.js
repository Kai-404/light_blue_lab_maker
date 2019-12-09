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
        sourceTool: {Prop: []},
        destinationTool: {Prop: []}
    };

    componentDidMount() {
        this.getTotalStage();
        this.setCurrentStage(-1);
        //  to display the lab tool bar when loading the page
        axios.get("http://localhost:8080/getalltools").then(res => {
            this.addLabTool(res.data);
        });
    }

    getTotalStage() {
        axios.get("http://localhost:8080/gettotalstage").then(res => {
            this.setState({getTotalStage: res.data});
        });
    }

    setCurrentStage = i => {
        let data = JSON.stringify(i);
        if (i > -1) {
            axios
                .post("http://localhost:8080/getstage", data, {
                    headers: {"Content-Type": "application/json;charset=UTF-8"},
                    params: {stageNum: i}
                })
                .then(res => {
                    this.setState({currentStage: res.data});
                });
        } else {
            this.setState({currentStage: {stageNum: -1, stageTool: []}});
        }
    };

    duplicateStage() {
        axios
            .post(
                "http://localhost:8080/duplicatestage",
                JSON.stringify(this.state.currentStage.stageNum),
                {
                    headers: {"Content-Type": "application/json;charset=UTF-8"}
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
                    headers: {"Content-Type": "application/json;charset=UTF-8"}
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
                headers: {"Content-Type": "application/json;charset=UTF-8"}
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
        this.setState({inter: inter});
    };
    //add tool to whole lab
    addLabTool = tool => {
        let allTool = tool.filter(t => {
            if (t.Display) {
                return t;
            }
        });
        this.setState({labTools: allTool});
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
                headers: {"Content-Type": "application/json;charset=UTF-8"},
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
        axios
            .get("http://localhost:8080/savelab", {
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                params: {
                    courseID: sessionStorage.getItem("currentCourse"),
                    username: sessionStorage.getItem("username")
                }
            })
            .then(res => {
                if (res.data) {
                    alert("successfully saved lab");
                } else {
                    alert("fail to save the lab");
                }
            });
    };

    publishLab = () => {
        axios
            .get("http://localhost:8080/publishlab",
                {
                    params: {
                        courseID: sessionStorage.getItem("currentCourse"),
                    }
                })
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
        this.setState({currentTool: tool});
    };

    setShowModal = () => {
        this.setState({showPop: !this.state.showPop});
    };

    setShowInterModal = (source, destination) => {
        this.setState({
            hasInter: !this.state.hasInter
        });
        if (source || destination) {
            this.setState({
                sourceTool: source,
                destinationTool: destination
            });
        }
    };

    dataChanged(data) {

    }

    updateInstructions = event => {
        axios
            .post("http://localhost:8080/saveinstructions", null, {
                headers: {"Content-Type": "application/json;charset=UTF-8"},
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
        return (
            <React.Fragment>
                <p className="errmsg">{this.state.errMsg}</p>
                <InteractionModal
                    interaction={this.state.inter}
                    show={this.state.hasInter}
                    setShow={this.setShowInterModal}
                    sourceTool={this.state.sourceTool}
                    destinationTool={this.state.destinationTool}
                />

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
                    <Addtool addLabTool={this.addLabTool}/>
                </ButtonGroup>
                <br/>
                <Row>
                    {/* append tools to the stageTool and rerender */}
                    <Col>
                        <div className="stage" id="stageInstructions">
                            <textarea
                                id="stageInstructionsText"
                                value={this.state.currentStage.instructions}
                                onChange={this.updateInstructions}
                            />
                        </div>
                        <Stage width={stageW} height={stageH} className="stage">
                            <Layer>
                                {this.state.currentStage.stageTool.map((tool, key) => (
                                    <LabTool
                                        key={key}
                                        src={tool.Img}
                                        x={tool.x}
                                        y={tool.y}
                                        id={tool.id}
                                        stageNum={this.state.currentStage.stageNum}
                                        stageTool={this.state.currentStage.stageTool}
                                        setCurrentStage={this.setCurrentStage}
                                        setTool={this.setCurrentTool}
                                        setShowModal={this.setShowModal}
                                        setInteraction={this.setInteraction}
                                        setShowInterModal={this.setShowInterModal}
                                    />
                                ))}
                            </Layer>
                        </Stage>
                    </Col>
                    <Card border="secondary" className="col-md-2" id="labStageComponent">
                        <Card.Body>
                            <Card.Title>Lab Stages</Card.Title>
                            <Modal.Body
                                style={{
                                    "max-height": "calc(100vh - 310px)",
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
                    </Card>
                </Row>
                <br/>
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