import React, { Component } from "react";
import { HashRouter as Router, Route, NavLink } from "react-router-dom";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import accountlogo from "./final transp.png";
import "./App.css";
import logo from "./imgs/Logo3.png";
import Home from "./UI/Home/Home";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      userDetails: null,
    };

    this.isAuthenticatedHandler = this.isAuthenticatedHandler.bind(this);
  }

  isAuthenticatedHandler(userdetails) {
    console.log(userdetails);
    this.setState({
      isAuthenticated: !this.state.isAuthenticated,
      userDetails: userdetails,
    });
  }

  render() {
    if (this.state.isAuthenticated) {
      const userDetails = this.state.userDetails;
      const admin = userDetails ? userDetails[0].admin || false : false;
      console.log(admin) // Fetch the admin property, default to false if undefined

      return (
        <Home
          authHandler={this.isAuthenticatedHandler}
          name={userDetails[0].name}
          email={userDetails[0].email}
          admin={admin} // Pass the admin prop to Home
        />
      );
    }

    return (
      <Router>
        <div className="App">
          <div className="appAside">
            <img className="logo" src={logo} alt="this is logo" />
          </div>
          <div className="appForm">
            <div className="pageSwitcher">
              <NavLink
                to="/sign-in"
                activeClassName="pageSwitcherItem-active"
                className="pageSwitcherItem"
              >
                Login
              </NavLink>
              <NavLink
                exact
                to="/sign-up"
                activeClassName="pageSwitcherItem-active"
                className="pageSwitcherItem"
              >
                Sign Up
              </NavLink>
            </div>
            <img
              className="accountlogo"
              src={accountlogo}
              alt="this is a logo"
            />

            <Route
              exact
              path="/sign-up"
              render={() => (
                <SignUpForm authHandler={this.isAuthenticatedHandler} />
              )}
            />
            <Route
              path="/sign-in"
              render={() => (
                <SignInForm authHandler={this.isAuthenticatedHandler} />
              )}
            />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
