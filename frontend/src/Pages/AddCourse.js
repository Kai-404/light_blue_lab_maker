import React, { Component } from "react";
import { withRouter } from "react-router";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import axios from "axios";
import "../App.css";

class AddCourse extends Component {

    state = {
        errMsg: "",
        showAddCourse: false,
        validated: false,
        courseName: '',
        term: ''
    };

    openAddCourse = () => {
        this.setState({showAddCourse: true})
    };

    closeAddCourse = () => {
        this.setState({
            errMsg: "",
            showAddCourse: false,
            courseName: '',
            term: ''
        })
    };

    addCourse() {
        if (this.state.courseName === "" || this.state.term === "") {
            //this.setState({errMsg: "Please fill in all fields!"})
        }
        else {
            axios.post("/addcourse", {
                title: this.state.courseName,
                term: this.state.term,
                professor: sessionStorage.getItem("username"),
                firstName: sessionStorage.getItem("userFirstName"),
                lastName: sessionStorage.getItem("userLastName")
            })
                .then(res => {
                    this.props.getCourseList();
                })
                .catch((err => {
                    console.log("error")
                }));
            this.setState({
                showAddCourse: false,
                courseName: '',
                term: ''
            });
        }
        this.setState({ validated: true });
    };

    onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
        <div>
            <Button onClick={this.openAddCourse}>
                Add Course
            </Button>

            <Modal show={this.state.showAddCourse} onHide={this.closeAddCourse}>
                <Modal.Header>
                    <Modal.Title>Add a New Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        noValidate
                        validated={this.state.validated}
                        onSubmit={this.addCourse}
                    >
                        <Form.Label>Course Name</Form.Label>
                        <InputGroup>
                            <Form.Control
                                required
                                name="courseName"
                                value={this.state.courseName}
                                onChange={this.onChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter the course name.
                            </Form.Control.Feedback>
                        </InputGroup>

                        <Form.Label>Term</Form.Label>
                            <Form.Control
                                required
                                name="term"
                                value={this.state.term}
                                onChange={this.onChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter the term.
                            </Form.Control.Feedback>
                        <Button onClick={() => this.addCourse()}>Add</Button>
                        <Button onClick={this.closeAddCourse}>Cancel</Button>
                    </Form>
                </Modal.Body>
            </Modal>

        </div>
    );
  }
}

export default AddCourse;
