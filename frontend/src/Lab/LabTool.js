import React, { Component } from "react";
import axios from "axios";
import Konva from "konva";
import { Image, Layer } from "react-konva";
import Portal from "react-portal";
import Tooltip from "./Tooltip";
import {
  Button,
  ButtonToolbar,
  OverlayTrigger,
  Popover
} from "react-bootstrap";
/**
 * Props:
 *  Img //image of the tool
 *  xVal // x-cor of the tool
 *  yVal //y-cor of the tool
 *  id //name of the tool
 *  stageNum //current stage num
 *  setCurrentStage() //set current stage
 *  stageTool // all the tool in this current stage
 *  setTool() //set tool
 *  setShowModal() //setShowModal
 */
const stageW = window.innerWidth - window.innerWidth * 0.3;
const stageH = window.innerHeight - 200;

class LabTool extends Component {
  state = {
    image: null,
    showTooltip: false,
    toolx: 0,
    tooly: 0
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

  haveIntersection = (r1, r2) => {
    let width = (stageW * 0.1) / 2;
    let height = (stageH * 0.2) / 2;

    return !(
      r2.x > r1.x + width ||
      r2.x + width < r1.x ||
      r2.y > r1.y + height ||
      r2.y + height < r1.y
    );
  };

  //dragging a tool animation, show the boundingBox
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

  //while dragging the tool, detection collision and perform interaction if any
  checkInteraction = (e, stageNum, id) => {
    const targetTool = e.target.getClientRect();

    this.props.stageTool.forEach(tool => {
      let id2 = tool.id;
      if (id2 != e.target.attrs.name) {
        if (this.haveIntersection(tool, targetTool)) {
          console.log("Hit! rotate the tool to the top of another");
          //animation, goes to the top of interacted tool and rotate 40 degree
          e.target.setAttrs({
            x: tool.x,
            y: tool.y - stageH * 0.2,
            rotation: 45
          });
          let data = JSON.stringify({
            stageNum,
            id,
            id2
          });
          //params: stage#, id1(dragging tool), id2(being hitted tool)
          axios
            .post("http://localhost:8080/checkInteraction", data, {
              headers: { "Content-Type": "application/json;charset=UTF-8" },
              params: {
                stageNum,
                id,
                id2
              }
            })
            .then(res => {
              //rotate the tool to the top of another
              if (res.status == 200) {
                console.log(res.data);
                e.target.setAttrs({ rotation: 45 });
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    });
  };

  //drag tool end animation, boundingBox disappears
  handleDragEnd = e => {
    let stageNum = this.props.stageNum;
    let id = e.target.attrs.name;

    this.checkInteraction(e, stageNum, id);

    this.props.stageTool.map(tool => {
      // e.target.attrs.name is the id of img
      if (tool.id === id) {
        tool.x = e.target.attrs.x;
        tool.y = e.target.attrs.y;
        this.setState({ currentTool: tool });
      }
    });
    e.target.to({
      rotation: 0,
      duration: 4,
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

  handleOptionSelected = option => {
    console.log(option);
    this.setState({ selectedContextMenu: null });
  };

  //left click show property read only form
  handleContextMenu = e => {
    e.evt.preventDefault(true);
    const mousePosition = e.target.getStage().getPointerPosition();
    console.log("Tool: ", e.target.attrs);
    console.log("mouse: ", mousePosition);

    this.setState({
      showTooltip: true,
      toolx: e.target.attrs.x,
      tooly: e.target.attrs.y
    });

    console.log(this.state.toolx, this.state.tooly);
  };

  //right click show property form
  handleClickTool = e => {
    this.setState({ showTooltip: false });
    if (e.evt.button === 0) {
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
    }
  };

  render() {
    return (
      <>
        <Image
          x={this.props.x}
          y={this.props.y}
          width={stageW * 0.1}
          height={stageH * 0.2}
          name={this.props.id}
          image={this.state.image}
          ref={node => {
            this.imageNode = node;
          }}
          draggable
          onClick={this.handleClickTool}
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd}
          onContextMenu={this.handleContextMenu}
        />
        <Portal isOpened={this.state.showTooltip}>
          <p
            style={{
              position: "absolute",
              top: this.state.tooly,
              left: this.state.toolx
            }}
          >
            FK U
          </p>
        </Portal>
      </>
    );
  }
}

export default LabTool;
