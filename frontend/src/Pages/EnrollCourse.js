import React, { Component } from "react";
import { withRouter } from "react-router";
import {Button, Modal, ListGroup, FormCheck} from "react-bootstrap";
import axios from "axios";
import "../App.css";

class EnrollCourse extends Component {

    state = {
        showEnrollCourse: false,
        courseList: [],
        courseListIDs: [],
        courseName: '',
        courseTerm: ''
    };

    openEnrollCourse = () => {
        this.getCourseSelection();
        this.setState({showEnrollCourse: true});
    };

    closeEnrollCourse = () => {
        this.setState({
            showEnrollCourse: false,
            courseList: [],
            courseListIDs: [],
            courseName: '',
            courseTerm: ''
        })
    };

    getCourseList = () => {
        axios
            .get(
                "http://localhost:8080/getcourselist",
                {
                    headers: {"Content-Type": "application/json;charset=UTF-8"},
                    params: {
                        id: this.props.user.id,
                        username: this.props.user.username,
                        userType: this.props.user.userType
                    }
                }
            )
            .then(
                res => {
                    let idList = [];
                    res.data.map(course => {idList.push(course.id)});
                    this.setState({
                        courseListIDs: idList
                    })
                }
            )
    };

    getCourseSelection() {
        axios
            .get(
                "http://localhost:8080/getcourseselection",
                {
                    headers: {"Content-Type": "application/json;charset=UTF-8"},
                    params: {
                        courseName: this.state.courseName,
                        courseTerm: this.state.courseTerm
                    }
                }
            )
            .then(
                res => {
                    this.props.getCourseList();
                    this.getCourseList();
                    this.setState({
                        courseList: res.data
                    })
                }
            )
    }

    enrollCourse = id => {
        axios
            .get(
                "http://localhost:8080/enrollcourse",
                {
                    headers: {"Content-Type": "application/json;charset=UTF-8"},
                    params: {
                        userID: this.props.user.id,
                        courseID: id
                    }
                }
            )
            .then(
                res => {
                    this.getCourseList();
                    this.getCourseSelection();
                }
            )
    };

    unenrollCourse = id => {
        axios
            .get(
                "http://localhost:8080/unenrollcourse",
                {
                    headers: {"Content-Type": "application/json;charset=UTF-8"},
                    params: {
                        userID: this.props.user.id,
                        courseID: id
                    }
                }
            )
            .then(
                res => {
                    this.getCourseSelection();
                }
            )
    };

    componentDidMount() {
    };

    onChange = e => {
        this.setState(
            { [e.target.name]: e.target.value },
            () => {this.getCourseSelection()}
            );
    };

    render() {
        return (
            <div>
                <Button onClick={this.openEnrollCourse}>
                    Enroll
                </Button>

                <Modal show={this.state.showEnrollCourse} onHide={this.closeEnrollCourse}>

                    <Modal.Header>
                        <Modal.Title>Enroll in a course</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <form>
                            Course Name
                            <input
                                className="input"
                                name="courseName"
                                value={this.state.courseName}
                                onChange={this.onChange}
                            >
                            </input>
                            <br/>
                            Course Term
                            <input
                                className="input"
                                name="courseTerm"
                                value={this.state.courseTerm}
                                onChange={this.onChange}
                            >
                            </input>
                            <br/>
                            <br/>
                            Course List
                            <ListGroup horizontal id='courseselectiongroup'>
                                {this.state.courseList.map(course =>
                                    (
                                        <ListGroup.Item>
                                            <div class='courseselectionlist'>
                                                {
                                                    this.state.courseListIDs.indexOf(course.id)>-1?
                                                        <Button id='enrollbutton' onClick={() => this.unenrollCourse(course.id)}>Unenroll</Button>
                                                        :
                                                        <Button id='enrollbutton' onClick={() => this.enrollCourse(course.id)}>Enroll</Button>
                                                }
                                                {course.title + " " + course.term}
                                            </div>
                                        </ListGroup.Item>
                                    )
                                )}
                            </ListGroup>
                        </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.closeEnrollCourse}>Done</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
}

export default EnrollCourse;