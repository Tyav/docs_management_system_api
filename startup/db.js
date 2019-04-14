import 'dotenv/config';

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;

module.exports = (val) => {
	const uris = 'mongodb://localhost/docs-test';
	if (process.env.NODE_ENV !== 'test') {
		uris = 'mongodb://localhost/DMSapp';
	}

	//const uris = `mongodb+srv://${username}:${password}@dmsdb-ht5wo.mongodb.net/${database}`;
	val.connect(uris, { useNewUrlParser: true }, () => {
		console.log('connected to online dbAtlas...');
	});
};
