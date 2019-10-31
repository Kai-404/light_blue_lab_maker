import React, { Component } from "react";
import { Nav, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "../Image/tran_logo.png";
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
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <Nav justify variant="tabs" defaultActiveKey="/home">
              <Nav.Item>
                <Link to="/announcements" className="link">
                  Announcements{" "}
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
                <Link to="/Grade" className="link">
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

export default Header;
