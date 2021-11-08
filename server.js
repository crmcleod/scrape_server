const express = require('express');
const app = express();
const cors = require('cors');
const http = require("http").Server(app);


const MongoClient = require('mongodb').MongoClient;
const createRouter = require('./helpers/create_routers.js');

app.use(express.json());
app.use(cors({credentials: true, origin: "*"}));

const uri = process.env.MDB_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect()
  .then((player) => {
    const db = player.db(process.env.MDB_DB);
    const mdb_collection = db.collection(process.env.MDB_COLLECTION);

    const mdb_router = createRouter(mdb_collection);
    app.use('/api/web_scrape', mdb_router);

  })
  .catch(console.err);

  http.listen(process.env.PORT, function() {
    console.log(`Listening on port ${this.address().port}`);
  });