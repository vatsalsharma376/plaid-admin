import React from "react";
import axios from "axios";

const ImportList = (props) => {
  const accounts = props.acc.acc;
  console.log(accounts, "importList.js");
  const handleImport = (accessTkn, accId, acName) => {
    alert("Transactions imported successfully");
    const transactions = axios.post("/api/plaid/accounts/transactions/import", {
      accessTkn,
      accId,
      acName,
    });
  };
  return (
    <ul>
      {accounts.map((account) => (
        <li key={account.accessToken}>
          <button
            onClick={() =>
              handleImport(
                account.accessToken,
                account._id,
                account.institutionName
              )
            }
            style={{ backgroundColor: "#00B050" }}
            className=" hover:bg-pink-700 text-white font-bold px-1 py-1
            mb-4 rounded"
          >
            Import
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ImportList;
