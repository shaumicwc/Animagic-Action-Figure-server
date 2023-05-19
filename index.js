const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4kfci0x.mongodb.net/?retryWrites=true&w=majority`;

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

        // Connect the client to the server	(optional starting in v4.7)
        const toyCollection = client.db('AnimeToys').collection('Toys')
        const categoryToyCollection = client.db('AnimeToys').collection('CategoryToys')

        app.post('/allToys', async (req, res) => {
            const body = req.body;
            const result = await toyCollection.insertOne(body)
            res.send(result)
        })
        app.get('/allToys', async (req, res) => {
            const result = await toyCollection.find().toArray();
            res.send(result)
        })
        app.get('/toyDetails/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) }
                const result = await toyCollection.findOne(query);
                res.send(result)
            } catch (error) {
                res.send(error.message)
            }
        })
        app.get('/myToys/:email', async (req, res) => {
            try {
                const email = req.params.email;
                const query = { email: email };
                const result = await toyCollection.find(query).toArray();
                res.send(result);
            } catch (error) {
                res.send(error.message)
            }
        });

        app.put('/myToys/:id', async (req, res) => {
            try {
              const id = req.params.id;
              const body = req.body;
              const query = { _id: new ObjectId(id) };
              const updatedDoc = {
                $set: {
                  price: body.price,
                  quantity: body.quantity,
                  description: body.description
                }
              };
              const result = await toyCollection.updateOne(query, updatedDoc);
              res.send({ result });
            } catch (error) {
              res.send(error.message);
            }
          });
          
          
          app.delete('/myToys/:id', async (req, res) => {
            try {
              const id = req.params.id; // Retrieve email from query parameters
              const query = { _id : new ObjectId(id) };
              const result = await toyCollection.deleteOne(query);
              res.send(result);
            } catch (error) {
              res.send(error.message)
            }
          });



        app.get('/categoryToyDetails', async (req, res) => {
            const result = await categoryToyCollection.find().toArray()
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.log(error.message)
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Toys data Here')
})

app.listen(port, (req, res) => {

})