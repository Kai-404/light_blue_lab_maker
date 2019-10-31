import React, { Component } from "react";
import { Nav, Container, Row, Col } from "react-bootstrap";
import Logo from "../Image/tran_logo.png";
import "./Header.css";

import "../App.css";

class Header extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <img src={Logo} className="LogoIcon"></img>
            <Nav defaultActiveKey="/home" className="flex-column">
              <Nav.Item>
                <Nav.Link href="/assignment">Assignment</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/labs">Lab</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/discussion">Discussion</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/Grade">Grade</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col>
            <Nav justify variant="tabs" defaultActiveKey="/home">
              <Nav.Item>
                <Nav.Link href="/assignment">Assignment</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/labs">Lab</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/discussion">Discussion</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/Grade">Grade</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Header;
