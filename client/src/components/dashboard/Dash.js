import React from "react";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getTransactions,
  addAccount,
  getAccounts,
  deleteAccount,
} from "../../actions/accountActions";
import { logoutUser } from "../../actions/authActions";
import axios from "axios";
import LogoHeader from "../layout/LogoHeader";

const Dash = () => {
  const [listname, setlistname] = useState([]);
  const [bankname, setbankname] = useState([]);

  useEffect(() => {
    //getting all registered user names
    axios.get("/api/plaid/names").then((response) => {
      response.data.forEach((usr) => {
        axios.post("/api/plaid/banknames", { usrid: usr._id }).then((res) => {
          usr.acc = res.data;
          if (usr.acc && usr.acc.length > 0) setlistname([...listname, usr]);

          console.log(res);
        });
      });
    });
    console.log(listname);
  }, []);

  return <div>{JSON.stringify(listname)}</div>;
};
Dash.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  getTransactions: PropTypes.func.isRequired,
  addAccount: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  // accounts: PropTypes.array.isRequired,
  // plaid: PropTypes.object.isRequired,
  // user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  plaid: state.plaid,
});

export default connect(mapStateToProps, {
  logoutUser,
  getTransactions,
  getAccounts,
  addAccount,
  deleteAccount,
})(Dash);
