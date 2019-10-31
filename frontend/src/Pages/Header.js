import React, { Component } from "react";
import { Nav, Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import Logo from "../Image/tran_logo.png";
import Page from "../editor/page.png";
import UserIcon from "../Image/profileicon.png";
import LogoutIcon from "../Image/logout.png";
import "./Header.css";
import "../App.css";

class Header extends Component {
  /*
<Col>
            <img src={Logo} className="LogoIcon"></img>
            <Nav defaultActiveKey="/home" className="flex-column">
              <Nav.Item>
                <Link to="/assignment">Assignment </Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/labspage">Lab</Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/discussion">Discussion</Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/Grade">Grade</Link>
              </Nav.Item>
            </Nav>
          </Col>
  */
  backToHome = () => {
    this.props.history.push("/home");
  };

  backToLogin = () => {
    this.props.history.push("/login");
  };

  render() {
    return (
      <Container>
        <div align="right">
          <ButtonGroup >
            <button className="IconButton" onClick={this.backToHome}> <img src={UserIcon} className="UserIcon" /> User Name </button>
            <button className="IconButton" onClick={this.backToLogin}><img src={LogoutIcon} className="UserIcon" /></button>
          </ButtonGroup>
        </div>

        <Row>
          <Col>
            <Nav justify variant="tabs" defaultActiveKey="/home">
              <Nav.Item>
                <img src={Page} />
                <Link to="/announcements" className="link">
                  Announcements
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/labspage" className="link">
                  Lab
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/discussion" className="link">
                  Discussion
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/grade" className="link">
                  Grade
                </Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(Header);
