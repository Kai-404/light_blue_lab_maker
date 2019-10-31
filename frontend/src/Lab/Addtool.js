import React, { Component } from "react";
import Popup from "reactjs-popup";
import "../App.css";

class Addtool extends Component {
    render() {
        return (

            <Popup trigger={<button className="addtoolButton">Add Tool</button>} position="center">
                {close => (
                    <div>
                        Will be a list of tools to select
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



