import React, { Component } from "react";
import { Nav, Navbar, ButtonGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { withRouter } from "react-router";
import Logo from "../Image/tran_logo.png";
import UserIcon from "../Image/user.png";
import RegisterIcon from "../Image/register.png";
import LogoutIcon from "../Image/logout.jpg";
import "./Header.css";

class Header extends Component {
  state = {
    under: false
  };

  showBar = () => {
    sessionStorage.setItem("underCourse", "false");
    this.setState({ under: false });
  };

  render() {
    let UserName = "User Name";
    if (sessionStorage.getItem("loggedin")) {
      UserName = sessionStorage.getItem("username");
    }
    let BarContent = e => {
      let res = <React.Fragment></React.Fragment>;
      if (e.under == "true") {
        res = (
          <React.Fragment>
            <Navbar.Text>
              {sessionStorage.getItem("currentCourseName")}{" "}
              {sessionStorage.getItem("currentCourseTerm")}
            </Navbar.Text>
            <Nav className="mr-auto">
              <LinkContainer to="/announcements">
                <Nav.Link>Announcements</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/labspage">
                <Nav.Link>Lab</Nav.Link>
              </LinkContainer>
              {sessionStorage.getItem("userType") === "Professor" ? (
                <LinkContainer to="/grade">
                  <Nav.Link>Grade</Nav.Link>
                </LinkContainer>
              ) : null}
            </Nav>
          </React.Fragment>
        );
      }
      return res;
    };

    let UserInfo = e => {
      let user = (
        <React.Fragment>
          <LinkContainer to="/">
            <button className="IconButton">
              <img src={UserIcon} className="UserIcon" alt="User" />
              Login
            </button>
          </LinkContainer>
          <LinkContainer to="/register">
            <button className="IconButton">
              <img src={RegisterIcon} className="UserIcon" alt="Re" />
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
                <img src={UserIcon} className="UserIcon" alt="User" />
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
                <img src={LogoutIcon} className="UserIcon" alt="Logout" />
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
          <LinkContainer to="/">
            <Navbar.Brand onClick={this.showBar}>
              <img src={Logo} className="LogoIcon" alt="LOGO" />
              Lab Maker
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <BarContent under={sessionStorage.getItem("underCourse")} />
          </Navbar.Collapse>
          <ButtonGroup>
            <UserInfo login={sessionStorage.getItem("loggedin")} />
          </ButtonGroup>
        </Navbar>
        <br />
      </React.Fragment>
    );
  }
}

export default withRouter(Header);
