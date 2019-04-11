import 'dotenv/config';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import express from 'express';
const app = express();

//IMPORT ROUTES
import users from './api/v1/routes/users';

import db from './startup/db';
db(mongoose);


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//SWAGGER DOCS ROUTE
import swag from './startup/swagger';
swag(app)

//USERS API ROUTES
app.use('/api/users', users);

const port = process.env.PORT || 5050;
const server = app.listen(port, () => {
	console.log(`listening to ${port}...`);
});

export { server };
