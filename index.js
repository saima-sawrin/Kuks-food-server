const express = require('express');
const cors = require('cors');


const { MongoClient, ServerApiVersion , ObjectId} = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

// middle wares
app.use(cors());
app.use(express.json());

const uri =`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@cluster0.9wy3smt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
try {
const serviceCollection = client.db('Kuks_Food').collection('Services');
const reviewCollection = client.db('Kuks_Food').collection('Review');


app.get('/services', async (req, res) => {
const query = {}
const cursor = serviceCollection.find(query);
const services = await cursor.limit(3).toArray();
res.send(services);
});
app.get('/allServices', async (req, res) => {
const query = {}
const cursor = serviceCollection.find(query).sort({price:1});
const allServices = await cursor.toArray();
res.send(allServices);
});

app.post('/allServices', async (req, res) => {
const Service = req.body;
const result = await serviceCollection.insertOne(Service);
res.send(result);
});

app.get('/allServices/:id', async (req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id) };
    const serviceDetails = await serviceCollection.findOne(query);
    console.log(serviceDetails)
    res.send(serviceDetails);
    });

    // Review

    app.get('/allReview', async (req, res) => {
        const query = {}
        const cursor =reviewCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
        });

        // app.get('/allReview/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = {_id: new ObjectId(id) };
        //     const reviewDetails = await serviceCollection.findOne(query);
        //     console.log(reviewDetails)
        //     res.send(reviewDetails);
        //     });

    app.post('/allReview', async (req, res) => {
        const review = req.body;
        const result = await reviewCollection.insertOne(review);
        res.send(result);
        });
        app.delete('/allReview/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
        app.put('/reviews/:id',  async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const filter= { _id: new ObjectId(id) }
            const updatedDoc = {
            $set:{
            status: status
            }
            }
            const result = await reviewCollection.updateOne(filter, updatedDoc);
            res.send(result);
            })
            
        // app.put('/allReview/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: new ObjectId(id) }
        //     const options = { upsert: true };
        //     const updatedDoc = {
        //         $set: {
        //             role: 'admin'
        //         }
        //     }
        //     const result = await reviewCollection.updateOne(filter, updatedDoc, options);
        //     res.send(result);
        // });

}
finally {

}

}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
res.send('Kuks_Food server is running')
})

app.listen(port, () => {
console.log(`Kuks_Food server running on ${port}`);
})