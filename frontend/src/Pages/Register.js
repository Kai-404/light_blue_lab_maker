import React, { Component } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
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
    firstName: "",
    lastName: "",
    errmsg: ""
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });
  handleChange = e => {
    this.setState({ userType: e.target.value });
  };
  /* adds user info to database */
  register = (username, email, password, userType, firstName, lastName) => {
    let data = JSON.stringify({
      username,
      email,
      password,
      userType,
      firstName,
      lastName
    });
    console.log(data);
    axios
      .post("/register", data, {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: {
          username: username,
          email: email,
          password: password,
          userType: userType,
          firstName: firstName,
          lastName: lastName
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
            userType: "",
            firstName: "",
            lastName: ""
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
    const { username, email, password, password2, userType, firstName, lastName } = this.state;
    if (
      username === "" ||
      email == "" ||
      password === "" ||
      password2 === "" ||
      userType === "" ||
        firstName === "" ||
        lastName === ""
    ) {
      this.setState({ errmsg: "fill in all fields" });
    } else if (/\S+@\S+\.\S+/.test(email) == false) {
      this.setState({ errmsg: "invalid email" });
    } else if (password !== password2) {
      this.setState({
        errmsg: "Fail to create new Account, password don't match"
      });
    } else if (password.length < 8) {
      this.setState({
        errmsg: "password needs to be at least 8 characters long"
      });
    } else {
      this.register(username, email, password, userType, firstName, lastName);
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
              <option selected>Choose...</option>
              <option value="Student">Student</option>
              <option value="Professor">Professor</option>
            </select>
          </Form.Group>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                  type="firstName"
                  name="firstName"
                  placeholder="Enter first name"
                  onChange={this.onChange}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                  type="lastName"
                  name="lastName"
                  placeholder="Enter last name"
                  onChange={this.onChange}
              />
            </Form.Group>
          </Form.Row>
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
