import React, { Component } from "react";
import { Link } from "react-router-dom";
// import firebase from "@firebase/app-compat";
import firebase from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

class SignInForm extends Component {
  constructor() {
    super();

    this.state = {
      mobile: "",
      otp: "",
      isAuthenticated: false,
      userdetails: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let target = event.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value,
    });
  }
  configureCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.

          // shouldn't be here
          // this.onSignInSubmit();
          console.log("Recaptca varified");
        },
        defaultCountry: "IN",
      }
    );
  };

  onSignInSubmit = (e) => {
    // form is not submitted yet , here we sent otp  then OTP is verified in 'onSubmitOTP' func. and also form is submitted there.
    e.preventDefault();
    this.configureCaptcha();
    const phoneNumber = "+91" + this.state.mobile;
    console.log(phoneNumber);
    var appVerifier = window.recaptchaVerifier;

    this.checkIfUserIsAlreadyRegisterOrNot();
  };

  // ///////////////////////////////

  async checkIfUserIsAlreadyRegisterOrNot() {
    const db = firebase.firestore();
    // const usersRef = db.collection("userdetails");
    let mobileNumber = "" + this.state.mobile;
    mobileNumber = mobileNumber.replace(/^0+/, "");

    console.log("mobileNumber" + mobileNumber);
    const q = query(
      collection(db, "userdetails"),
      where("mobile", "==", `+91${mobileNumber}`)
    );

    const querySnapshot = await getDocs(q);

    const userdetails = querySnapshot.docs.map((doc) => doc.data());
    this.setState({ userdetails });

    console.log(querySnapshot._snapshot.docChanges.length);

    if (querySnapshot._snapshot.docChanges.length == 0) {
      alert(
        "Phone Number is not  registered yet . \nTry to signUp first  instead of SignIn."
      );
      //not need to send OTP
      return;
    } else {
      var phoneNumber = "+91" + this.state.mobile;
      console.log(phoneNumber);
      var appVerifier = window.recaptchaVerifier;

      firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier)
        // .signInWithPhoneNumber(
        //   { phoneNumber: phoneNumber, email: this.state.email },
        //   appVerifier
        // )
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          alert("OTP has been sent");
          // console.log(confirmationResult);
          this.setState({
            isOTPHasSentSuccessfully: true,
            verificationId: confirmationResult.verificationId,
          });
          // this.StoreUserDetail();

          // ...user.multiFactor.user
        })
        .catch((error) => {
          // Error; SMS not sent
          // ...
          alert("SMS not sent" + error.message);
        });
    }

    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, " => ", doc.data());
    // });
  }

  // ////////////////////////////////////

  getUserDetails() {}

  onSubmitOTP = (e) => {
    e.preventDefault();
    const code = this.state.otp;
    const verificationId = this.state.verificationId;
    console.log(code);

    var credential = firebase.auth.PhoneAuthProvider.credential(
      window.confirmationResult.verificationId,
      code
    );

    firebase
      .auth()
      .signInWithCredential(credential)
      .then((result) => {
        const user = result.user;
        alert("User is verified");
        console.log("USER");
        console.log(user);
        console.log(this.state.userdetails)
        this.props.authHandler(this.state.userdetails);
        // IMP
        console.log(user.multiFactor.user.accessToken);
        this.setState({
          token: user.multiFactor.user.accessToken,
          isAuthenticated: true,
        });

        // this.getUserDetails();
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        if (errorCode === "auth/account-exists-with-different-credential") {
          alert("Email already associated with another account.");
          // Handle account linking here, if using.
        } else {
          console.error(error);
        }
      });
  };

  handleSubmit(event) {
    event.preventDefault();
    this.signIn(this.state.phoneno);
    console.log("The form was submitted with the following data:");
    console.log(this.state);
  }

  render() {
    //
    //

    let displaySignInOrOTPPage = (
      <div className="formCenter">
        <form onSubmit={this.handleSubmit} className="formFields">
          <div className="formField">
            <div id="sign-in-button"></div>

            <input
              type="text"
              id="tel"
              className="formFieldInput box"
              placeholder="Mobile no:"
              name="mobile"
              // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}
              value={this.state.mobile}
              onChange={this.handleChange}
            />
            <div className="buttonmargin">
              <Link
                to="/sign-in"
                onClick={this.onSignInSubmit}
                className="formFieldLink buttoncurve"
              >
                Send OTP
              </Link>
            </div>
          </div>

          <div className="formField">
            <input
              className="formFieldInput box"
              type="number"
              name="otp"
              placeholder="OTP Number"
              required
              onChange={this.handleChange}
              autoComplete="on"
            />
          </div>
          <div className="formField buttonmargin">
            <Link
              to="/sign-in"
              onClick={this.onSignInSubmit}
              className="formFieldLink buttoncurve"
            >
              Resend OTP
            </Link>
          </div>
          <div className="formField buttonmargin centermargin">
            <Link
              to="/sign-in"
              onClick={this.onSubmitOTP}
              className="formFieldLink buttoncurve"
            >
              Submit
            </Link>
          </div>
        </form>
      </div>
    );

    return displaySignInOrOTPPage;
  }
}

export default SignInForm;
