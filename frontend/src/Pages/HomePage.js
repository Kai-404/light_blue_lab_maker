import React, {Component} from "react";
import {withRouter} from "react-router";
import {Card, ListGroup, Button} from "react-bootstrap";
import "../App.css";
import axios from "axios";
import AddCourse from "./AddCourse";
import EnrollCourse from "./EnrollCourse";

class HomePage extends Component {

    state = {
        courseList: []
    };

    getCourseList = () => {
        axios.get("http://localhost:8080/getcourselist", {
            headers: {"Content-Type": "application/json;charset=UTF-8"},
            params: {
                id: this.props.user.id,
                username: this.props.user.username,
                userType: this.props.user.userType
            }
        }).then(res => this.setState({courseList: res.data}))
    };

    componentDidMount() {
        this.getCourseList();
    };

    showBar = id => {
        this.props.underCourse(true);
        this.props.currentCourse(id);
        this.props.history.push("/announcements");
    };

    updatePage() {
        this.forceUpdate();
    }

    render() {
        return (
            <ListGroup>
                {this.state.courseList.map(course => (
                    <Card>
                        <Card.Header>{course.term}</Card.Header>
                        <Card.Body>
                            <Card.Title>{course.title}</Card.Title>
                            <Card.Text>{course.professor}</Card.Text>
                            <Button variant="primary" onClick={() => this.showBar(course.professor)}>
                                Go to the course
                            </Button>
                        </Card.Body>
                    </Card>
                ))}
                {
                    this.props.user.userType==='Professor'?
                        <AddCourse user={this.props.user} getCourseList={this.getCourseList}/>
                        :
                        <EnrollCourse user={this.props.user} courseList={this.state.courseList}/>
                }
            </ListGroup>
        );
    }
}

export default withRouter(HomePage);
