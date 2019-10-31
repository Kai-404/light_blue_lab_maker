import React, { Component } from "react";
import Popup from "reactjs-popup";
import "../App.css";

class Addtool extends Component {
  render() {
    return (
      <Popup
        trigger={<button className="addtoolButton">Add Tool</button>}
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
