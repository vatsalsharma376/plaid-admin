import React from "react";
import LogoHeader from "../layout/LogoHeader";
import moment from "moment";
import axios from "axios";
import { useState } from "react";
const borderColor = "#A2C987";

const Alerts = (props) => {
  console.log(props.location.state);

  const clientname = props.location.state.companyId;
  var leftcrumb =
    "Client > " +
    props.location.state.companyId +
    " > " +
    props.location.state.institutionName +
    " > Bank Alerts";
  const email = localStorage.getItem("email");
  const cell = localStorage.getItem("cell");
  const fname = localStorage.getItem("fname");

  const [amount, setAmount] = useState(-1);
  const [message, setMessage] = useState("NA");
  const [mailcheck, setMailcheck] = useState(false);
  const [cellcheck, setCellcheck] = useState(false);
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
          amount: amount,
          message: message,
          lasttxn: today,
          accessToken: props.location.state.accessToken,
          fname: fname,
          clientname: clientname,
        };
      } else if (mailcheck) {
        alertData = {
          email: email,
          amount: amount,
          message: message,
          lasttxn: today,
          accessToken: props.location.state.accessToken,
          fname: fname,
          clientname: clientname,
        };
      } else if (cellcheck) {
        alertData = {
          cell: cell,
          amount: amount,
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
      <LogoHeader left={leftcrumb} right="Sign out" />

      <div className="ml-20">
        This is Client {props.location.state.companyId}
        {"'s "}
        Bank Alert page:
        <br />
        1) Get notified when a payment comes in for a specific amount:
        <br />
        <br />
        <b>Amount:</b> <br />
        <input
          style={{ borderColor: borderColor }}
          required
          type="text"
          name="amount"
          placeholder="$1500"
          value={amount != -1 ? amount : ""}
          onChange={(e) => setAmount(e.target.value)}
        />
        <br />
        2) Get notified when a bank deposit includes the following description:{" "}
        <br />
        <br />
        <b>Description:</b> <br />
        <input
          style={{ borderColor: borderColor }}
          required
          type="text"
          name="desc"
          placeholder="“CARELIEF” OR “CALIFORNIA RELIEF” OR “RELIEF“"
          value={message != "NA" ? message : ""}
          onChange={(e) => setMessage(e.target.value)}
        />
        <br />
        Email: {email}
        <input type="checkbox" onChange={() => setMailcheck(!mailcheck)} />
        Cell: {cell}
        <input type="checkbox" onChange={() => setCellcheck(!cellcheck)} />
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
    </>
  );
};

export default Alerts;
