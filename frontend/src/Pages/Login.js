import React, {Component} from "react";
import {Link} from "react-router-dom";
import {withRouter} from "react-router";
import axios from "axios";
import "../App.css";
import {Button, Modal} from "react-bootstrap";

class Login extends Component {
    /* States */
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errmsg: "",
            showResetPassword: false,
            resetPasswordErrMsg: "",
            resetPasswordEmail: ""
        };
    }

    /* Change page to registration page */
    routeRegister = () => {
        this.props.history.push("/register");
    };

    /* Change page to homepage */
    routeHome = () => {
        this.props.history.push("/home");
    };

    routeResetPassword = () => {
        this.props.history.push("/resetpassword");
    };

    componentDidMount() {
        if (sessionStorage.getItem("loggedin") != null) {
            this.routeHome();
        }
    };

    onChange = e => this.setState({[e.target.name]: e.target.value});

  /* When login button is clicked, retrieve user info from database */
  onSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;
    if (email === "" || password === "") {
      this.setState({ errmsg: "fill in all blanks" });
    } else {
      axios
        .get("/login", {
          headers: { "Content-Type": "application/json;charset=UTF-8" },
          params: { email: email, password: password }
        })
        .then(res => {
          if (res.data != "") {
            if (!res.data.active) {
              this.setState({ errmsg: "Please verify your email"});
            } else {
              sessionStorage.setItem("userFirstName", res.data.firstName);
              sessionStorage.setItem("userLastName", res.data.lastName);
              sessionStorage.setItem("username", res.data.username);
              sessionStorage.setItem("userType", res.data.userType);
              sessionStorage.setItem("userID", res.data.id);
              sessionStorage.setItem("loggedin", "true");
              this.setState({
                email: "",
                password: "",
                errmsg: ""
              });
              this.routeHome();
            }
          } else {
            this.setState({ errmsg: "Invalid username/email or password" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

    openResetPassword = () => {
        this.setState({showResetPassword: true})
    };

    closeResetPassword = () => {
        this.setState({
            showResetPassword: false,
            resetPasswordEmail: "",
            resetPasswordErrMsg: ""
        })
    };

    resetPassword = () => {
        if (this.state.resetPasswordEmail === "") {
            this.setState({resetPasswordErrMsg: "Please enter an email!"})
        } else {
            axios
                .get("/reset", {
                    headers: {"Content-Type": "application/json;charset=UTF-8"},
                    params: {email: this.state.resetPasswordEmail}
                })
                .then(res => {
                    if (res.data) {
                        alert("The email has been sent");
                        this.closeResetPassword();
                    } else {
                        alert("There is no account that has this email address");
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };

    render() {
        return (
            <div>
                <p className="errmsg">{this.state.errmsg}</p>
                <form className="form" onSubmit={this.onSubmit}>
                    <p className="header">Login</p>
                    Username or Email:
                    <input
                        className="input"
                        value={this.state.email}
                        type="text"
                        name="email"
                        onChange={this.onChange}
                    />
                    <br/>
                    <br/>
                    Password:
                    <input
                        className="input"
                        value={this.state.password}
                        type="password"
                        name="password"
                        onChange={this.onChange}
                    />
                    <br/>
                    <br/>
                    <button type="submit" className="submitButton">
                        Login
                    </button>
                    {"  "}
                    <button
                        type="button"
                        className="submitButton"
                        onClick={this.routeRegister}
                    >
                        Register
                    </button>
                    {"  "}
                    <button
                        type="button"
                        className="submitButton"
                        onClick={this.openResetPassword}
                    >
                        Reset Password
                    </button>
                </form>
                <Modal show={this.state.showResetPassword} onHide={this.closeResetPassword}>
                    <Modal.Header>
                        <Modal.Title>Reset Password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <p className="errmsg">{this.state.resetPasswordErrMsg}</p>
                            Email
                            <br/>
                            <input
                                className="input"
                                name="resetPasswordEmail"
                                value={this.state.resetPasswordEmail}
                                onChange={this.onChange}
                            >
                            </input>

                            <br/>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.resetPassword}>Send Reset Email</Button>
                        <Button onClick={this.closeResetPassword}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default withRouter(Login);
