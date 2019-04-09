import mongoose from 'mongoose';
import 'dotenv/config';
import bodyParser from 'body-parser';

import express from 'express';
const app = express();

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;


const uris = `mongodb+srv://${username}:${password}@dmsdb-ht5wo.mongodb.net/${database}`;
mongoose.connect(uris, { useNewUrlParser: true },()=>{
  console.log('connected to online dbAtlas...')
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 5050;
const server = app.listen(port, () => {
	console.log(`listening to ${port}...`);
});

export { server };
