import React, { Component } from "react";
import { withRouter } from "react-router";
import { LinkContainer } from "react-router-bootstrap";
import {
  Card,
  CardColumns,
  Button,
  ButtonGroup,
  Form,
  ProgressBar,
  Modal
} from "react-bootstrap";
import Addlab from "../Lab/Addlab";
import Dolab from "../Lab/Dolab";
import axios from "axios";
import "./labsPage.css";

class LabsPage extends Component {
  state = {
    labList: [],
    currentLab: [],
    message: "",
    searchInput: "", //lab name for search
    labID: "test",
    studentProgress: {}
  };

  componentDidMount() {
    this.getLabsList();
    if (sessionStorage.getItem("userType") === "Student") {
      this.getStudentProgress();
    }
  }

  getLabsList = () => {
    axios
      .get("/getlablist", {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: {
          courseID: sessionStorage.getItem("currentCourse"),
          userType: sessionStorage.getItem("userType")
        }
      })
      .then(res => {
        this.setState({ labList: res.data });
        //console.log("lab list: ", this.state.labList);
      });
  };

  getStudentProgress() {
    axios
      .get("/getallstudentprogress", {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: {
          id: sessionStorage.getItem("userID")
        }
      })
      .then(res => {
        this.setState({ studentProgress: res.data });
      });
  }

  setDoLab(id) {
    axios
      .get("/setdolab", {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: {
          labID: id
        }
      })
      .then(res => {
        this.props.history.push("/dolab");
      });
  }

  deleteLab = id => {
    axios
      .get("/deletelab", {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: {
          labID: id,
          userID: sessionStorage.getItem("userID"),
          courseID: sessionStorage.getItem("currentCourse")
        }
      })
      .then(res => {
        if (res.data) {
          this.getLabsList();
          alert("lab is being delete");
        } else {
          alert("Cannot delete this lab");
        }
      })
      .catch(err => {
        alert("Cannot delete this lab now, try again later");
      });
  };

  editLab = lab => {
    axios
      .get("/editlab", {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: { id: lab.id }
      })
      .then(res => {
        sessionStorage.setItem("currentLabTitle", lab.title);
        sessionStorage.setItem("currentLabDescription", lab.description);
        this.props.history.push("/makelab");
      })
      .catch(err => {
        alert("Cannot load the lab to edit, try again later");
      });
  };

  handleOnChange = e => {
    this.setState({ searchInput: e.target.value, message: "" });
    if (this.state.searchInput == "") this.getLabsList();
  };

  searchLab = e => {
    if (e.key === "Enter") {
      if (this.state.searchInput == "") {
        this.getLabsList();
      } else {
        axios
          .get("/searchlab", {
            headers: { "Content-Type": "application/json;charset=UTF-8" },
            params: {
              id: this.state.searchInput,
              courseID: sessionStorage.getItem("currentCourse")
            }
          })
          .then(res => {
            //console.log("status: ", res.status);
            if (res.status == 200) {
              this.setState({ labList: res.data, messgae: "" });
            } else {
              this.setState({ message: "No such lab", labList: [] });
            }
          })
          .catch(err => {
            this.setState({ message: "No such lab", labList: [] });
          });
      }
    }
  };

  render() {
    let labs = [];
    if (this.state.labList.length > 0) {
      labs.pop();
      this.state.labList.map(lab => {
        let buttonGroup = (
          <ButtonGroup>
            <Button variant="info" onClick={() => this.setDoLab(lab.id)}>
              Do
            </Button>
            <Button variant="info" onClick={() => this.editLab(lab)}>
              Edit
            </Button>
            <Button variant="info" onClick={() => this.deleteLab(lab.id)}>
              Delete
            </Button>
          </ButtonGroup>
        );
        if (lab.published) {
          buttonGroup = (
            <ButtonGroup>
              <Button variant="info" onClick={() => this.setDoLab(lab.id)}>
                Do
              </Button>
            </ButtonGroup>
          );
        }
        let progressBar = null;
        if (sessionStorage.getItem("userType") === "Student") {
          progressBar = (
            <ProgressBar
              now={Math.round(
                100 *
                  (this.state.studentProgress[lab.id] / lab.stageList.length)
              )}
              label={
                Math.round(
                  100 *
                    (this.state.studentProgress[lab.id] / lab.stageList.length)
                ) + "%"
              }
            />
          );
        }
        labs.push(
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>{lab.title}</Card.Title>
              <Card.Text>{lab.description}</Card.Text>
              {progressBar}
              {buttonGroup}
            </Card.Body>
          </Card>
        );
      });
    }
    return (
      <React.Fragment>
        <p className="errmsg">{this.state.message}</p>
        <Form.Control
          className="control"
          type="search"
          placeholder="Search by Lab Name"
          input={this.state.searchInput}
          onKeyPress={this.searchLab}
          onChange={this.handleOnChange}
        />
        <br />
        <>
          <CardColumns>{labs}</CardColumns>
        </>
        {sessionStorage.getItem("userType") === "Professor" ? (
          <Addlab his={this.props.history} />
        ) : null}
      </React.Fragment>
    );
  }
}

export default withRouter(LabsPage);
