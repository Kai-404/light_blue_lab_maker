import React, {Component} from "react";
import {withRouter} from "react-router";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import axios from "axios";
import "../App.css";

class Addlab extends Component {
    state = {
        errMsg: "",
        showAddLab: false,
        validated: false,
        labTitle: "",
        description: ""
    };

    setShowAddLab = () => {
        this.setState({showAddLab: !this.state.showAddLab});
    };

    addNewLab = () => {
        if (this.state.labTitle === "" || this.state.description === "") {
            //this.setState({errMsg: "Please fill in all fields!"})
        } else {
            let title = this.state.labTitle;
            //for testing
            let author = "kai";
            if (sessionStorage.getItem("username")) author = sessionStorage.getItem("username");
            let description = this.state.description;
            let data = JSON.stringify({
                author,
                title,
                description
            });
            axios
                .post("/newlab", data, {
                    headers: {"Content-Type": "application/json;charset=UTF-8"},
                    params: {title: title, author: author, description: description}
                })
                .then(res => {
                    sessionStorage.setItem("currentLabTitle", title);
                    sessionStorage.setItem("currentLabDescription", description);
                    this.props.his.push("/makelab");
                })
                .catch(err => {
                    alert("Fail to add a new lab");
                });
            this.setState({
                showAddLab: false,
                labTitle: "",
                description: ""
            });
        }
        this.setState({ validated: true });
    };

    onChange = e => this.setState({[e.target.name]: e.target.value});

    render() {
        return (
            <div>
                <Button variant="info" onClick={this.setShowAddLab}>
                    Add Lab
                </Button>

                <Modal show={this.state.showAddLab} onHide={this.setShowAddLab}>
                    <Modal.Header>
                        <Modal.Title centered>Add a Lab</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form
                            noValidate
                            validated={this.state.validated}
                        >
                            <Form.Label>Lab Name</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    required
                                    name="labTitle"
                                    value={this.state.courseName}
                                    onChange={this.onChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter title for the lab.
                                </Form.Control.Feedback>
                            </InputGroup>
                            <Form.Label>Description</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    required
                                    name="description"
                                    value={this.state.term}
                                    onChange={this.onChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter title for the lab.
                                </Form.Control.Feedback>
                            </InputGroup>
                            <Button variant="info" onClick={this.addNewLab}>Add</Button>
                            <Button variant="info" onClick={this.setShowAddLab}>Cancel</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default Addlab;
