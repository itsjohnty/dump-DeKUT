import React, { Component } from "react";
import { getAuth, signOut } from "firebase/auth";
import logo from "../../imgs/Logo3.png";
import Complaint from "./Complaint";
import AdminPage from "./AdminPage";
import "./Home.css";
import RaiseComplaint from "./RaiseComplaint";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showComplaint: false,
      addItemPageLoaded: false,
    };
  }

  handleLogout() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        alert("Sign-out successful.");
      })
      .catch((error) => {
        alert(error.message);
      });
    this.props.authHandler();
  }

  handleComplaintsClick = () => {
    this.setState((prevState) => ({
      showComplaint: !prevState.showComplaint,
    }));
  };

  async componentDidMount() {
    // Simulating a delay of 2 seconds before setting addItemPageLoaded to true
    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.setState({ addItemPageLoaded: true });
  }

  render() {
    const { name, email, admin } = this.props;
    const { showComplaint, addItemPageLoaded } = this.state;

    return (
      <React.Fragment>
        <ul>
          <span>
            <img className="logoimg" src={logo} alt="logo" />
          </span>
          <span className="spantext">
            <a
              className="active"
              href="/"
              onClick={this.handleLogout.bind(this)}
            >
              Sign Out
            </a>
          </span>
          {admin && (
            <span className="spantext">
              <a
                className="active"
                href="/admin"
                target="_blank"
                rel="noopener noreferrer"
              >
                Admin
              </a>
            </span>
          )}
        </ul>

        {admin ? (
          <div className="App">
            <div className="appAside1">
              <AdminPage />
            </div>
          </div>
        ) : (
          <ul>
            <button
              className={`complaintsButton ${showComplaint ? "active" : ""}`}
              onClick={this.handleComplaintsClick}
            >
              {showComplaint ? "Return to Home" : "View Your Complaints"}
            </button>
          </ul>
        )}

        <div className="App">
          {!admin && (
            <div className="appAside1">
              {showComplaint ? (
                <Complaint email={email} />
              ) : (
                <>
                  <span>Welcome, {name}</span>
                  <h2 className="heading">Clean Clan</h2>
                  <h3 className="subheading">
                    Welcome to Clean Clan!
                    <br></br>"Revolutionizing Waste Management for
                    Cleaner Communities"
                  </h3>
                  <p>
                  Our website is built with a clear mission: to provide a convenient platform for users to report garbage accumulation and alert nearby garbage collection agencies for prompt action. We believe that by harnessing the power of technology and community involvement, we can make a significant impact on waste management practices. Clean Clan aims to empower individuals and foster community engagement in creating cleaner and healthier living environments.
                  </p>
                  <p>
                  We understand that waste management is a collective responsibility, and that's why Clean Clan believes in the power of atomic change that is brought about by the individuals of a community. 
                  </p>
                  <p>
                  Join Clean Clan today to be a part of the movement towards cleaner communities and make a difference, <b>ONE REPORT AT A TIME.</b>
                  </p>
                </>
              )}
            </div>
          )}

          {!admin && (
            <div className="appForm1">
              {addItemPageLoaded && !showComplaint && (
                <RaiseComplaint name={name} email={email} />
              )}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
