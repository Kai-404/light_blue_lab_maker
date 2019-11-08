import React, { Component } from "react";
import { Nav, Navbar, ButtonGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { withRouter } from "react-router";
import Logo from "../Image/tran_logo.png";
import UserIcon from "../Image/user.png";
import LogoutIcon from "../Image/logout.jpg";
import "./Header.css";

class Header extends Component {
  showBar = () => {
    this.props.bar(false);
  };

  render() {
    let UserName = "User Name";

    return (
      <React.Fragment>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand>
            <img src={Logo} className="LogoIcon" alt="LOGO" />
            Lab Maker
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <LinkContainer to="/announcements">
                <Nav.Link>Announcements</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/labspage">
                <Nav.Link>Lab</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/discussion">
                <Nav.Link>Discussion</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/grade">
                <Nav.Link>Grade</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
          <ButtonGroup>
            <LinkContainer to="/home">
              <button className="IconButton" onClick={this.showBar}>
                <img src={UserIcon} className="UserIcon" alt="User" />
                {UserName}
              </button>
            </LinkContainer>
            <LinkContainer to="/">
              <button className="IconButton" onClick={this.showBar}>
                <img src={LogoutIcon} className="UserIcon" alt="Logout" />
              </button>
            </LinkContainer>
          </ButtonGroup>
        </Navbar>
        <br />
      </React.Fragment>
    );
  }
}

export default withRouter(Header);
