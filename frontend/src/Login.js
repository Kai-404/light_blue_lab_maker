import React from 'react';
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import axios from "axios";
import './App.css';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errmsg: ""
        };
    }

    routeRegister = () => {
        this.props.history.push("/register");
    };

    routeHome = () => {
        this.props.history.push("/");
    };

    onChange = e => this.setState({ [e.target.name]: e.target.value });
    onSubmit = e => {
        e.preventDefault();
        const { email, password } = this.state;
        if (email === "" || password === "") {
            this.setState({ errmsg: "fill in all blanks" })
        }
        else {
            axios.get("/login", {
                headers: { "Content-Type": "application/json;charset=UTF-8" },
                params: { email: email, password: password }
            })
                .then(res => {
                    if (res.data != "") {
                        this.props.login(res.data)
                        this.setState({
                            email: "",
                            password: "",
                            errmsg: "",
                        });
                        this.routeHome();
                    } else {
                        this.setState({ errmsg: "Invalid username/email or password" });
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

                    Username or Email:
                    <input
                        className="input"
                        value={this.state.email}
                        type="text"
                        name="email"
                        onChange={this.onChange}
                    />

                    <br />
                    <br />

                    Password:
                    <input
                        className="input"
                        value={this.state.password}
                        type="password"
                        name="password"
                        onChange={this.onChange}
                    />

                    <br />
                    <br />

                    <button type="submit" className="submitButton">
                        Login
                    </button>
                    {"  "}

                    <button
                        type="button"
                        className="submitButton"
                        onClick={this.routeRegister}
                    >
                        New Account
                    </button>
                    {"  "}

                    <button
                        type="button"
                        className="submitButton"
                        onClick={this.routeHome}
                    >
                        Cancel
                    </button>

                </form>

            </div>
        );
    }

}

export default withRouter(Login);
