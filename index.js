const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d94f49k.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    client.connect((err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    // Created Database -----------------------------------------------------
    const toyCollection = client.db('jewelryDB').collection('jewelrys');
    const locketCollection = client.db('jewelryDB').collection('locket');


    // Get Data from server ---------------------------------------------------------
    app.get('/jewelrys', async (req, res) => {
      let cursor = toyCollection.find();

      if (req.query.sort === 'asc') {
        cursor = cursor.sort({ price: 1 });
      } else if (req.query.sort === 'desc') {
        cursor = cursor.sort({ price: -1 });
      }

      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/locket', async (req, res) => {
      const result = await locketCollection.find().toArray();
      res.send(result);
    })

    // Update data in server ----------------------------------------------------
    app.get("/locket/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await locketCollection.findOne(query);
      res.send(result);
    });

    app.get("/locket/:_id", async (req, res) => {
      const id = req.params.id;
      const selectedJewelaryInfo = locket.find(n=> n._id == id)
      res.send(selectedJewelaryInfo);
    });

  
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('server is running')
})

app.listen(port, () => {
  console.log(`server is running on port: ${port}`)
})