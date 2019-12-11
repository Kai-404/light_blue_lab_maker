import React, {Component} from "react";
import {Nav, Navbar, ButtonGroup} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {withRouter} from "react-router";
import Logo from "../Image/tran_logo.png";
import UserIcon from "../Image/user.png";
import RegisterIcon from "../Image/register.png";
import LogoutIcon from "../Image/logout.jpg";
import "./Header.css";

class Header extends Component {
    showBar = () => {
        sessionStorage.setItem("underCourse", "false");
        this.setState({underCourse: false});
    };

    render() {
        let UserName = "User Name";
        if (sessionStorage.getItem("loggedin")) {
            UserName = sessionStorage.getItem("username");
        }
        let BarContent = e => {
            let res = <Nav className="mr-auto"></Nav>;
            if (e.under) {
                res = (
                    <Nav className="mr-auto">
                        <LinkContainer to="/announcements">
                            <Nav.Link>Announcements</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/labspage">
                            <Nav.Link>Lab</Nav.Link>
                        </LinkContainer>
                        {
                            sessionStorage.getItem("userType")==="Professor"?
                                <LinkContainer to="/grade">
                                    <Nav.Link>Grade</Nav.Link>
                                </LinkContainer>
                                :
                                null
                        }
                    </Nav>
                );
            }
            return res;
        };

        let UserInfo = e => {
            let user = (
                <React.Fragment>
                    <LinkContainer to="/">
                        <button className="IconButton">
                            <img src={UserIcon} className="UserIcon" alt="User"/>
                            Login
                        </button>
                    </LinkContainer>
                    <LinkContainer to="/register">
                        <button className="IconButton">
                            <img src={RegisterIcon} className="UserIcon" alt="Re"/>
                            Register
                        </button>
                    </LinkContainer>
                </React.Fragment>
            );
            if (e.login) {
                user = (
                    <React.Fragment>
                        <LinkContainer to="/home">
                            <button className="IconButton" onClick={this.showBar}>
                                <img src={UserIcon} className="UserIcon" alt="User"/>
                                {UserName}
                            </button>
                        </LinkContainer>
                        <LinkContainer to="/">
                            <button
                                className="IconButton"
                                onClick={() => {
                                    this.showBar();
                                    this.props.logout();
                                }}
                            >
                                <img src={LogoutIcon} className="UserIcon" alt="Logout"/>
                            </button>
                        </LinkContainer>
                    </React.Fragment>
                );
            }

            return user;
        };
        return (
            <React.Fragment>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand>
                        <img src={Logo} className="LogoIcon" alt="LOGO"/>
                        Lab Maker
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <BarContent under={sessionStorage.getItem("underCourse")}/>
                    </Navbar.Collapse>
                    {
                        sessionStorage.getItem("underCourse") ?
                            <Navbar.Text>{sessionStorage.getItem("currentCourseName")} {sessionStorage.getItem("currentCourseTerm")}</Navbar.Text>
                        : null
                    }
                    <ButtonGroup>
                        <UserInfo login={sessionStorage.getItem("loggedin")}/>
                    </ButtonGroup>
                </Navbar>
                <br/>
            </React.Fragment>
        );
    }
}

export default withRouter(Header);
