import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useEffect } from "react";
import {
  getTransactions,
  addAccount,
  deleteAccount
} from "../../actions/accountActions";
import { logoutUser } from "../../actions/authActions";
import Header from "../layout/Navbar";
import { FiLogOut } from "react-icons/fi";
// AiOutlineUser
import { BiUserCircle } from "react-icons/bi";

const Accounts = (props) => {
  //console.log("ok");
  useEffect( ()=> {
    
     },[])

  const onLogoutClick = e => {
    e.preventDefault();
    props.logoutUser();
  };
    
    return (
       <>
       
      <div className="flex flex-row ">
        
        {/* {accounts.length>=1 && <Template {...props}/> } */}
        <div className=" hhw"><Header {...props}/></div>
        <div className="ml-20 lgot">
          
          <button
            onClick={onLogoutClick}
            className="inline-block mt-1 p-2 pl-5 pr-5 bg-transparent border-2 border-red-400 text-red-400 text-lg rounded-lg transition-colors duration-700 transform hover:bg-red-500 hover:text-gray-100 focus:border-4 focus:border-indigo-300"
          >
            <FiLogOut/>
          </button>
          <BiUserCircle className="w-10 h-10 mt-0 inline-block"/>
          </div>
          </div>
      
      
      </>
    );
  
}

Accounts.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  getTransactions: PropTypes.func.isRequired,
  addAccount: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  accounts: PropTypes.array.isRequired,
  plaid: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  plaid: state.plaid
});

export default connect(
  mapStateToProps,
  { logoutUser, getTransactions, addAccount, deleteAccount }
)(Accounts);
