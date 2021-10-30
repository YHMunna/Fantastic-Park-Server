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
    const ordersCollection = database.collection("order");

    //POST Api for addservice
    app.post("/addService", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.send(result.insertedId);
    });
    //GET API for show all service
    app.get("/services", async (req, res) => {
      const result = await servicesCollection.find({}).toArray();
      res.send(result);
    });
    //Add Ride
    app.post("/addRide", async (req, res) => {
      const result = await ordersCollection.insertOne(req.body);
      res.send(result);
      // console.log(result);
    });
    //Get my orders from order collection
    app.get("/myOrders/:email", async (req, res) => {
      const result = await ordersCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });
    ////Get manage orders from order collection
    app.get("/manageOrders", async (req, res) => {
      const result = await ordersCollection.find({}).toArray();
      res.send(result);
    });
    //delete from all orders
    app.delete("/deleteOrder/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: id };
      // console.log(query);
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
      // console.log(result);
    });

    //get single service for update
    app.get("/updateProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.send(result);
    });
    //put single service for update
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const updatedInfo = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          image: updatedInfo.image,
          name: updatedInfo.name,
          price: updatedInfo.price,
          details: updatedInfo.details,
        },
      };
      const result = await servicesCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
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
