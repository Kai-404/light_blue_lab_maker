import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Star, Text, Image } from "react-konva";
import Beaker from "../Image/beaker.png";
import useImage from "use-image";
import "../App.css";

const ToolImg = Img => {
  const [image] = useImage(Object.values(Img)[0]);
  return <Image image={image} draggable />;
};

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
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1,
      shadowOffsetX: 5,
      shadowOffsetY: 5
    });
  };

  render() {
    let w = window.innerWidth - 500;
    let h = window.innerHeight - 200;
    return (
      <Stage width={w} height={h} className="stage">
        <Layer>
          <ToolImg Img={Beaker} />
        </Layer>
      </Stage>
    );
  }
}

export default LabStage;
