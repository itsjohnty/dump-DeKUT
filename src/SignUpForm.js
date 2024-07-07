import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "./firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import Home from "./UI/Home/Home";
class SignUpForm extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      name: "",
      mobile: "",
      aadhaar: "",
      pan: "",
      uid: "",
      pincode:"",
      userName:"",
      isOTPHasSentSuccessfully: false,

      otp: "",
      // verificationId: "",
      token: "",
      isAuthenticated: true,
      error: null,
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  async checkIfUserIsAlreadyRegisterOrNot() {
    const db = firebase.firestore();
    // const usersRef = db.collection("userdetails");
    let mobileNumber = this.state.mobile;
    mobileNumber = mobileNumber.replace(/^0+/, "");

    console.log("mobileNumber" + mobileNumber);
    const q = query(
      collection(db, "userdetails"),
      where("mobile", "==", `+91${mobileNumber}`)
    );

    const querySnapshot = await getDocs(q);

    console.log(querySnapshot._snapshot.docChanges.length);

    if (querySnapshot._snapshot.docChanges.length > 0) {
      alert(
        "Phone Number is already registered. \nTry to signIn instead of SignUp"
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

  handleChange(event) {
    let target = event.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value,
    });
  }

  componentDidMount() {
    console.log("componentDidMount");
    // this.StoreUserDetail();
    // this.checkIfUserIsAlreadyRegisterOrNot();
    // this.props.authHandler();
  }

  StoreUserDetail = async () => {
    console.log("FUNCTION :StoreUserDetail");
    const db = firebase.firestore();
    let mobileNumber = this.state.mobile;
    mobileNumber = mobileNumber.replace(/^0+/, "");
    try {
      const docRef = await addDoc(collection(db, "userdetails"), {
        name: this.state.name,
        mobile: "+91" + mobileNumber,
        email: this.state.email,
        pan: this.state.pan,
        aadhaar: this.state.aadhaar,
        pincode:this.state.pincode,
      });

      console.log("Document written with ID: ", docRef.id);
      const userdetails = [
        {
          name: this.state.name,
          email: this.state.email,
        }
      ];
      this.props.authHandler(userdetails);
 
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  configureCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.

          // shouldn't be here
          // this.onSignUpSubmit();
          console.log("Recaptca varified");
        },
        defaultCountry: "IN",
      }
    );
  };
  onSignUpSubmit = (e) => {
    // form is submitted yet , here we sent otp  then OTP is verified in 'onSubmitOTP' func. and also form is submitted there.
    e.preventDefault();
    this.configureCaptcha();

    this.checkIfUserIsAlreadyRegisterOrNot();
  };

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
        // IMP
        console.log(user.multiFactor.user.accessToken);
        this.setState({
          token: user.multiFactor.user.accessToken,
          isAuthenticated: true,
        });
        this.StoreUserDetail();
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

  // if()

  render() {
    //
    //

    // if (this.state.isAuthenticated) {
    //   return Home;
    // }

    let displaySignUpOrOTPPage = (
      <div className="formCenter">
        <form onSubmit={this.handleSubmit} className="formFields">
          <div className="formField">
            <div id="sign-in-button"></div>

            <input
              type="text"
              id="name"
              className="formFieldInput"
              placeholder="Name:"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </div>
          <div className="formField">
            <input
              type="text"
              id="tel"
              className="formFieldInput"
              placeholder="Mobile no:"
              name="mobile"
              // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}
              value={this.state.mobile}
              onChange={this.handleChange}
            />
          </div>
          <div className="formField">
            <input
              type="email"
              id="email"
              className="formFieldInput"
              placeholder="Email id:"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </div>
          <div className="formField">
            <input
              type="text"
              id="aadhaar"
              // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}
              className="formFieldInput"
              placeholder="Aadhaar Card no:"
              name="aadhaar"
              value={this.state.aadhaar}
              onChange={this.handleChange}
            />
          </div>
          <div className="formField">
            <input
              type="text"
              id="pan"
              className="formFieldInput"
              placeholder="Pan Card no:"
              name="pan"
              value={this.state.pan}
              onChange={this.handleChange}
            />
          </div>
          <div className="formField">
            <input
              type="tek"
              id="pincode"
              className="formFieldInput"
              placeholder="Pincode:"
              name="pincode"
              value={this.state.pincode}
              onChange={this.handleChange}
            />
          </div>
          <div className="formField buttonmargin1">
            <Link
              to="/sign-in"
              onClick={this.onSignUpSubmit}
              className="formFieldLink buttoncurve"
            >
              Create an Account
            </Link>
          </div>
        </form>
      </div>
    );

    if (this.state.isOTPHasSentSuccessfully) {
      // test
      
      displaySignUpOrOTPPage = (
        <div className="formCenter">
          {/* <h2>Enter OTP</h2> */}
          <form onSubmit={this.onSubmitOTP} className="formFields">
            <div className="formField">
              <input
                className="formFieldInput"
                type="number"
                name="otp"
                placeholder="OTP Number"
                required
                onChange={this.handleChange}
                autoComplete="on"
              />
            </div>
            <div className="formField buttonmargin1"> 
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
    }

    return displaySignUpOrOTPPage;
  }
}
export default SignUpForm;