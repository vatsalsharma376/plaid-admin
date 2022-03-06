import React from "react";
import LogoHeader from "../layout/LogoHeader";
import axios from "axios";
import { useState } from "react";
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
    window.location.href = "http://localhost:3006/dash";
  };
  return (
    <>
      <LogoHeader left={leftcrumb} right="Sign out" />
      <div className="ml-20">
        This is Client {clientname} Bank Alert Page:
        <br />
        <br />
        <p className="text-gray-500">
          How would you like to word the Bank Alert email message?
        </p>
        <br />
        <textarea
          onChange={(e) => setAlertML(e.target.value)}
          value={AlertML}
          className="text-gray-500"
          style={{ width: "25%", height: "25%" }}
        >
          {AlertML}
        </textarea>
        <button onClick={() => handleClick()}>
          Click here to update mail message
        </button>
      </div>
    </>
  );
};

export default AlertsML;
