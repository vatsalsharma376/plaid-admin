import React from "react";
import LogoHeader from "../layout/LogoHeader";
import axios from "axios";
import { useState } from "react";
import { Fragment } from "react";
const space = (
  <Fragment>
    &nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;
  </Fragment>
);
const AlertsML = (props) => {
  const depodate = "<<Deposit Date>>";
  const depoamount = "<<Deposit Amount>>";
  const depodec = "<<Deposit Description>>";

  const clientname = props.location.state.companyId;
  const fname = localStorage.getItem("fname");

  const defaultML =
    "Hi " +
    fname +
    ",\n Your client " +
    clientname +
    " has received a deposit of interest:\n" +
    " Deposit date: " +
    depodate +
    "\n Amount: " +
    depoamount +
    "\n Description: " +
    depodec;
  const [AlertML, setAlertML] = useState(defaultML);
  var leftcrumb =
    "Client > " +
    props.location.state.companyId +
    " > " +
    props.location.state.institutionName +
    " > Bank Alerts > Email";

  const handleClick = async () => {
    const curst = props.location.state;
    curst.adata.fullMLmessage = AlertML;
    const res = await axios.post("/api/plaid/addAlert", curst.adata);
    alert("Alert added successfully");

    window.location.href = "https://cyaadmin.herokuapp.com/";
  };
  return (
    <>
      <LogoHeader left={leftcrumb} right="Sign out" />
      <div className="ml-20">
        <div style={{ fontSize: "20px" }}>
          This is Client {clientname} Bank Alert Page:
          <br />
          <br />
          <p className="text-gray-500">
            How would you like to word the Bank Alert email message?
          </p>
          <br />
          <textarea
            style={{ height: "200px", width: "1000px" }}
            onChange={(e) => setAlertML(e.target.value)}
            value={AlertML}
            className="text-gray-500"
          >
            {AlertML}
          </textarea>
          <br></br>
        </div>
      </div>
      {space}
      {space}
      {space}
      {space}
      {space}
      {space}
      {space}
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
        <center>Update Email Message</center>
      </button>
    </>
  );
};

export default AlertsML;