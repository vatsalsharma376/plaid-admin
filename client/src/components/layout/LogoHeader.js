import React from "react";
import logo from "../../img/logo.png";
const LogoHeader = (props) => {
  return (
    <div>
      <img src={logo} className="h-20 w-25"></img>
      <div class="flex flex-col">
        <header
          style={{ background: "#00B050" }}
          class="py-5 text-white text-center"
        >
          {props && props.title}
        </header>
      </div>
    </div>
  );
};

export default LogoHeader;
