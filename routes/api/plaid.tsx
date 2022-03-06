const mongo = require("mongoose");

const express = require("express");
const plaid = require("plaid");
const twilio = require("twilio");

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
const Alerts = require("../../models/Alerts");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);

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
const accountSid = "AC7bcbf56ba60248d401cee60239c3848d";
const authToken = "6d0c684084afe05b96374b1d05c81cfe";
const twclient = require("twilio")(accountSid, authToken);
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
let mongoClient1, db1, collection1, collection2;
let alertcoll;
router.get("/names", async (req, res) => {
  try {
    let mongoClient = await connectToCluster(userURI);
    const db = mongoClient.db("Cluster0");
    const db1 = mongoClient.db("Cluster1");
    const collection = db.collection("users");
    collection1 = db.collection("accounts");
    //collection2 = db.collection("company");
    alertcoll = db1.collection("alerts");

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

// @route POST api/plaid/add
// @desc Add all alerts to the database which will be monitored
// @access Private
router.post("/addAlert", async (req, res) => {
  try {
    alertcoll.findOne({ accessToken: req.body.accessToken }).then((alert) => {
      //console.log(typeof req.body.accessToken);
      alertcoll.remove({ accessToken: req.body.accessToken });
      //console.log(alert);
      const newAlert = new Alerts(req.body);
      newAlert.save();
    });
  } catch (err) {
    console.error("Failed to insert alerts in database", err);
  }
});

router.get("/makealert", async (req, res) => {
  try {
    alertcoll
      .find()
      .toArray()
      .then((alert) => {
        // now here we have an array of alerts and we have to perform the twilio things for each of them
        const now = moment();
        const today = now.format("YYYY-MM-DD");
        for (var ind = 0; ind < alert.length; ind++) {
          const curAccessToken = alert[ind].accessToken;
          const AMOUNT = alert[ind].amount;
          const MSG = alert[ind].message;
          const EMAIL = alert[ind].email;
          const CELL = alert[ind].cell;
          const FNAME = alert[ind].fname;
          const CLIENTNAME = alert[ind].clientname;
          const TXTBODY = alert[ind].fullTXTmessage;
          const txnreq = {
            access_token: curAccessToken,
            start_date: alert[ind].lasttxn,
            end_date: today,
          };
          client
            .transactionsGet(txnreq)
            .then((response) => {
              const transactions = response.data.transactions;
              //console.log(response.data);
              for (var counter = 0; counter < transactions.length; counter++) {
                var transaction = transactions[counter];
                //console.log(transaction.amount);
                if (
                  Math.abs(transaction.amount) >= AMOUNT ||
                  transaction.name.indexOf(MSG) != -1
                ) {
                  if (CELL !== undefined) {
                    // twclient.messages
                    //   .create({
                    //     body: TXTBODY,
                    //     from: "+17406854671",
                    //     to: CELL,
                    //   })
                    //   .then((message) => console.log(message.sid))
                    //   .catch((err) => console.log("Twilio error here", err));
                  }
                  if (EMAIL !== undefined) {
                    const msg = {
                      to: "vatsalsharma376@yahoo.com", // Change to your recipient
                      from: "claimyouraid3@gmail.com", // Change to your verified sender
                      subject: "New transaction recieved from Claimyouraid",
                      text: "and easy to do anywhere, even with Node.js",
                      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
                    };
                    sgMail
                      .send(msg)
                      .then((response) => {
                        console.log(response[0].statusCode);
                        console.log(response[0].headers);
                      })
                      .catch((error) => {
                        console.error(error.response.body.errors[0]);
                      });
                  }
                }
              }
            })
            .catch((err) => console.log("Transactions fetching error: ", err));
        }
      });
  } catch (err) {
    console.error("Failed to make alerts in database", err);
  }
});
module.exports = router;
