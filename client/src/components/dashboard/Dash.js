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

  useEffect(() => {
    axios.get("/api/plaid/names").then((response) => {
      response.data.forEach((usr) => {
        console.log(usr);
        // var xyz = listname;
        // xyz.push();
        setlistname((oldusr) => [...oldusr, usr.name]);
        console.log(listname);
      });
    });
  }, []);

  return (
    <div>
      <h1> Welcome Admin</h1>
      {listname && listname.map((usr) => <h3>{usr}</h3>)}
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
