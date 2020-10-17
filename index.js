const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8pkoh.mongodb.net/<${process.env.DB_NAME}>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: 
    true });
client.connect(err => {
  const ordersCollection = client.db("creativeAgency").collection("orders");
  const adminsCollection = client.db("creativeAgency").collection("admins");

   app.post('/addAdmin',(req,res) =>{
      const adminEmail =req.body;
      adminsCollection.insertOne(adminEmail)
      .then(result =>{
          res.send(result.insertedCount>0);
      })
   })
   app.post('/isAdmin',(req,res) =>{
    const email =req.body.email;
    adminsCollection.find({email:email})
    .toArray((err,admins)=>{
        res.send(admins.length>0);
    })
 });
 
});


app.listen(process.env.PORT || port)
