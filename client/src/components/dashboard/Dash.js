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
import UsracList from "./UsracList";
import ReactPaginate from "react-paginate";
import "./Dash.css";
var listedname = [];
var numberofUsers = 0;
const Dash = () => {
  const [listname, setlistname] = useState([]);
  const [loadingtable, setloadingtable] = useState(true);
  const [isItemloaded, setisItemloaded] = useState(false);
  const [perPage, setperPage] = useState(5);
  const [page, setpage] = useState(0);
  const [numpage, setnumpage] = useState();
  const [shownItems, setshownItems] = useState();
  const populate = () => {
    /*
    [..., {,acc:[]}]
    */
    let items = listedname.slice(page * perPage, (page + 1) * perPage);
    console.log(items);
    let curshownItems = items.map((item) => {
      return (
        <tr key={item._id}>
          <td>{item.companyId}</td>
          <td>{item.fname}</td>
          <td>{"ADP"}</td>
          <td>{<UsracList acc={item} />}</td>
        </tr>
      );
    });
    setshownItems(curshownItems);
  };
  const getall = async () => {
    const users = await axios.get("/api/plaid/names");
    const banks = await axios.get("/api/plaid/banknames");
    const usersWithBanks = await users.data.map((user) => {
      user.acc = [];
      user.comp = "";
      for (let i = 0; i < banks.data.length; i++) {
        if (banks.data[i].userId == user._id) {
          user.acc.push(banks.data[i]);
          user.companyId = user.companyId;
        }
      }
      if (user.acc.length > 0) listedname.push(user);
    });

    setlistname(listedname);
    setloadingtable(false);
    setnumpage(Math.ceil(listedname.length / perPage));
    populate();
  };

  useEffect(() => {
    setloadingtable(true);
    //getting all registered user names
    if (listedname.length === 0) getall();
    populate();
  }, [page]);
  const handlePageClick = (event) => {
    setpage(event.selected);
  };
  return (
    <>
      <br />
      <table className="Table " style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Owner</th>
            <th>Payroll System</th>
            <th>Bank System</th>
          </tr>
        </thead>
        <tbody>{shownItems}</tbody>
      </table>
      <ReactPaginate
        previousLabel={"prev"}
        nextLabel={"next"}
        pageCount={numpage}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </>
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
