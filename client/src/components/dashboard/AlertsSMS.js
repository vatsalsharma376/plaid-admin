import React from "react";
import LogoHeader from "../layout/LogoHeader";
import axios from "axios";
import { useState } from "react";

const AlertsSMS = (props) => {
  const depodate = "<<Deposit Date>>";
  const depoamount = "<<Deposit Amount>>";
  const depodec = "<<Deposit Description>>";

  const clientname = props.location.state.companyId;
  const fname = localStorage.getItem("fname");

  const defaultTXT =
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
  const [AlertTXT, setAlertTXT] = useState(defaultTXT);
  var leftcrumb =
    "Client > " +
    props.location.state.companyId +
    " > " +
    props.location.state.institutionName +
    " > Bank Alerts > Email";

  //axios.post("/api/plaid/addAlert", alertData);

  const handleClick = async () => {
    const curst = props.location.state;
    curst.adata.fullTXTmessage = AlertTXT;
    // const res = await axios.post("/api/plaid/addAlert", curst.adata);
    // props.history.push({
    //   pathname: "/dash",
    // });
    props.history.push({
      pathname: "/alertmail",
      state: curst,
    });
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
          onChange={(e) => setAlertTXT(e.target.value)}
          value={AlertTXT}
          className="text-gray-500"
          style={{ width: "50%", height: "50%" }}
        >
          {AlertTXT}
        </textarea>
        <button onClick={() => handleClick()}>
          Click here to update mail message
        </button>
      </div>
    </>
  );
};

export default AlertsSMS;
