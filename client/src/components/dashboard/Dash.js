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

const Dash = () => {
  const [listname, setlistname] = useState([]);
  const [bankname, setbankname] = useState([]);
  const [listid, setlistid] = useState([]);
  useEffect(() => {
    //getting all registered user names
    axios.get("/api/plaid/names").then((response) => {
      response.data.forEach((usr) => {
        console.log(usr);
        setlistname((oldusr) => [...oldusr, usr.name]);
        setlistid((oldusr) => [...oldusr, usr._id]);

        console.log(listname);
      });
    });
    axios.get("/api/plaid/banknames").then((response) => {
      response.data.forEach((usr) => {
        console.log(usr);
        setbankname((oldbank) => [...oldbank, usr.institutionName]);
        console.log(bankname);
      });
    });
  }, []);

  return (
    <div>
      <b> Names of all users registered on portal</b>
      {listname && listname.map((usr) => <h3>{usr}</h3>)}

      <b> Names of all banks that are registered on portal</b>
      {bankname && bankname.map((usr) => <h3>{usr}</h3>)}
    </div>
  );
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
