import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Star, Text, Image } from "react-konva";
import Beaker from "../Image/beakerTool.png";
import useImage from "use-image";
import "../App.css";

class LabStage extends Component {
  handleDragStart = e => {
    e.target.setAttrs({
      shadowOffset: {
        x: 15,
        y: 15
      },
      scaleX: 1.1,
      scaleY: 1.1
    });
  };
  handleDragEnd = e => {
    e.target.to({
      duration: 1.0,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    });
  };

  render() {
    let ToolImg = Img => {
      const [tool] = useImage(Object.values(Img)[0]);
      return (
        <Image
          width={100}
          height={100}
          image={tool}
          draggable
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd}
        />
      );
    };
    return (
      <Stage
        width={window.innerWidth - window.innerWidth * 0.3}
        height={window.innerHeight - 200}
        className="stage"
      >
        <Layer>
          <ToolImg Img={Beaker} />
        </Layer>
      </Stage>
    );
  }
}

export default LabStage;
