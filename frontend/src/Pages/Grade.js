import React, {Component} from "react";
import {withRouter} from "react-router";
import {Table, DropdownButton, Dropdown} from "react-bootstrap";
import axios from "axios";

class Discussion extends Component {

    state = {
        labList: [],
        studentGrades: [[]],
        buttonTitle: "Select a lab"
    };


    getLabOfCourse = () => {
        axios
            .get("http://localhost:8080/getlabofcourse", {
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                params: {
                    id: sessionStorage.getItem("currentCourse")
                }
            })
            .then(
                res => {
                    this.setState({labList: res.data})
                }
            )
    };

    componentDidMount() {
        this.getLabOfCourse();
    }

    handleSelect = e => {
        this.setState({buttonTitle: this.state.labList[e].title})
        this.getStudentGrades(e);
    };

    getStudentGrades = e => {
        axios
            .get("http://localhost:8080/getstudentgrades", {
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                params: {
                    courseID: sessionStorage.getItem("currentCourse"),
                    labID: this.state.labList[e].id
                }
            })
            .then(
                res => {
                    this.setState({studentGrades: res.data})
                }
            )
    };

    getLabel(i) {
        if (i===0) { return "Name"}
        else if (i===1) { return "Progress"}
        return "Stage " + (i-2);
    }

    render() {

        let header =
            (
                <div>
                    <th>Name</th>
                    <th>Progress</th>
                </div>
            );
        if (this.state.studentGrades[0]) {
            header =
                this.state.studentGrades[0].map((item, i) =>
                    <th>
                        {this.getLabel(i)}
                    </th>
                )
        }

        return (
            <React.Fragment>
                <DropdownButton
                    title={this.state.buttonTitle}
                    onSelect={this.handleSelect}
                >
                    {
                        this.state.labList.map((lab, index) =>
                            (
                                <Dropdown.Item
                                    eventKey={index}
                                >
                                    {lab.title}
                                </Dropdown.Item>
                            )
                        )
                    }
                </DropdownButton>
                <br/>
                <Table striped bordered>
                    <thead>
                        <tr>
                            {header}
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.studentGrades.map(student =>
                            (
                                <tr>
                                    {
                                        student.map(item =>
                                            (
                                                <td>{item}</td>
                                            )
                                        )
                                    }
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
