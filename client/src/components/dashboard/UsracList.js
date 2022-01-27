import React from "react";

const UsracList = (props) => {
  //console.log(props.acc.acc);
  //   const { acc } = props;
  const accounts = props.acc.acc;
  return (
    <ul>
      {accounts.map((account) => (
        <li key={account.accessToken}>{account.institutionName}</li>
      ))}
    </ul>
  );
};

export default UsracList;
