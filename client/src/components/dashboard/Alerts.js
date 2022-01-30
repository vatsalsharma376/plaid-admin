import React from "react";
import LogoHeader from "../layout/LogoHeader";

const borderColor = "#A2C987";
const Alerts = (props) => {
  return (
    <div className="ml-20">
      <LogoHeader right="Sign out" />
      This is Client xxx Bank Alert page:
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
        placeholder="CARE RELIEF OR FUND OR INTEREST"
      />
    </div>
  );
};

export default Alerts;
