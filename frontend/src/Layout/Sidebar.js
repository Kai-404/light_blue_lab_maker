import React, { Component } from "react";
import { withRouter } from "react-router";
import { BrowserRouter as Router, Route } from "react-router-dom";
import PageIcon from "../editor/pageicon.png";
import "../App.css";
import { LinkContainer } from "react-router-bootstrap";
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText
} from "@trendmicro/react-sidenav";
import "./Sidebar.css";

class Sidebar extends Component {
  showBar = () => {
    this.props.bar(false);
  };

  /*

        <SideNav>
        <SideNav.Toggle />
        <SideNav.Nav defaultSelected="home">
          <NavItem eventKey="home">
            <NavIcon>
              <img src={PageIcon} className="icon" />
            </NavIcon>
            <NavText>Announcements</NavText>
          </NavItem>
          <NavItem eventKey="charts">
            <NavIcon>
              <img src={PageIcon} className="icon" />
            </NavIcon>
            <NavText>Lab</NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
  */
  render() {
    return (
      <Router>
        <Route
          render={({ location, history }) => (
            <React.Fragment>
              <SideNav
                onSelect={selected => {
                  const to = "/" + selected;
                  if (location.pathname !== to) {
                    history.push(to);
                  }
                }}
              >
                <SideNav.Toggle />
                <SideNav.Nav defaultSelected="home">
                  <NavItem eventKey="labspage">
                    <NavIcon>
                      <img src={PageIcon} className="icon" />
                    </NavIcon>
                    <NavText>Lab</NavText>
                  </NavItem>
                  <NavItem eventKey="devices">
                    <NavIcon>
                      <i
                        className="fa fa-fw fa-device"
                        style={{ fontSize: "1.75em" }}
                      />
                    </NavIcon>
                    <NavText>Devices</NavText>
                  </NavItem>
                </SideNav.Nav>
              </SideNav>
            </React.Fragment>
          )}
        />
      </Router>
    );
  }
}

export default withRouter(Sidebar);
