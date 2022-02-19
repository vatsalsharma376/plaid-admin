import React from "react";
import LogoHeader from "../layout/LogoHeader";
import { useEffect } from "react";
const Choose = (props) => {
  useEffect(() => {
    console.log(props);
  }, []);
  const handleChange = (e) => {
    const curst = props.location.state;
    if (e.target.value === "choose") {
      alert("Please select a choice");
    } else if (e.target.value === "txn") {
      props.history.push({
        pathname: "/tranx",
        state: curst,
      });
    } else if (e.target.value === "alert") {
      alert("Navigating to Alert");
    }
  };
  var leftcrumb =
    "Client > " +
    props.location.state.companyId +
    " > " +
    props.location.state.institutionName;
  return (
    <>
      <LogoHeader right="Sign out" left={leftcrumb} />

      <div className="ml-20">
        This is Client {props.location.state.companyId}
        {"'s "}
        {props.location.state.institutionName} Page:
        <br />
        <br />
        <p className="text-gray-500">
          What bank information would you like to review?
        </p>
        <br />
        <select
          id="dropdown"
          className="border-2 border-green-500"
          onChange={handleChange}
        >
          <option value="choose">---Choose one---</option>
          <option value="txn">Transactions</option>
          <option value="alert">Alerts</option>
        </select>
      </div>
    </>
  );
};

export default Choose;
