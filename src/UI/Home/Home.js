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
        <header className="header">
          <div className="logo-container">
            <img className="logoimg" src={logo} alt="logo" />
            <span className="welcome-text">Welcome, {name}</span>
          </div>
          <nav className="nav">
            <button
              className={`nav-button ${showComplaint ? "active" : ""}`}
              onClick={this.handleComplaintsClick}
            >
              {showComplaint ? "Home" : "Complaints"}
            </button>
            {admin && (
              <a
                className="nav-link"
                href="/admin"
                target="_blank"
                rel="noopener noreferrer"
              >
                Admin
              </a>
            )}
            <button
              className="nav-button"
              onClick={this.handleLogout.bind(this)}
            >
              Sign Out
            </button>
          </nav>
        </header>

        <main className="main-content">
          {admin ? (
            <div className="admin-page">
              <AdminPage />
            </div>
          ) : (
            <div className="user-content">
              <div className="content">
                {showComplaint ? (
                  <Complaint email={email} />
                ) : (
                  <div className="welcome-container">
                    <div className="welcome-text-content">
                      <h3 className="subheading">
                        Welcome to Dump!
                        <br />
                        "A Friendly way to Breathe"
                      </h3>
                      <p>
                        The Dump project is an innovative initiative aimed at
                        tackling the pressing issue of garbage accumulation in
                        communities. It is driven by a profound motivation to
                        empower individuals, foster community engagement, and
                        revolutionize garbage management practices. The
                        project's core belief is that every individual has the
                        power to contribute to cleaner and healthier living
                        conditions.
                      </p>
                      <p>
                        Dump is a web-based platform that enables users to
                        report garbage accumulation by uploading pictures and
                        providing essential details such as location and type of
                        garbage. This information is used to alert nearby
                        garbage collection agencies, facilitating a quick and
                        efficient response.
                      </p>
                      <h4 className="subheading">Key Features</h4>
                      <ul>
                        <li>
                          User-Friendly Interface: Allows easy uploading of
                          garbage accumulation photos along with basic
                          information.
                        </li>
                        <li>
                          Location-Based Alerts: Identifies nearby garbage
                          collection agencies and sends them alerts about new
                          reports.
                        </li>
                        <li>
                          Agency Dashboard: Enables agencies to view reports,
                          assign tasks to field workers, and track garbage
                          clearance.
                        </li>
                        <li>
                          Database for Analysis: Maintains a comprehensive
                          database of all reports for statistical analysis and
                          trend identification.
                        </li>
                        <li>
                          Community Engagement: Encourages local communities to
                          participate actively by reporting garbage accumulation
                          and sharing success stories of clean-up drives.
                        </li>
                      </ul>
                      <p>
                        Dump stands as a testament to the power of technology
                        and community collaboration in addressing environmental
                        challenges. It offers a scalable solution that can be
                        adapted and implemented in various contexts, driving
                        forward the mission of cleaner, healthier communities
                        for all. With ongoing enhancements and an expanding
                        network, Dump aims to become a cornerstone in global
                        efforts to improve waste management and promote
                        environmental sustainability.
                      </p>
                    </div>
                    {addItemPageLoaded && (
                      <div className="raise-complaint">
                        <RaiseComplaint name={name} email={email} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </React.Fragment>
    );
  }
}

export default Home;
