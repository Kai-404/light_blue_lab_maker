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
            email: "",
            password: "",
            password2 : ""
        };
    }

    routeLogin = () => {
        this.props.history.push("/login");
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
                        onClick={this.routeLogin}
                    >
                        Submit
                    </button>
                    {"  "}
                    <button
                        type="button"
                        className="submitButton"
                        onClick={this.routeLogin}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        )
    }


}

export default withRouter(ResetPassword);
