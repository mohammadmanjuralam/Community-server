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
    await client.connect();
    console.log("MongoDB Connected Successfully");

    // Database name 
    const db = client.db("community_cleanliness");
    const issueCollection = db.collection("issues");
    const contributionCollection = db.collection("contributions");

    //ALL ROUTES START HERE
  } catch (error) {}
}
run();
