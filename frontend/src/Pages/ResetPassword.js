import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import axios from "axios";
import "../App.css";

class ResetPassword extends Component {
    /* States */
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            password2 : ""
        };
    }

    routeLogin = () => {
        this.props.history.push("/login");
    };

    onChange = e => this.setState({ [e.target.name]: e.target.value });

    onSubmit = e => {
        e.preventDefault();
        const { password, password2} = this.state;

        if (password === "" || password2 === "") {
            this.setState({errmsg : "fill in all fields"});
        } else if (password !== password2) {
            this.setState({errmsg: "password don't match"});
        } else if (password.length < 8) {
            this.setState({
                errmsg: "password needs to be at least 8 characters long"
            });
        } else {
            axios
                .post("http://localhost:8080/reset-password",{
                    headers: { "Content-Type": "application/json;charset=UTF-8" },
                    params: {
                        password: password
                    }
                })
                .then(res => {
                    this.routeLogin();
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
                    <br />
                    New Password:
                    <input
                        className="input"
                        value={this.state.password}
                        type="password"
                        name="password"
                        onChange={this.onChange}
                    />
                    <br />
                    <br />
                    Reenter password:
                    <input
                        className="input"
                        value={this.state.password2}
                        type="password"
                        name="password"
                        onChange={this.onChange}
                    />
                    <br />
                    <br />
                    <button
                        type="submit"
                        className="submitButton"
                        onClick={this.onSubmit}
                    >
                        Submit
                    </button>
                    {"  "}
                </form>
            </div>
        )
    }


}

export default withRouter(ResetPassword);
