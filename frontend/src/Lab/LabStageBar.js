import React, {Component} from "react";
import {ListGroup} from "react-bootstrap";
import axios from "axios";
import {sortableContainer, sortableElement, sortableHandle} from 'react-sortable-hoc';

class LabStageBar extends Component {

    onSortEnd = ({oldIndex, newIndex}) => {
        axios
            .post(
                '/swapstages',
                null,
                {
                    headers: {"Content-Type": "application/json;charset=UTF-8"},
                    params: {
                        oldIndex: oldIndex,
                        newIndex: newIndex
                    }
                }
            )
            .then(res => {
                this.props.setCurrentStage(newIndex);
            })
    };

    render() {

        const DragHandle = sortableHandle(() => <span class='sortablehandler'>:::</span>);

        let SortableItem = sortableElement(({value}) =>
            <ListGroup.Item
                action
                active={value === this.props.currentStageNum}
                onClick={() => {
                    this.props.setCurrentStage(value);
                }}
            >
                <DragHandle/>
                {value}
            </ListGroup.Item>);

        let SortableContainer = sortableContainer(({children}) => {
            return <ListGroup id="stageGroup">{children}</ListGroup>;
        });

        let Stages = () => {
            let list = [];
            for (let i = 0; i < this.props.totalStage; i++) {
                list.push(
                    <SortableItem
                        key={'item-' + i}
                        index={i}
                        value={i}
                    >
                    </SortableItem>
                );
            }
            return list;
        };

        return (
            <React.Fragment>
                <SortableContainer onSortEnd={this.onSortEnd}>
                    <Stages/>
                </SortableContainer>
            </React.Fragment>
        )
    }
}

export default LabStageBar;
