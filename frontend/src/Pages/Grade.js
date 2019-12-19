import React, {Component} from "react";
import {withRouter} from "react-router";
import {Table, DropdownButton, Dropdown, Form} from "react-bootstrap";
import axios from "axios";

class Discussion extends Component {

    state = {
        labList: [],
        studentGrades: [[]],
        labTitle: "Select a lab",
        numStages: 0,
        currentStage: "",
        labName: ""
    };


    getLabs = () => {
        axios
            .get("/getlabofcourse", {
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                params: {
                    id: sessionStorage.getItem("currentCourse"),
                    labName: this.state.labName
                }
            })
            .then(
                res => {
                    this.setState({labList: res.data})
                }
            )
    };

    componentDidMount() {
        this.getLabs();
    }

    selectLab = e => {
        this.setState({
            labTitle: this.state.labList[e].title,
            numStages: this.state.labList[e].stageList.length,
            currentStage: "0"
        });
        this.getStudentGrades(e);
    };

    selectStage = e => {
        this.setState({
            currentStage: e,
            stageTitle: e
        });
    };

    getStudentGrades = e => {
        axios
            .get("/getstudentgrades", {
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                params: {
                    courseID: sessionStorage.getItem("currentCourse"),
                    labID: this.state.labList[e].id
                }
            })
            .then(
                res => {
                    console.log(res.data);
                    this.setState({
                        studentGrades: res.data
                    })
                }
            )
    };

    getLabel(i) {
        if (i === 0) {
            return "Name"
        } else if (i === 1) {
            return "Progress"
        }
        return "Stage " + (i - 2);
    }

    populateLabSelection() {
        let labSelection = [];
        labSelection.push(
            <Form.Control
                className="control"
                placeHolder="Search lab here ..."
                name="labName"
                value={this.state.labName}
                onChange={this.onChange}
            />
            );
        let i;
        for (i=0; i<this.state.labList.length; i++) {
            labSelection.push(
                <Dropdown.Item
                    eventKey={i}
                >
                    {this.state.labList[i].title}
                </Dropdown.Item>
            )
        }
        return labSelection;
    };

    onChange = e => {
        this.setState(
            { [e.target.name]: e.target.value },
            () => {
                this.getLabs();
            }
        );
    };

    resetSearch = () => {
        this.setState({labName: ""});
        this.getLabs();
    };

    populateStageSelection() {
        let stageSelection = [];
        let i;
        for (i = 0; i < this.state.numStages; i++) {
            stageSelection.push(
                <Dropdown.Item eventKey={i}>
                    {i}
                </Dropdown.Item>
            )
        }
        return stageSelection;
    }

    render() {
        return (
            <React.Fragment>
                <DropdownButton
                    title={this.state.labTitle}
                    onSelect={this.selectLab}
                    onClick={this.resetSearch}
                >
                    {this.populateLabSelection()}
                </DropdownButton>
                <br/>
                <Table striped bordered>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Progress</th>
                        <th>
                            Stage
                            <DropdownButton title={this.state.currentStage} onSelect={this.selectStage}
                                            id="stageSelector">
                                {this.populateStageSelection()}
                            </DropdownButton>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.studentGrades.map(student =>
                            (
                                <tr>
                                    {<td>{student[0]}</td>}
                                    {<td>{student[1]}</td>}
                                    {<td>{student[parseInt(this.state.currentStage) + 2]}</td>}
                                </tr>
                            )
                        )
                    }
                    </tbody>
                </Table>
            </React.Fragment>
        );
    }
}

export default withRouter(Discussion);
