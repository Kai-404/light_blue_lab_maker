import React, { Component } from "react";
import { withRouter } from "react-router";
import axios from "axios";
import { Button, Card, Col, Row } from "react-bootstrap";
import AddAnnouncement from "./AddAnnouncement";

class Announcements extends Component {
  state = {
    announList: [
      {
        title: "Demo announcement",
        context: "Hello World"
      }
    ]
  };

  getAnnounList = () => {
    axios
      .get("http://localhost:8080/getannounlist")
      .then(res => this.setState({ announList: res.data }));
  };

  render() {
    let Announcements;
    try {
      Announcements = this.state.announList.map(announ => (
        <React.Fragment>
          <Card>
            <Card.Body>
              <Card.Title as="h4" align="left">
                {announ.title}
              </Card.Title>
              <Card.Text align="left">{announ.context}</Card.Text>
            </Card.Body>
          </Card>
        </React.Fragment>
      ));
    } catch (error) {
      console.log(error);
      Announcements = (
        <React.Fragment>
          <Card>
            <Card.Body>
              <Card.Title as="h4" align="left">
                Announcement Title
              </Card.Title>
              <Card.Text align="left">Announcement context goes here</Card.Text>
            </Card.Body>
          </Card>
        </React.Fragment>
      );
    }

    return (
      <Card>
        <Card.Body>
          <Row>
            <Col>
              <Card.Title as="h1" align="left">
                Announcements
              </Card.Title>
            </Col>
            <Col>
              {
                sessionStorage.getItem("userType")==='Professor'?
                    <AddAnnouncement />
                    :
                    null
              }
            </Col>
          </Row>
          {Announcements}
        </Card.Body>
      </Card>
    );
  }
}

export default withRouter(Announcements);
