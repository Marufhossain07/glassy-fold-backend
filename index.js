const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();





// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vo0jwvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const itemsCollection = client.db('itemsDB').collection('items');

    app.get('/items', async(req,res)=>{
        const cursor = itemsCollection.find();
        const result = await cursor.toArray();
        res.send(result)
      })

      app.post('/items', async(req,res)=>{
        const item = req.body;
        const result = await itemsCollection.insertOne(item);
        res.send(result)
      })
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('Server Running')
})

app.listen(port, (req,res)=>{
    console.log(`your server is running on ${port}`)
})