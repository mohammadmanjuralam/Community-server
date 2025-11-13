const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

//Middle ware
app.use(cors());
app.use(express.json());

app.listen(port, (req, res) => {
  console.log("server port is:", port);
});

//MONGDB URI
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // MongoDB Connect
    await client.connect();
    console.log("MongoDB Connected Successfully");

    // Database name
    const community_DB = client.db("community_cleanliness");
    const issueCollection = community_DB.collection("Issues");
    const userCollection = community_DB.collection("users");
    const contributionCollection = community_DB.collection("contributions");

    //ALL ROUTES START HERE
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

   

    // app.get("/issues", async (req, res) => {
    //   try {
    //     const limit = parseInt(req.query.limit) || 6; // default 6
    //     const cursor = issueCollection.find().sort({  _id:-1 }).limit(limit);
    //     const issues = await cursor.toArray();
    //     res.send(issues);
    //   } catch (error) {
    //     console.error("Error fetching issues:", error);
    //     res.status(500).send({ message: "Failed to fetch issues" });
    //   }
    // });

 

    // app.get("/my-issues/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const userIssues = await issueCollection.find({ email }).toArray();
    //   res.send(userIssues);
    // });

   

    // app.get("/issues/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await issueCollection.findOne(query);
    //   res.send(result);
    // });
  } catch (error) {}
}
run();
