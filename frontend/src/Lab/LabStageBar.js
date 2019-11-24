import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";

class LabStageBar extends Component {
  render() {
    let Stages = () => {
      let list = [];
      for (let i = 0; i < this.props.totalStage; i++) {
        list.push(
          <ListGroup.Item
            action
            onClick={() => {
              this.props.setCurrentStage(i);
            }}
            active={i === this.props.currentStageNum}
          >
            {i}
          </ListGroup.Item>
        );
      }
      return list;
    };
    return <Stages />;
  }
}

export default LabStageBar;
