import React from "react";
import { useState } from "react";

import logo from "../../img/logo.png";
import store from "../../../src/store";
import { logoutUser } from "../../../src/actions/authActions";
const LogoHeader = (props) => {
  const [hover1, sethover1] = useState("normal");
  const [hover2, sethover2] = useState("normal");
  const [hover3, sethover3] = useState("normal");

  const pprops = props.ori;
  //console.log(props);
  /*onClick={
          props.ori
            ? () =>
                props.ori.history.push({
                  pathname: "/alerts",
                  state: props.ori.location.state,
                })
            : console.log(props)
        } */
  const style1 = {
    background: "#00B050",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
  };
  const style2 = {
    background: "#00B050",
    paddingTop: "1.25rem",
    paddingBottom: "1.25rem",
  };
  return (
    <div>
      <img src={logo} className="h-20 w-25"></img>
      <div class="flex flex-col">
        <header
          style={props.left || props.right ? style1 : style2}
          className=" text-white"
        >
          <div
            className="flex flex-row"
            style={{
              width: "95%",
              justifyContent: "space-between",
              margin: "auto",
            }}
          >
            <div className="ml-12 text-gray-300 flex flex-row">
              <div
                onMouseEnter={() => sethover1("bold")}
                onMouseLeave={() => sethover1("normal")}
                style={{ cursor: "pointer", fontWeight: hover1 }}
                onClick={() => {
                  props.ori.history.push({
                    pathname: "/dash",
                  });
                }}
              >
                {props.leftc ? props.leftc : ""}
              </div>
              <div
                onMouseEnter={() => sethover2("bold")}
                onMouseLeave={() => sethover2("normal")}
                style={{ cursor: "pointer", fontWeight: hover2 }}
                onClick={() => {
                  pprops.history.push({
                    pathname: "/choose",
                    state: pprops.location.state,
                  });
                }}
              >
                {props.bankc ? props.bankc : ""}
              </div>
              <div
                onMouseEnter={() => sethover3("bold")}
                onMouseLeave={() => sethover3("normal")}
                style={{ cursor: "pointer", fontWeight: hover3 }}
                onClick={() => {
                  pprops.history.push({
                    pathname: "/alerts",
                    state: pprops.location.state,
                  });
                }}
              >
                {props.alertc ? props.alertc : ""}
              </div>
              <div>{props.curc ? props.curc : ""}</div>
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                store.dispatch(logoutUser());
                window.location.href = "./login";
              }}
            >
              <b>{props && props.right ? props.right : ""}</b>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default LogoHeader;
