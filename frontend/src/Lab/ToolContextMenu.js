import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
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
            top: this.props.tool.y,
            left: this.props.tool.x
          }}
        >
          {this.props.tool.Prop.map((prop, key) => {
            return (
              <ListGroup.Item>
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
