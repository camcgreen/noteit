import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Route, BrowserRouter as Router, Redirect } from "react-router-dom";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import Note from "./components/Note";

const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
  apiKey: "AIzaSyBJq9l9Ej_bXS4QaJVEYPLqfE5UMdfYUZc",
  authDomain: "note-it-38acb.firebaseapp.com",
  projectId: "note-it-38acb",
  storageBucket: "note-it-38acb.appspot.com",
  messagingSenderId: "924675449619",
  appId: "1:924675449619:web:eb8ca5b5dd6991b90af0e6",
  measurementId: "G-9DGLKEC6LP",
});

const routing = (
  <Router>
    <div id="routing-container">
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
      <Route path="/login" component={LogIn}></Route>
      <Route path="/signup" component={SignUp}></Route>
      <Route path="/dashboard" component={Dashboard}></Route>
      <Route path="/note" component={Note}></Route>
    </div>
  </Router>
);

ReactDOM.render(
  <React.StrictMode>{routing}</React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
