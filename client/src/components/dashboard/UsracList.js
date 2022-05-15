import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UsracList = (props) => {
  //console.log(props.acc.acc);
  //   const { acc } = props;d
  //props.acc.acc.companyId = props.acc.companyId;
  var accounts = props.acc.acc;
  accounts[0].companyId = props.acc.companyId;
  console.log(accounts);
  return (
    <ul>
      {accounts.map((account) => (
        <li
          style={{ color: "blue", cursor: "pointer" }}
          key={account.accessToken}
        >
          <Link
            to={{
              pathname: "/choose",
              state: account,
            }}
          >
            {account.institutionName + "      "}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default UsracList;
