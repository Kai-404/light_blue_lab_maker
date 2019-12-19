import React, {Component} from "react";
import {withRouter} from "react-router";
import {Button, Col, InputGroup, Form, Modal} from "react-bootstrap";
import axios from "axios";
import "../App.css";

class AddAnnouncement extends Component {
    state = {
        errMsg: "",
        validated: false,
        showAddAnnoun: false,
        announTitle: "",
        content: ""
    };

    setShowAdd = () => {
        this.setState({
            showAddAnnoun: !this.state.showAddAnnoun,
            errMsg: "",
            announTitle: "",
            content: ""
        });
    };s

    addNewAnnouncement = event => {
        const form = event.currentTarget;
        if (this.state.announTitle === "" || this.state.content === "") {
            //this.setState({errMsg: "Please fill in all fields!"})
        } else {
            let title = this.state.announTitle;
            let content = this.state.content;
            let courseId = sessionStorage.getItem("currentCourse");
            let data = JSON.stringify({
                courseId,
                title,
                content
            });
            axios
                .post("/newAnnouncement", data, {
                    headers: {"Content-Type": "application/json;charset=UTF-8"},
                    params: {
                        courseId: courseId,
                        title: title,
                        content: content,
                        author: sessionStorage.getItem("username")
                    }
                })
                .then(res => {
                    this.props.updateAnnouncements();
                })
                .catch(err => {
                    alert("Fail to add a new announcement");
                });
            this.setState({
                showAddAnnoun: false,
                announTitle: "",
                content: ""
            });
        }
        this.setState({ validated: true });
    };

    onChange = e => this.setState({[e.target.name]: e.target.value});

    render() {
        return (
            <React.Fragment>
                <Button
                    variant="info"
                    className="submitButton"
                    onClick={this.setShowAdd}
                >
                    Add Announcement
                </Button>

                <Modal show={this.state.showAddAnnoun} onHide={this.setShowAdd}>
                    <Modal.Header>
                        <Modal.Title>New Announcement</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form
                            noValidate
                            validated={this.state.validated}
                            onSubmit={this.addNewAnnouncement}
                        >
                            <Form.Label>Announcement Title</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    required
                                    name="announTitle"
                                    value={this.state.announTitle}
                                    onChange={this.onChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter a title.
                                </Form.Control.Feedback>
                            </InputGroup>

                            <Form.Label>Content</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    as="textarea"
                                    rows="3"
                                    required
                                    name="content"
                                    value={this.state.content}
                                    onChange={this.onChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please add content.
                                </Form.Control.Feedback>
                            </InputGroup>
                            <Button variant="dark" onClick={this.addNewAnnouncement}>
                                Add
                            </Button>
                            <Button variant="dark" onClick={this.setShowAdd}>
                                Cancel
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        );
    }
}

export default AddAnnouncement;
