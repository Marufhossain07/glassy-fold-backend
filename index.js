const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const categoryCollection = client.db('itemsDB').collection('categories');


    app.get('/categories', async(req,res)=>{
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/items', async (req, res) => {
      const cursor = itemsCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.post('/items', async (req, res) => {
      const item = req.body;
      const result = await itemsCollection.insertOne(item);
      res.send(result)
    })

    app.get('/items-from-email/:email', async (req, res) => {
      const myEmail = req.params.email;
      const query = { email: myEmail };
      const result = await itemsCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/items-from-sub/:sub', async (req, res) => {
      const sub = req.params.sub;
      const query = { sub: sub };
      const result = await itemsCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/items/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await itemsCollection.findOne(query)
      res.send(result)
    })

    app.get('/items/:email/:customization', async (req, res) => {
      const sort = req.params.customization;
      const myEmail = req.params.email;
      const query = { email: myEmail, customization: sort };
      const cursor = itemsCollection.find(query)
      const result = await cursor.toArray()
      res.send(result);
    })

    app.put('/items/:id', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updatedItem = req.body;
      const options = { upsert: true };
      const item = {
        $set: {
          item: updatedItem.item,
          sub: updatedItem.sub,
          description: updatedItem.description,
          price: updatedItem.price,
          rating: updatedItem.rating,
          customization: updatedItem.customization,
          time: updatedItem.time,
          stock: updatedItem.stock,
          photo: updatedItem.photo
        }
      }

      const result = await itemsCollection.updateOne(filter,item,options);
      res.send(result)
    })

    app.delete('/items/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await itemsCollection.deleteOne(query);
      res.send(result);
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


app.get('/', (req, res) => {
  res.send('Server Running')
})

app.listen(port, (req, res) => {
  console.log(`your server is running on ${port}`)
})