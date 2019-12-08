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
                id: sessionStorage.getItem("userID"),
                username: sessionStorage.getItem("username"),
                userType: sessionStorage.getItem("userType")
            }
        }).then(res => this.setState({courseList: res.data}))
    };

    componentDidMount() {
        this.getCourseList();
    };

    showBar = id => {
        sessionStorage.setItem("underCourse", "true");
        sessionStorage.setItem("currentCourse", id);
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
                    sessionStorage.getItem("userType")==='Professor'?
                        <AddCourse getCourseList={this.getCourseList}/>
                        :
                        <EnrollCourse getCourseList={this.getCourseList}/>
                }
            </ListGroup>
        );
    }
}

export default withRouter(HomePage);
