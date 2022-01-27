import React from "react";
import { Link } from "react-router-dom";
const UsracList = (props) => {
  //console.log(props.acc.acc);
  //   const { acc } = props;d
  const accounts = props.acc.acc;

  return (
    <ul>
      {accounts.map((account) => (
        <Link
          to={{
            pathname: "/choose",
            state: account,
          }}
        >
          <li
            style={{ color: "blue", cursor: "pointer" }}
            key={account.accessToken}
          >
            {account.institutionName}
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default UsracList;
