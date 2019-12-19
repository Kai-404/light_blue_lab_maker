import React, { Component } from "react";
import { withRouter } from "react-router";
import { Card, Col, Form, ListGroup, Button, Row } from "react-bootstrap";
import "../App.css";
import axios from "axios";
import AddCourse from "./AddCourse";
import EnrollCourse from "./EnrollCourse";

class HomePage extends Component {

    state = {
        courseList: [],
        courseName: "",
        term: ""
    };

    getCourseList = () => {
        console.log((this.state.courseName));
        axios.get("/getcourselist", {
            headers: { "Content-Type": "application/json;charset=UTF-8" },
            params: {
                id: sessionStorage.getItem("userID"),
                username: sessionStorage.getItem("username"),
                userType: sessionStorage.getItem("userType"),
                courseName: this.state.courseName,
                term: this.state.term
            }
        }).then(res => this.setState({ courseList: res.data }))
    };

    onChange = e => {
        this.setState(
            { [e.target.name]: e.target.value },
            () => {
                this.getCourseList()
            }
        );
    };

    componentDidMount() {
        sessionStorage.setItem("underCourse", "false");
        this.getCourseList();
    };

    showBar = course => {
        sessionStorage.setItem("underCourse", "true");
        sessionStorage.setItem("currentCourse", course.id);
        sessionStorage.setItem("currentCourseName", course.title);
        sessionStorage.setItem("currentCourseTerm", course.term);
        this.props.history.push("/announcements");
    };

    updatePage() {
        this.forceUpdate();
    }

    render() {
        return (
            <ListGroup>
                <Row>
                    <Form.Label>Course Name</Form.Label>
                    <Col>

                        <Form.Control
                            className="control"
                            placeholder="Search by Course Name"
                            name="courseName"
                            value={this.state.courseName}
                            onChange={this.onChange}
                        />
                    </Col>
                    <Form.Label>Course Term</Form.Label>
                    <Col>
                        <Form.Control
                            className="control"
                            name="term"
                            placeholder="Search by Course Term"
                            value={this.state.term}
                            onChange={this.onChange}
                        />
                    </Col>
                </Row>
                <br />
                {this.state.courseList.map(course => (
                    <Card>
                        <Card.Header>{course.term}</Card.Header>
                        <Card.Body>
                            <Card.Title>{course.title}</Card.Title>
                            <Card.Text>{course.firstName} {course.lastName}</Card.Text>
                            <Button variant="primary" onClick={() => this.showBar(course)}>
                                Go to the course
                            </Button>
                        </Card.Body>
                    </Card>
                ))}
                {
                    sessionStorage.getItem("userType") === 'Professor' ?
                        <AddCourse getCourseList={this.getCourseList} />
                        :
                        <EnrollCourse getCourseList={this.getCourseList} />
                }
            </ListGroup>
        );
    }
}

export default withRouter(HomePage);
