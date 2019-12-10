import React, {Component} from "react";
import {Button, OverlayTrigger} from "react-bootstrap";
import Konva from "konva";

class Tooltip extends Component {
    /**
     * When hover over a tool, will show all the tool information
     * tool : the tool user want to change
     */

    render() {
        return (
            <OverlayTrigger
                placement="right"
                overlay={
                    <Tooltip>
                        Tooltip on <strong>right</strong>.
                    </Tooltip>
                }
            >
                {this.props.children}
            </OverlayTrigger>
        );
    }
}

export default Tooltip;
