import React, {Component} from "react";
import axios from "axios";
import Konva from "konva";
import {Image, Layer, Rect, Text} from "react-konva";
import Portal from "react-portal";
import InteractionModal from "./InteractionModal";
import ToolContextMenu from "./ToolContextMenu";
import {Button, Form, Modal, Row, Col, ListGroup} from "react-bootstrap";

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
 *   setShowInterModal()
 */
const stageW = window.innerWidth - window.innerWidth * 0.3;
const stageH = window.innerHeight - 400;

class LabTool extends Component {
    state = {
        image: null,
        interactedTool: null,
        currentTool: null,
        targetTool: null,
        showPop: false,
        showTooltip: false,
        mousePosition: {x: null, y: null},
        hasInter: false,
        inter: {
            Description: "Some description",
            Name: "Name of interaction",
            Prams: {
                PramName: "",
                Value: ""
            }
        },
        sourceTool: null
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
        this.setState({targetTool: e.target.getClientRect()});
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
    let inter = false;
    let targetTool = e.target.getClientRect();
    let sourceTool;
    this.props.stageTool.forEach(tool => {
      let id2 = tool.id;
      if (id2 == e.target.attrs.name) {
        sourceTool = tool;
      }
    });
    this.props.stageTool.forEach(tool => {
      let id2 = tool.id;
      if (id2 != e.target.attrs.name) {
        if (this.haveIntersection(tool, targetTool)) {
          inter = true;
          let data = JSON.stringify({
            stageNum,
            id,
            id2
          });
          //params: stage#, id1(dragging tool), id2(being hitted tool)
          axios
            .post("/checkInteraction", data, {
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
                //animation, goes to the top of interacted tool
                this.props.setInteraction(res.data);

                this.setState({ interactedTool: tool });
                e.target.setAttrs({
                  x: this.state.interactedTool.x,
                  y: this.state.interactedTool.y - stageH * 0.175
                });
                //param: (sourceTool, destinationTool)
                if (res.data.Name == "Pour")
                  this.props.setShowInterModal(sourceTool, tool, e);
              }
            })
            .catch(err => {
              console.log("no interaction");
            });
        }
      }
    });
    return inter;
  };

  //drag tool end animation, boundingBox disappears
  handleDragEnd = e => {
    let stageNum = this.props.stageNum,
      id = e.target.attrs.name;
    let ctool;
    if (this.checkInteraction(e, stageNum, id)) {
      this.props.setCurrentStage(stageNum);
    } else {
      this.props.stageTool.map(tool => {
        // e.target.attrs.name is the id of img
        if (tool.id === id) {
          tool.x = e.target.attrs.x;
          tool.y = e.target.attrs.y;
          this.setState({ currentTool: tool });
        }
      });
      ctool = this.state.currentTool;
      let data = JSON.stringify({
        stageNum,
        id,
        ctool
      });

      axios
        .post("/updatetoolprop", data, {
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
    }

    e.target.to({
      duration: 4,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    });
  };

    //left click show property read only form
    handleContextMenu = e => {
        e.evt.preventDefault(true);
        const mousePosition = e.target.getStage().getPointerPosition();
        let id = e.target.attrs.name;
        let stageNum = this.props.stageNum;
        let data = JSON.stringify({
            stageNum,
            id
        });
        axios
            .post("/gettool", data, {
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                params: {
                    stageNum: stageNum,
                    ID: id
                }
            })
            .then(res => {
                this.setState({
                    currentTool: res.data,
                    showTooltip: true,
                    mousePosition: mousePosition
                });
            });
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
        .post("/gettool", data, {
          headers: { "Content-Type": "application/json;charset=UTF-8" },
          params: {
            stageNum: stageNum,
            ID: id
          }
        })
        .then(res => {
          console.log(res.data);
          this.props.setTool(res.data);
          if (this.props.setShowModal) {
            this.props.setShowModal();
          }
        });
    }
  };

    setShowInterModal = () => {
        this.setState({hasInter: !this.state.hasInter});
    };

    handleMove = pos => {
        if (pos.x < 0) pos.x = 0;
        if (pos.y < 0) pos.y = 0;
        if (pos.x > stageW*0.9) pos.x = stageW*0.9;
        if (pos.y > stageH*0.8) pos.y = stageH*0.8;
        return pos;
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
                    dragBoundFunc={pos => this.handleMove(pos)}
                    /*
                    fillLinearGradientStartPoint={{ x: 20, y: 0 }}
                    fillLinearGradientEndPoint={{ x: 20, y: this.props.y }}
                    fillLinearGradientColorStops={[
                      0,
                      "white",
                      0.45,
                      "white",
                      0.5,
                      "lightblue"
                    ]}
                    */
                />
                <Text
                    x={this.props.x + 20}
                    y={this.props.y - 15}
                    text={this.props.nickname}
                />
                <Portal isOpened={this.state.showTooltip}>
                    <ToolContextMenu
                        mousePosition={this.state.mousePosition}
                        tool={this.state.currentTool}
                    />
                </Portal>
            </>
        );
    }
}

export default LabTool;
