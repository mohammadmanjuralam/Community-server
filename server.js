const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

//Middle ware
app.use(cors());
app.use(express.json());

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
    // await client.connect();
    console.log("MongoDB Connected Successfully");

    // Database name
    const community_DB = client.db("community_cleanliness");
    const issueCollection = community_DB.collection("Issues");
    const userCollection = community_DB.collection("users");
    const contributionCollection = community_DB.collection("contributions");

    //ALL ROUTES START HERE
    // Assuming you're using Express
    app.get("/contributions", async (req, res) => {
      const email = req.query.email;
      if (!email) {
        return res.status(400).json({ message: "Email query param missing" });
      }

      try {
        const contributions = await contributionCollection
          .find({ email: email })
          .toArray();
        res.json(contributions);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to load contributions" });
      }
    });
//my contribution
    app.post("/contributions", async (req, res) => {
      try {
        const contribution = req.body;
        const result = await contributionCollection.insertOne(contribution);
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to submit contribution" });
      }
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/Issues", async (req, res) => {
      try {
        const issues = await issueCollection.find().toArray();
        res.send(issues);
      } catch (err) {
        console.error("Error fetching issues:", err);
        res
          .status(500)
          .send({ success: false, message: "Failed to fetch issues" });
      }
    });

    app.get("/issues-limit", async (req, res) => {
      try {
        const limit = parseInt(req.query.limit) || 6;
        const cursor = issueCollection.find().sort({ _id: -1 }).limit(limit);
        const issues = await cursor.toArray();
        res.send(issues);
      } catch (error) {
        console.error("Error fetching issues:", error);
        res.status(500).send({ message: "Failed to fetch issues" });
      }
    });

    // app.get("/my-issues/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const userIssues = await issueCollection.find({ email }).toArray();
    //   res.send(userIssues);
    // });

    app.get("/my-issues", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { email: email };
      const result = await issueCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/issues", async (req, res) => {
      const issue = req.body;
      const result = await issueCollection.insertOne(issue);
      res.send(result);
    });

    app.put("/issues/:id", async (req, res) => {
      const id = req.params.id;
      const updated = req.body;
      const result = await issueCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updated }
      );
      res.send(result);
    });

    app.get("/issues/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const issue = await issueCollection.findOne({ _id: new ObjectId(id) });
        if (!issue) {
          return res.status(404).json({ message: "Issue not found" });
        }
        res.json(issue);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
      }
    });

    // app.get("/issues/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await issueCollection.findOne(query);
    //   res.send(result);
    // });

    app.delete("/issues/:id", async (req, res) => {
      const id = req.params.id;
      const result = await issueCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
  } catch (error) {}
}
run();

app.listen(port, (req, res) => {
  console.log("server port is:", port);
});
