const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

//datbase connection start
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.unwup.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//datbase connection end.............

//functionality
async function run() {
  try {
    await client.connect();
    // console.log("database connected");
    const database = client.db("FantasyPark");
    const servicesCollection = database.collection("service");

    //POST Api
    app.post("/services", async (req, res) => {
      const service = {
        name: "waterkingdom",
        ticket: "250",
      };
      const result = await servicesCollection.insertOne(service);
      console.log(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
//functionality end...............

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
