import React, { Component } from "react";
import axios from "axios";
import Konva from "konva";
import { Stage, Layer, Star, Text, Image } from "react-konva";
import useImage from "use-image";

/**
 * Props:
 *  Img //image of the tool
 *  xVal // x-cor of the tool
 *  yVal //y-cor of the tool
 *  id //name of the tool
 *  stageNum //current stage num
 *  setCurrentStage() //set current stage
 *  setTool() //set tool
 *  setShowModal() //setShowModal
 */
const stageW = window.innerWidth - window.innerWidth * 0.3;
const stageH = window.innerHeight - 200;

class LabTool extends Component {
  state = {
    image: null
  };
  componentDidMount() {
    this.loadImage();
  }
  componentDidUpdate(oldProps) {
    if (oldProps.src !== this.props.src) {
      this.loadImage();
    }
  }
  componentWillUnmount() {
    this.image.removeEventListener("load", this.handleLoad);
  }
  loadImage() {
    // save to "this" to remove "load" handler on unmount
    this.image = new window.Image();
    this.image.src = this.props.src;
    this.image.addEventListener("load", this.handleLoad);
  }
  handleLoad = () => {
    // after setState react-konva will update canvas and redraw the layer
    // because "image" property is changed
    this.setState({
      image: this.image
    });
    // if you keep same image object during source updates
    // you will have to update layer manually:
    // this.imageNode.getLayer().batchDraw();
  };

  /*
    //not working!!!!!!!!
    setShowTooltip = () => {
      this.setState({ showTooltip: !this.state.showTooltip });
    };
    timer = () => {
      this.setState({
        countForTooltip: this.state.countForTooltip - 1
      });
      console.log(this.intervalId);
      if (this.state.countForTooltip < 1) {
        clearInterval(this.intervalId);
      }
    };
    handleMouseOver = e => {
      this.intervalId = setInterval(this.timer, 1000);
    };
    handleMouseOut = () => {
      console.log("out!!!!");
      clearInterval(this.intervalId);
      this.setState({ countForTooltip: 3 });
    };
  */

  //draging a tool animation
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
  //drag tool end animation
  handleDragEnd = e => {
    let stageNum = this.props.stageNum;
    let id = e.target.attrs.name;
    this.props.stageTool.map(tool => {
      // e.target.attrs.name is the id of img
      if (tool.id === id) {
        tool.x = e.target.attrs.x;
        tool.y = e.target.attrs.y;
        this.setState({ currentTool: tool });
      }
    });
    e.target.to({
      duration: 1.0,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    });
    let ctool = this.state.currentTool;
    let data = JSON.stringify({
      stageNum,
      id,
      ctool
    });

    axios
      .post("http://localhost:8080/updatetoolprop", data, {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: {
          stageNum: stageNum,
          ID: id
        },
        toolProps: ctool
      })
      .then(res => {
        this.props.setCurrentStage(stageNum);
      });
  };

  handleClickTool = e => {
    let id = e.target.attrs.name;
    let stageNum = this.props.stageNum;
    let data = JSON.stringify({
      stageNum,
      id
    });
    axios
      .post("http://localhost:8080/gettool", data, {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: {
          stageNum: stageNum,
          ID: id
        }
      })
      .then(res => {
        console.log(res.data);
        this.props.setTool(res.data);
        this.props.setShowModal();
      });
  };

  render() {
    return (
      <Image
        x={this.props.x}
        y={this.props.y}
        width={stageW * 0.05}
        height={stageH * 0.1}
        name={this.props.id}
        image={this.state.image}
        ref={node => {
          this.imageNode = node;
        }}
        draggable
        onClick={this.handleClickTool}
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
      />
    );
  }
}

export default LabTool;
