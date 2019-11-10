import React, { Component } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "../App.css";
import axios from "axios";

class Addtool extends Component {
  state = {
    tools: [],
    show: false
  };

  componentDidMount() {
    axios.get("http://localhost:8080/getalltools").then(res => {
      this.setState({ tools: res.data });
    });
  }

  //change the display of tools bar for the current lab
  onChange = e => {
    this.state.tools.map(tool => {
      if (tool.Name === e.target.id) {
        tool.Display = !tool.Display;
      }
    });
  };

  onSave = () => {
    this.setShow();
    this.props.addLabTool(this.state.tools);
    axios
      .post("http://localhost:8080/updatetoollist", {
        tool: JSON.stringify(this.state.tools)
      })
      .then(res => this.setState({ tools: res.data }));
  };

  setShow = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    return (
      <React.Fragment>
        <Button className="addtoolButton" onClick={this.setShow}>
          Add Tool
        </Button>

        <Modal
          show={this.state.show}
          onHide={this.setShow}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header>
            <Modal.Title id="example-custom-modal-styling-title">
              Tool List
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Select all the tools you want to use for this lab.</p>
            {this.state.tools.map(tool => (
              <Form.Check
                type="switch"
                id={tool.Name}
                label={tool.Name}
                defaultChecked={tool.Display}
                onClick={this.onChange}
              />
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.setShow} className="addtoolButton">
              Close
            </Button>
            <Button className="addtoolButton" onClick={this.onSave}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Addtool;
