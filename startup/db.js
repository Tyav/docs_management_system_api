import 'dotenv/config';

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;

export default (val) => {
	const uris = `mongodb+srv://${username}:${password}@dmsdb-ht5wo.mongodb.net/${database}`;
	val.connect(uris, { useNewUrlParser: true }, () => {
		console.log('connected to online dbAtlas...');
	});
};
