const mongo = require("mongoose");

const express = require("express");
const plaid = require("plaid");
//app.use(express.json());
const router = express.Router();
const passport = require("passport");
const moment = require("moment");
const http = require("http");
const MongoClient = require("mongodb").MongoClient;
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
// import fetch from "node-fetch";
// Load Account and User models
const Account = require("../../models/Account");
const User = require("../../models/User");
const userURI =
  "mongodb+srv://claimyouraid:cya@cluster0.kfgzq.mongodb.net/?retryWrites=true&w=majority";
const configuration = new Configuration({
  basePath: PlaidEnvironments["sandbox"],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": "6166d89a162e690010d7084b",
      "PLAID-SECRET": "9097d5e53b34172035a9cbf66e1047",
    },
  },
});

const client = new PlaidApi(configuration);

var PUBLIC_TOKEN = null;
var ACCESS_TOKEN = null;
var ITEM_ID = null;

// @route GET api/plaid/accounts
// @desc Get all accounts linked with plaid for a specific user
// @access Private
router.get(
  "/accounts",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Account.find({ userId: req.user.id })
      .then((accounts) => res.json(accounts))
      .catch((err) => console.log(err));
  }
);

// @route POST api/plaid/accounts/add
// @desc Trades public token for access token and stores credentials in database
// @access Private
router.post(
  "/accounts/add",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    PUBLIC_TOKEN = req.body.public_token;

    const userId = req.user.id;
    const institution = req.body.metadata.institution;
    const { name, institution_id } = institution;

    const publicToken = req.body.public_token;
    try {
      const request = {
        public_token: publicToken,
      };
      const response = await client.itemPublicTokenExchange(request);
      ACCESS_TOKEN = await response.data.access_token;
      ITEM_ID = await response.data.item_id;
      const mungu = async () => {
        if (PUBLIC_TOKEN) {
          Account.findOne({
            userId: req.user.id,
            institutionId: institution_id,
          })
            .then((account) => {
              if (account) {
                console.log("Account already exists");
              } else {
                const newAccount = new Account({
                  userId: userId,
                  accessToken: ACCESS_TOKEN,
                  itemId: ITEM_ID,
                  institutionId: institution_id,
                  institutionName: name,
                });

                newAccount.save().then((account) => res.json(account));
              }
            })
            .catch((err) => {
              console.log("wow", err);
            }); // Mongo Error
        }
      };
      await mungu();
    } catch (error) {
      // handle error
      console.log("acces token exchange erro");
    }
  }
);

// @route DELETE api/plaid/accounts/:id
// @desc Delete account with given id
// @access Private
router.delete(
  "/accounts/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Account.findById(req.params.id).then((account) => {
      // Delete account
      account.remove().then(() => res.json({ success: true }));
    });
  }
);

// @route POST api/plaid/accounts/transactions
// @desc Fetch transactions from past 30 days from all linked accounts
// @access Private
router.post(
  "/accounts/transactions",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const now = moment();
    const today = now.format("YYYY-MM-DD");
    const thirtyDaysAgo = now.subtract(30, "days").format("YYYY-MM-DD");

    let transactions = [];

    const accounts = req.body;
    //console.log(accounts);
    if (accounts) {
      accounts.forEach(function (account) {
        ACCESS_TOKEN = account.accessToken;
        const institutionName = account.institutionName;
        const txnreq = {
          access_token: ACCESS_TOKEN,
          start_date: thirtyDaysAgo,
          end_date: today,
        };
        client
          .transactionsGet(txnreq)
          .then((response) => {
            //console.log(response);
            transactions.push({
              accountName: institutionName,
              transactions: response.data.transactions,
            });
            console.log(transactions);
            if (transactions.length === accounts.length) {
              res.json(transactions);
            }
          })
          .catch((err) => console.log(err));
      });
    }
  }
);
const connectToCluster = async (uri) => {
  try {
    let mongoClient = new MongoClient(uri);
    await mongoClient.connect();
    return mongoClient;
  } catch (err) {
    console.error("Connection to MongoDB Atlas failed!", err);
  }
};
// @route POST api/plaid/names
// @desc Fetch names from all user linked accounts
// @access Private
let mongoClient1, db1, collection1;
router.get("/names", async (req, res) => {
  try {
    let mongoClient = await connectToCluster(userURI);
    const db = mongoClient.db("Cluster0");
    const collection = db.collection("users");
    collection1 = db.collection("accounts");
    let time = Date.now();

    collection
      .find()
      .toArray()
      .then((users) => {
        res.json(users);
        console.log(`Took ${Date.now() - time}ms to run part 1`);
      });

    //await res.json(collection.find().toArray());
  } catch (err) {
    console.error("Failed to get names from MongoDB Atlas", err);
  }
});

// @route POST api/plaid/names
// @desc Fetch names from all bank accounts
// @access Private
router.get("/banknames", async (req, res) => {
  try {
    // const reqObjectID = new mongo.Types.ObjectId(req.body.usrid);
    collection1
      .find()
      .toArray()
      .then((users) => {
        res.json(users);
      });
    //await res.json(collection.find().toArray());
  } catch (err) {
    console.error("Failed to get names from MongoDB Atlas", err);
  }
});
router.get("/checking", async (req, res) => {
  let mongoClient2 = await connectToCluster(userURI);
  const db = mongoClient2.db("Cluster0");
  const collection = db.collection("users");
  try {
    collection
      .find()
      .toArray()
      .then((users) => {
        res.json(users);
      });

    //await res.json(collection.find().toArray());
  } catch (err) {
    console.error("Failed to get names from MongoDB Atlas", err);
  }
});
module.exports = router;
