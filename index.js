const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
 const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('creative'));
app.use(fileUpload());

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
  const reviewsCollection = client.db("creativeAgency").collection("reviews");
  const servicesCollection = client.db("creativeAgency").collection("services");

   app.post('/addAdmin',(req,res) =>{
      const adminEmail =req.body;
      adminsCollection.insertOne(adminEmail)
      .then(result =>{
          res.send(result.insertedCount>0);
      })
   })
    app.post('/addReview',(req,res) =>{
        const review =req.body;
        reviewsCollection.insertOne(review)
        .then(result =>{
            res.send(result.insertedCount>0);
        })
    });

    app.post('/addOrder',(req,res) =>{
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const price = req.body.price;
        const description = req.body.description;
        const serviceName = req.body.serviceName;
        
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        ordersCollection.insertOne({ name, email, image,price,description,serviceName })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
     });


     app.post('/addService',(req,res) =>{
        const file = req.files.file;
        const title = req.body.title;
        const description = req.body.description;
        
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        servicesCollection.insertOne({ title,description,image })
            .then(result => {
                res.send(result.insertedCount > 0);
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
