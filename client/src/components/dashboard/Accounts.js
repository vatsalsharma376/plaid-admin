import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useEffect } from "react";
import {
  getTransactions,
  addAccount,
  deleteAccount,
} from "../../actions/accountActions";
import { logoutUser } from "../../actions/authActions";
import Header from "../layout/Navbar";
import { FiLogOut } from "react-icons/fi";
// AiOutlineUser
import { BiUserCircle } from "react-icons/bi";
import LogoHeader from "../layout/LogoHeader";

const Accounts = (props) => {
  //console.log("ok");
  useEffect(() => {}, []);

  const onLogoutClick = (e) => {
    e.preventDefault();
    props.logoutUser();
  };

  return (
    <>
      <LogoHeader right="Sign out" />
      <div className="flex flex-row ">
        {/* {accounts.length>=1 && <Template {...props}/> } */}
        <div className=" hhw">
          <Header {...props} />
        </div>
      </div>
    </>
  );
};

Accounts.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  getTransactions: PropTypes.func.isRequired,
  addAccount: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  accounts: PropTypes.array.isRequired,
  plaid: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  plaid: state.plaid,
});

export default connect(mapStateToProps, {
  logoutUser,
  getTransactions,
  addAccount,
  deleteAccount,
})(Accounts);
