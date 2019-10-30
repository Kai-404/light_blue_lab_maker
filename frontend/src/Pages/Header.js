import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logo from "../Image/tran_logo.png";
import "./Header.css";

import "../App.css";

class Header extends Component {
  render() {
    return (
      <header>
        <img src={Logo} className="Header"></img>
        <br></br>
        <div className="pageHeader"></div>
      </header>
    );
  }
}

export default Header;
