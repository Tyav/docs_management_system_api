import 'dotenv/config';
import config from 'config';

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;

module.exports = val => {
	//const uris = `mongodb+srv://${username}:${password}@dmsdb-ht5wo.mongodb.net/${database}`;
	val.connect(config.get('database'), { useNewUrlParser: true }, () => {
		console.log('connected to online dbAtlas...');
	});
};
