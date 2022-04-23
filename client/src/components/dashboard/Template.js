import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  getTransactions,
  addAccount,
  deleteAccount,
} from "../../actions/accountActions";
import { logoutUser } from "../../actions/authActions";
import MaterialTable from "material-table"; // https://mbrn.github.io/material-table/#/
import cal from "../../img/cal.png";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import LogoHeader from "../layout/LogoHeader";
import { CSVLink, CSVDownload } from "react-csv";
const Template = (props) => {
  const curst = props.location.state;
  let transactionsData = [];
  const [len, setLen] = useState(0);
  const [showtxn, setshowtxn] = useState([{}]);
  const [fulltxn, setfulltxn] = useState([{}]);
  const [txnloading, settxnloading] = useState(true);
  // const populate = () => {
  const [cal1, setcal1] = useState(false);
  const [cal2, setcal2] = useState(false);
  const [date1, setdate1] = useState("Choose a starting date");
  const [date2, setdate2] = useState("Choose an ending date");
  // }
  const [accounts, setaccounts] = useState([props.location.state]);

  console.log(props);
  useEffect(
    () => {
      setaccounts([props.location.state]);
      axios
        .post("/api/plaid/accounts/transactions", accounts)
        .then((response) => {
          const transactions = response.data; // txn = [[]]

          transactions.forEach(function (account) {
            account.transactions.forEach(function (transaction) {
              transactionsData.push({
                date: transaction.date,
                category: transaction.category[0],
                name: transaction.name,
                amount: transaction.amount * -1,
              });
            });
          });
          //console.log(transactionsData);
          settxnloading(false);
          setLen(transactionsData.length);
          setshowtxn(transactionsData);
          setfulltxn(transactionsData);
          //console.log(transactionsData);
        });
    },
    //transactionsData.forEach((ex)=>console.log(ex)); works

    []
  );

  // Setting up data table
  const transactionsColumns = [
    { title: "Date", field: "date", type: "date", defaultSort: "desc" },
    { title: "Name", field: "name" },
    { title: "Amount", field: "amount", type: "numeric" },
    { title: "Category", field: "category" },
  ];
  //console.log(props.plaid);

  // transactionsData[0] -> object
  var leftcrumb =
    "Client > " +
    props.location.state.companyId +
    " > " +
    props.location.state.institutionName +
    " > Bank Transactions";
  var leftc = "Client > " + props.location.state.companyId;
  var bankc = " > " + props.location.state.institutionName;
  var curc = " > Bank Transactions";
  const handleClick = () => {
    //e.preventDefault();
    props.history.push({
      pathname: "/alerts",
      state: curst,
    });
  };
  const handleFilter = (e) => {
    e.preventDefault();
    if (date1[0] === "C") {
      alert("Please select a starting date");
    } else if (date2[0] === "C") {
      alert("Please select an ending date");
    } else {
      const rdate1 = dayjs(date1).format("YYYY-MM-DD");
      const rdate2 = dayjs(date2).format("YYYY-MM-DD");
      // both dates are valid
      const currenttxn = fulltxn;
      // filter all transactions between date1 and date2
      const filteredtxn = currenttxn.filter((txn) => {
        return txn.date >= rdate1 && txn.date <= rdate2;
      });
      setshowtxn(filteredtxn);
    }
  };
  const handleReset = (e) => {
    e.preventDefault();
    setshowtxn(fulltxn);
    setdate1("Choose a starting date");
    setdate2("Choose an ending date");
  };
  return (
    <>
      <LogoHeader
        right="Sign out"
        leftc={leftc}
        bankc={bankc}
        curc={curc}
        ori={props}
      />

      <div className="ml-20">
        This is Client {props.location.state.companyId}
        {"'s "}
        Transactions Page:
        <br />
        <br />
        <p className="text-gray-500">
          What bank information would you like to review?
        </p>
      </div>
      <div className="ml-20" style={{ width: "80%" }}>
        <form style={{ width: "300px" }}>
          <label class="block text-gray-700 text-lg font-bold mb-2" for="from">
            Start
          </label>

          <div className="flex flex-row">
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="start"
              type="text"
              placeholder={date1}
              readOnly
            />
            <div>
              {" "}
              <img
                src={cal}
                alt="cal"
                width="45"
                height="45"
                style={{ cursor: "pointer" }}
                onClick={() => setcal1(!cal1)}
              />{" "}
            </div>
          </div>
          {cal1 && (
            <Calendar
              onClickDay={(newD) => {
                setcal1(!cal1);
                setdate1(newD.toString().substring(4, 15));
              }}
            />
          )}
          <label class="block text-gray-700 text-lg font-bold mb-2" for="end">
            End
          </label>
          <div className="flex flex-row">
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="end"
              type="text"
              placeholder={date2}
              readOnly
            />
            <div>
              {" "}
              <img
                src={cal}
                alt="cal"
                width="45"
                height="45"
                style={{ cursor: "pointer" }}
                onClick={() => setcal2(!cal2)}
              />{" "}
            </div>
          </div>
          {cal2 && (
            <Calendar
              onClickDay={(newD) => {
                setcal2(!cal2);
                setdate2(newD.toString().substring(4, 15));
              }}
            />
          )}
          <div className="flex flex-row space-x-4">
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem",
                backgroundColor: "#00B050",
              }}
              className="w-full hover:bg-pink-700 text-white font-bold py-2 px-4 mb-4 rounded"
              onClick={handleFilter}
            >
              Filter
            </button>
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem",
                backgroundColor: "#00B050",
              }}
              className="w-full hover:bg-pink-700 text-white font-bold py-2 px-4 mb-4 rounded"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </form>

        {accounts.length <= 0 ? (
          <p>You haven't added an account yet</p>
        ) : txnloading ? (
          <p className="text-xl text-gray-600">Fetching transactions...</p>
        ) : (
          <>
            <br />
            <MaterialTable
              className="w-80"
              columns={transactionsColumns}
              data={showtxn}
              title="Transactions"
            />
            <div
              className="nextnav flex flex-row"
              style={{ justifyContent: "space-evenly" }}
            >
              <button
                style={{
                  width: "200px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem",
                  backgroundColor: "#00B050",
                }}
                className="w-full hover:bg-pink-700 text-white font-bold py-2 px-4 mb-4 rounded"
              >
                <CSVLink data={showtxn}>Export to Excel</CSVLink>
              </button>
              <button
                style={{
                  width: "200px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem",
                  backgroundColor: "#00B050",
                }}
                type="submit"
                className="w-full hover:bg-pink-700 text-white font-bold py-2 px-4 mb-4 rounded"
                onClick={() => handleClick()}
              >
                Alerts
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Template;
