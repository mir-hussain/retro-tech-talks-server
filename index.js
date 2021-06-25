import express from "express";
import cors from "cors";
import mongodb from "mongodb";

//dotenv
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const MongoClient = mongodb.MongoClient;

const userName = process.env.USER_NAME;
const password = process.env.PASS;
const databaseName = process.env.DB_NAME;

const uri = `mongodb+srv://${userName}:${password}@cluster0.lfvk2.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const blogCollection = client
    .db(databaseName)
    .collection("blog");
  const adminCollection = client
    .db(databaseName)
    .collection("admin");
  console.log("error", err);
  console.log(databaseName, "database connected");

  const ObjectId = mongodb.ObjectId;

  app.post("/addBlog", (req, res) => {
    const newBlog = req.body;
    blogCollection.insertOne(newBlog).then((result) => {
      res.status(200).send(result.insertedCount > 0);
    });
  });

  app.get("/blogs", (req, res) => {
    blogCollection.find().toArray((err, blog) => {
      res.status(200).send(blog);
    });
  });

  app.delete("/deleteBlog/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    blogCollection
      .findOneAndDelete({ _id: id })
      .then((documents) => res.send(!!documents.value));
  });

  app.get("/getBlog/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    blogCollection
      .findOne({ _id: id })
      .then((documents) => res.send(documents));
  });

  app.post("/addAdmin", (req, res) => {
    const newService = req.body;
    adminCollection.insertOne(newService).then((result) => {
      res.status(200).send(result);
    });
  });

  app.get("/admins", (req, res) => {
    adminCollection.find().toArray((err, service) => {
      res.status(200).send(service);
    });
  });
});

app.get("/", (req, res) => {
  res.send("This is the server of Retro Tech Talks");
});

app.listen(PORT, () => {
  console.log("server is running on port: " + PORT);
});
