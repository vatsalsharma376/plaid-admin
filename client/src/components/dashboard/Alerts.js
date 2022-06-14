import React from "react";
import Slider from "@material-ui/core/Slider";
import moment from "moment";
import { useState } from "react";
import { Fragment } from "react";
import axios from "axios";

import LogoHeader from "../layout/LogoHeader";
import "./Dash.css";

const space = <Fragment>&nbsp;&nbsp;&nbsp;&nbsp;</Fragment>;
const borderColor = "#A2C987";

const Alerts = (props) => {
  console.log(props);

  const clientname = props.location.state.companyId;
  var leftcrumb =
    "Client > " +
    props.location.state.companyId +
    " > " +
    props.location.state.institutionName +
    " > Bank Alerts";
  var leftc = "Client > " + props.location.state.companyId;
  var bankc = " > " + props.location.state.institutionName;
  var curc = " > Bank Alerts";
  const email = localStorage.getItem("email");
  const cell = localStorage.getItem("cell");
  const fname = localStorage.getItem("fname");

  const [stamount, setStamount] = useState(-1);
  const [endamount, setEndamount] = useState(-1);
  const [message, setMessage] = useState("NA");
  const [mailcheck, setMailcheck] = useState(false);
  const [cellcheck, setCellcheck] = useState(false);

  const rangeSelector = (event, newValue) => {
    setStamount(newValue[0]);
    setEndamount(newValue[1]);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (mailcheck == false && cellcheck == false) {
      alert("Please select at least one option to send alerts");
    } else {
      const now = moment();
      const today = now.format("YYYY-MM-DD");
      var alertData;
      if (mailcheck && cellcheck) {
        alertData = {
          email: email,
          cell: cell,
          stamount: stamount,
          endamount: endamount,
          message: message,
          lasttxn: today,
          accessToken: props.location.state.accessToken,
          fname: fname,
          clientname: clientname,
        };
      } else if (mailcheck) {
        alertData = {
          email: email,

          stamount: stamount,
          endamount: endamount,
          message: message,
          lasttxn: today,
          accessToken: props.location.state.accessToken,
          fname: fname,
          clientname: clientname,
        };
      } else if (cellcheck) {
        alertData = {
          cell: cell,

          stamount: stamount,
          endamount: endamount,
          message: message,
          lasttxn: today,
          accessToken: props.location.state.accessToken,
          fname: fname,
          clientname: clientname,
        };
      }
      const alertpass = props.location.state;
      alertpass.adata = alertData;
      //axios.post("/api/plaid/addAlert", alertData);
      props.history.push({
        pathname: "/alertsms",
        state: alertpass,
      });
    }
  };
  return (
    <>
      <LogoHeader
        leftc={leftc}
        bankc={bankc}
        curc={curc}
        ori={props}
        right="Sign out"
      />

      <div className="ml-20">
        <div style={{ fontSize: "20px" }}>
          This is Client {props.location.state.companyId}
          {"'s "}
          Bank Alert page:
          <br />
          <br></br>
          <span className="p1">
            <span style={{ color: "grey" }}>
              1) Get notified when a payment comes in for a specific amount:
            </span>
          </span>
          <br />
          <br />
          <b>Amount range:</b> <br />
          <div
            style={{
              width: "40%",
              flex: "1",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <input
              type="number"
              name="stamount"
              placeholder="Starting amount"
              style={{ border: "2px solid #00b050" }}
              onChange={(e) => {
                setStamount(e.target.value);
              }}
            />
            <input
              type="number"
              name="endamount"
              placeholder="Ending amount"
              style={{ border: "2px solid #00b050" }}
              onChange={(e) => {
                setEndamount(e.target.value);
              }}
            />
          </div>
          <br />
          2) Get notified when a bank deposit includes the following
          description: <br />
          <br />
          <b>Description:</b> <br />
          <input
            style={{ width: "500px", border: "2px solid #00b050" }}
            required
            type="text"
            name="desc"
            placeholder="“CARELIEF” OR “CALIFORNIA RELIEF” OR “RELIEF“"
            value={message != "NA" ? message : ""}
            onChange={(e) => setMessage(e.target.value)}
          />
          <br />
          <br></br>
          <br></br>
          <b>
            TextMessage: {space}
            {space}
            {space}
            {space}
            {space}
            Email:{" "}
          </b>
          <br></br>
          <input
            type="checkbox"
            style={{ border: "2px solid #00b050" }}
            onChange={() => setCellcheck(!cellcheck)}
          />{" "}
          {cell}
          {space}
          {space}
          {space}
          {space}
          {space}
          <input
            type="checkbox"
            style={{ border: "2px solid #00b050" }}
            onChange={() => setMailcheck(!mailcheck)}
          />
          {email}
          <br />
          <button
            style={{
              width: "250px",
              borderRadius: "3px",
              letterSpacing: "1.5px",
              marginTop: "1rem",
              backgroundColor: "#00B050",
            }}
            onClick={handleClick}
            className="w-full hover:bg-pink-700 text-white font-bold py-2 px-4 mb-4 rounded"
          >
            <center>Update Alerts</center>
          </button>
        </div>
      </div>
    </>
  );
};

export default Alerts;
