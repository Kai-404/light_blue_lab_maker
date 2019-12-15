import React, { Component } from "react";
import { Col, ListGroup, Form, Row } from "react-bootstrap";
import axios from "axios";

/**
 * tool : the tool u clicked on
 * mousePosition: where u clicked, place to show the context menu
 */
class ToolContextMenu extends Component {
  render() {
    return (
      <React.Fragment>
        <ListGroup
          style={{
            position: "absolute",
            top:
              this.props.mousePosition.y +
              (window.innerWidth - window.innerWidth * 0.3) * 0.075,
            left: this.props.mousePosition.x + (window.innerHeight - 200) * 0.4
          }}
        >
          {this.props.tool.Prop.map((prop, key) => {
            return (
              <ListGroup.Item style={{ backgroundColor: prop.Value }}>
                {prop.Name} : {prop.Value}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </React.Fragment>
    );
  }
}

export default ToolContextMenu;
