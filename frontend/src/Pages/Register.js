import React, {Component} from "react";
import {Button, Col, Form} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import PropTypes from "prop-types";
import {withRouter} from "react-router";
import axios from "axios";
import "../App.css";
import Login from "./Login";

class Register extends Component {
    /* States */
    state = {
        username: "",
        email: "",
        password: "",
        password2: "",
        userType: "",
        errmsg: ""
    };

    onChange = e => this.setState({[e.target.name]: e.target.value});
    handleChange = e => {
        this.setState({userType: e.target.value});
    };
    /* adds user info to database */
    register = (username, email, password, userType) => {
        let data = JSON.stringify({
            username,
            email,
            password,
            userType
        });
        console.log(data);
        axios
            .post("http://localhost:8080/register", data, {
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                params: {
                    username: username,
                    email: email,
                    password: password,
                    userType: userType
                }
            })
            .then(res => {
                if (res.data === 0) {
                    this.setState({
                        errmsg: "Fail to create new Account, invalid email"
                    });
                } else if (res.data === 1) {
                    this.setState({
                        errmsg: "Fail to create new Account, email already exists"
                    });
                } else if (res.data === 2)
                    this.setState({
                        errmsg: "Fail to create new Account, username already exists"
                    });
                else {
                    this.setState({
                        username: "",
                        email: "",
                        password: "",
                        password2: "",
                        userType: ""
                    });
                    this.props.history.push("/");
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    /* Does error checking, if everything is ok call register function */
    onSubmit = e => {
        e.preventDefault();
        const {username, email, password, password2, userType} = this.state;
        if (
            username === "" ||
            email === "" ||
            password === "" ||
            password2 === "" ||
            userType === ""
        ) {
            this.setState({errmsg: "fill in all fields"});
        } else if (/\S+@\S+\.\S+/.test(email) === false) {
            this.setState({errmsg: "invalid email"});
        } else if (password.length < 8) {
            this.setState({
                errmsg: "password needs to be at least 8 characters long"
            });
        } else if (password !== password2) {
            this.setState({
                errmsg: "Fail to create new Account, password don't match"
            });
        }
        else {
            this.register(username, email, password, userType);
        }
    };

    render() {
        return (
            <div>
                <Form className="form">
                    <p className="header">Register</p>
                    <p className="errmsg">{this.state.errmsg}</p>
                    <Form.Group controlId="formGridRole">
                        <Form.Label>Role</Form.Label>
                        <select
                            onChange={this.handleChange}
                            value={this.state.userType}
                            class="custom-select mr-sm-2"
                            id="inlineFormCustomSelect"
                        >
                            <option selected value="">Choose...</option>
                            <option value="Student">Student</option>
                            <option value="Professor">Professor</option>
                        </select>
                    </Form.Group>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridName">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="userName"
                                name="username"
                                placeholder="Enter username"
                                onChange={this.onChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                onChange={this.onChange}
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={this.onChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Re-Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password2"
                                placeholder="Password"
                                onChange={this.onChange}
                            />
                        </Form.Group>
                    </Form.Row>
                    <button
                        type="submit"
                        className="submitButton"
                        onClick={this.onSubmit}
                    >
                        Submit
                    </button>
                    {"  "}
                    <LinkContainer to="/">
                        <button className="submitButton" type="button">
                            Cancel
                        </button>
                    </LinkContainer>
                </Form>
            </div>
        );
    }
}

export default withRouter(Register);
