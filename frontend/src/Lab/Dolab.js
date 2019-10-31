import React, { Component } from "react";
import { withRouter } from "react-router";
import { Card, CardDeck, Button, ProgressBar } from "react-bootstrap";
import "../App.css";

class Dolab extends Component {
  back = () => {
    this.props.history.push("/labspage");
  };
  render() {
    let now = 60;
    let progressInstance = <ProgressBar now={now} label={`${now}%`} />;
    /*<Card.Img variant="top" src="holder.js/100px160" />*/
    return (
      <React.Fragment>
        <br /> <br />
        <CardDeck>
          <Card className="col-md-8">
            <Card.Body>
              <Card.Title as="h1">Lab Name</Card.Title>
              <Card.Text>Student will do lab here</Card.Text>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </Card.Body>
          </Card>
          <Card border="secondary" className="col-md-2">
            <Card.Body>
              <Card.Title>Lab Progress</Card.Title>
              {progressInstance}
            </Card.Body>

            <Card.Footer>
              <small className="text-muted">Last updated 3 mins ago</small>
            </Card.Footer>
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

export default withRouter(Dolab);
