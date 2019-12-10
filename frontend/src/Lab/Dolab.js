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
import Tooltip from "./Tooltip";
import "../App.css";

const stageW = window.innerWidth - window.innerWidth * 0.4;
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
        hasInter: false,
        inter: {
            Description: "Some description",
            Name: "Name of interaction",
            Prams: {
                PramName: "",
                Value: ""
            }
        },
        studentProgress: -1
    };

    back = () => {
        this.props.history.push("/labspage");
    };

    getStudentProgress() {
        axios
            .get("http://localhost:8080/getstudentprogress", {
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                params: {
                    id: sessionStorage.getItem("userID")
                }
            })
            .then(res => {
                console.log(res.data);
                this.setState({studentProgress: res.data})
            });
    }

    getTotalStage() {
        axios.get("http://localhost:8080/gettotalstage").then(res => {
            this.setState({getTotalStage: res.data});
        });
    }

    getStage = () => {
        axios
            .get("http://localhost:8080/getdolabstage",
                {
                    headers: {"Content-Type": "application/json;charset=UTF-8"},
                    params: {id: sessionStorage.getItem("userID")}
                }
            )
            .then(
                res => {
                    this.setState({stage: res.data})
                }
            )
    };

    componentDidMount() {
        this.getStudentProgress();
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
                .post("http://localhost:8080/getstage", data, {
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

    setShowInterModal = () => {
        this.setState({hasInter: !this.state.hasInter});
    };

    check = () => {
        axios
            .get("http://localhost:8080/dolabcheckstage",
                {
                    headers: {"Content-Type": "application/json;charset=UTF-8"},
                    params: {
                        stageNum: this.state.stage.stageNum,
                        id: sessionStorage.getItem("userID")
                    }
                }
            )
            .then(
                res => {
                    if (res.data === true) {
                        alert("correct");
                        this.getStudentProgress();
                    } else {
                        alert("wrong");
                    }
                }
            )
    };

    next = () => {
        axios
            .get("http://localhost:8080/getnextstage",
                {
                    headers: {"Content-Type": "application/json;charset=UTF-8"},
                    params: {stageNum: this.state.stage.stageNum}
                }
            )
            .then(
                res => {
                    this.setState({stage: res.data});
                }
            )
    };

    render() {

        let stageList = [];
        for (let i = 0; i < this.state.getTotalStage; i++) {
            stageList.push(
                <ListGroup.Item
                    action
                    active={i === this.state.stage.stageNum}
                    disabled={i > this.state.studentProgress}
                    onClick={() => this.setCurrentStage(i)}
                >
                    {i}
                </ListGroup.Item>
            );
        }

        return (
            <React.Fragment>
                <Modal
                    size="sm"
                    centered
                    show={this.state.hasInter}
                    onHide={this.setShowInterModal}
                    dialogClassName="modal-90w"
                    aria-labelledby="example-custom-modal-styling-title"
                >
                    <Modal.Header>
                        <Modal.Title id="example-custom-modal-styling-title">
                            {this.state.inter.Name}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Label column sm={2}>
                                {this.state.inter.Prams.PramName}
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control
                                    required
                                    type={this.state.inter.Prams.PramName}
                                    defaultValue={this.state.inter.Prams.Value}
                                    onChange={this.handleChangeProps}
                                />
                            </Col>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>{this.state.inter.Description}</Modal.Footer>
                </Modal>
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
                            <ProgressBar
                                now={Math.round(100 * (this.state.studentProgress / this.state.getTotalStage))}
                                label={Math.round(100 * (this.state.studentProgress / this.state.getTotalStage)) + "%"}
                            />
                            <br/>
                            <Modal.Body
                                style={{
                                    "max-height": "calc(100vh - 310px)",
                                    "overflow-y": "auto"
                                }}
                            >
                                <ListGroup id="stageGroup">
                                    {stageList}
                                </ListGroup>
                            </Modal.Body>
                        </Card.Body>
                        <Button className="addtoolButton" onClick={this.check}>Check</Button>
                        <Button className="addtoolButton" onClick={this.next}
                                disabled={this.state.stage.stageNum >= this.state.studentProgress || this.state.stage.stageNum + 1 === this.state.getTotalStage}>Next</Button>
                        <Button className="addtoolButton" onClick={this.back}>Leave</Button>
                    </Card>

                </Row>
            </React.Fragment>
        );
    }
}

export default withRouter(Dolab);
