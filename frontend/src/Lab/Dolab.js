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
        }
    };

    back = () => {
        this.props.history.push("/labspage");
    };

    getTotalStage() {
        axios.get("http://localhost:8080/gettotalstage").then(res => {
            this.setState({getTotalStage: res.data});
        });
    }

    getCurrentStage() {
        axios.get("http://localhost:8080/getcurrentstage").then(res => {
            console.log("test2");
            console.log(res.data);
            this.setState({currentStage: res.data});
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
        axios
            .get(
                "http://localhost:8080/getdolabstage"
            )
            .then(
                res => {
                    this.setState({stage: res.data})
                }
            )
    };

    componentDidMount() {
        this.getStage();
        this.getTotalStage();
        this.getCurrentStage();
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
                    console.log("test1");
                    console.log(res.data);
                    this.setState({currentStage: res.data.stageNum});
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

    render() {
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
                                    now={Math.round(100 * (this.state.currentStage / this.state.getTotalStage))}
                                    label={Math.round(100 * (this.state.currentStage / this.state.getTotalStage))}
                                />
                                <br/>
                                {
                                    this.state.currentStage + 1 === this.state.getTotalStage ?
                                        <Button onClick={this.finishLab}>Finish</Button>
                                        :
                                        <Button onClick={this.getNextStage}>Next</Button>
                                }
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