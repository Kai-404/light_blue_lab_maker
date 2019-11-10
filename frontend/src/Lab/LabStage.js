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
        x: 2,
        y: 2
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
    let stageW = window.innerWidth - window.innerWidth * 0.3;
    let stageH = window.innerHeight - 200;
    let ToolImg = Img => {
      const [tool] = useImage(Object.values(Img)[0]);
      return (
        <Image
          width={100}
          height={100}
          x={stageW / 2}
          y={stageH / 2}
          image={tool}
          draggable
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd}
        />
      );
    };
    return (
      <Stage width={stageW} height={stageH} className="stage">
        <Layer>
          <ToolImg Img={Beaker} />
          <ToolImg Img={Beaker} />
        </Layer>
      </Stage>
    );
  }
}

export default LabStage;
