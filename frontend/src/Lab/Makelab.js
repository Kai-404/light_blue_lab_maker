import React, { Component } from "react";
import Popup from "reactjs-popup";
import { withRouter } from "react-router";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Beaker from "../Image/beaker.png";
import Burner from "../Image/burner.png";
import pH from "../Image/ph.png";
import {
  Nav,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  Card,
  CardDeck,
  ListGroup
} from "react-bootstrap";
import Addtool from "./Addtool";
import "../App.css";
import axios from "axios";

class Makelab extends Component {
  state = {
    lab: {
      stageList: []
    }
  };
  addStage() {
    axios.post("/addstage").then(res => {
      this.setState({ lab: res.data });
    });
  }

  back = () => {
    this.props.history.push("/labspage");
  };

  componentDidMount() {
      axios.get("/getlab")
          .then(res => {
              console.log(res.data);
              this.setState({stageList: res.data.stageList});
          });
  }

    render() {
    return (
      <React.Fragment>
        <ButtonGroup>
          <Button className="toolButton">
            <img src={Beaker} className="UserIcon" alt="Beaker" />
          </Button>
          <Button className="toolButton">
            <img src={Burner} className="UserIcon" alt="Burner" />
          </Button>
          <Button className="toolButton">
            <img src={pH} className="UserIcon" alt="pH paper" />
          </Button>
          <Dropdown className="toolButton" as={ButtonGroup}>
            <Dropdown.Toggle variant="Secondary">More</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Tool 1</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Addtool />
        </ButtonGroup>
        <br />
        <CardDeck>
          <Card className="col-md-8">
            <Card.Body>
              <Card.Title as="h1">Lab Name</Card.Title>
              <Card.Text>Professor will make lab here</Card.Text>
            </Card.Body>
          </Card>
          <Card border="secondary" className="col-md-2">
            <Card.Body>
              <Card.Title>Lab Stages</Card.Title>
              <ListGroup>

                {this.state.lab.stageList.map((stage, i) => (
                  <ListGroup.Item>{stage.stageNum}</ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <Button
                    onClick={() => this.addStage()}
                    className="addtoolButton"
                  >
                    New
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </CardDeck>
        <br />
        <ButtonGroup>
          <Button className="submitButton">Save</Button>
          <Button className="submitButton">Submit</Button>
          <Button className="submitButton" onClick={this.back}>
            Cancel
          </Button>
        </ButtonGroup>
      </React.Fragment>
    );
  }
}

export default withRouter(Makelab);
