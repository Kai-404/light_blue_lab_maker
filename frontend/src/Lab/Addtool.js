import React, { Component } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "../App.css";
import axios from "axios";

class Addtool extends Component {
  state = {
    tools: [{ Name: "Beaker", Display: false, Img: "tran_logo_sq.png" }],
    show: false
  };

  componentDidMount() {
    axios.get("/getalltools").then(res => {
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
    axios
      .post("/updatetoollist", {
        tool: this.state.tools
      })
      .then(res => {
        this.props.addLabTool(this.state.tools);
        this.setState({ tools: res.data });
      });
  };

  setShow = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    return (
      <React.Fragment>
        <Button className="toolButton" onClick={this.setShow}>
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
          <Modal.Body
            style={{
              "max-height": "calc(100vh - 310px)",
              "overflow-y": "auto"
            }}
          >
            <p>Select all the tools you want to use for this lab.</p>
            {this.state.tools.map((tool, key) => (
              <Form.Check
                key={key}
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
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Addtool;
