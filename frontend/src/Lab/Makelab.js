import React, { Component } from "react";
import Popup from "reactjs-popup";
import { withRouter } from "react-router";
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
import "../App.css";

class Makelab extends Component {

  constructor(props) {
    super(props);
    this.state = { showPopup: false };
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
  /*
<Nav className="justify-content-end" activeKey="/home">
          <Nav.Item>
            <Nav.Link eventKey="link-0">Tool 0</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-1">Tool 1</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-2">Tool 2</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-3">Tool 3</Nav.Link>
          </Nav.Item>
          <Dropdown>
            <Dropdown.Toggle variant="Secondary">More Tools</Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Tool 4</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Tool 5</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Tool 6</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Button> Add Tool</Button>
        </Nav>
*/

  back = () => {
    this.props.history.push("/labspage");
  };
  render() {
    return (
      <React.Fragment>
        <br /> <br />
        <ButtonGroup>
          <Button className="toolButton">Tool 1</Button>
          <Button className="toolButton">Tool 2</Button>
          <Button className="toolButton">Tool 3</Button>
          <Button className="toolButton">Tool 4</Button>
          <Dropdown className="toolButton" as={ButtonGroup}>
            <Dropdown.Toggle variant="Secondary">More Tools</Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Tool 4</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Tool 5</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Tool 6</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </ButtonGroup>
        <Button className="addtoolButton" onClick={this.togglePopup.bind(this)}>Add Tool</Button>
        {this.state.showPopup ?
          <Popup
            text='Click "Close Button" to hide popup'
            closePopup={this.togglePopup.bind(this)}
          />
          : null
        }
        <br />
        <CardDeck>
          <Card className="col-md-8">
            <Card.Body>
              <Card.Title as="h1">Lab Name</Card.Title>
              <Card.Text>Professor will make lab here</Card.Text>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </Card.Body>
          </Card>
          <Card border="secondary" className="col-md-3">
            <Card.Body>
              <Card.Title>Lab Stages</Card.Title>
              <ListGroup>
                <ListGroup.Item>Stage 1</ListGroup.Item>
                <ListGroup.Item>Stage 2</ListGroup.Item>
                <ListGroup.Item>
                  <Button className="addtoolButton">Add Stage</Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </CardDeck>
        <br />
        <Button className="submitButton">Save</Button>
        <Button className="submitButton">Submit</Button>
        <Button className="submitButton" onClick={this.back}>
          Cancel
        </Button>
      </React.Fragment>
    );
  }
}

export default withRouter(Makelab);
