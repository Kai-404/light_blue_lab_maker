import React, { Component } from "react";
import Popup from "reactjs-popup";
import { Button } from "react-bootstrap";
import "../App.css";

class Addtool extends Component {
  render() {
    return (
      <Popup
        trigger={<Button className="addtoolButton">Add Tool</Button>}
        position="center"
      >
        {close => (
          <div>
            Will be a list of tools to select
            <br />
            <label>
              <input name="tool" type="checkbox" />
              Tool
            </label>
            <a className="close" onClick={close}>
              &times;
            </a>
          </div>
        )}
      </Popup>
    );
  }
}

export default Addtool;
