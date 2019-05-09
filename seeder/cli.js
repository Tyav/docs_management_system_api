import _ from 'lodash';
import bcrypt from 'bcrypt';
import faker from 'faker';
import mongoose from 'mongoose';

import { User } from '../server/model/user';
import { Role } from '../server/model/role';
import { Document } from '../server/model/document';

//CREATE SEEDER CLASS
class Seeder {
	//SEEDS USERS' DATA TO DATABASE
	static async userSeeder() {
		await User.deleteMany({});
		let adminRole = await Role.findOne({ title: 'admin' });
		let regularRole = await Role.findOne({ title: 'regular' });
		let adminSeed = 4;
		let regularSeed = 16;
		const salt = await bcrypt.genSalt(10);
		let adminPassword = await bcrypt.hash('adminPassword', salt);
		let regularPassword = await bcrypt.hash('regularPassword', salt);
		// console.log('start')
		for (let i = 0; i < adminSeed; i++) {
			User.create({
				username : faker.internet.userName(),
				name     : {
					firstName : faker.name.firstName(),
					lastName  : faker.name.lastName(),
				},
				email    : faker.internet.email(),
				password : adminPassword,
				roleId   : adminRole._id,
			});
		}
		for (let i = 0; i < regularSeed; i++) {
			await User.create({
				username : faker.internet.userName(),
				name     : {
					firstName : faker.name.firstName(),
					lastName  : faker.name.lastName(),
				},
				email    : faker.internet.email(),
				password : regularPassword,
				roleId   : regularRole._id,
			});
		}
		let users = await User.find({ roleId: adminRole._id });
		console.log(users[0]);
	}

	//SEEDS DOCUMENTS' DATA TO DATABASE

	static async document() {
		await Document.deleteMany({});
		let users = await User.find({});
		let publicAccess = 20;
		let privateAccess = 12;
		let role = 8;
		let docAccess = [ 'private', 'public', 'role' ];

		//creating public
		let i = 0;
		while (i < publicAccess) {
			let userIndex = Math.floor(Math.random() * users.length);
			let titleText = Math.floor(Math.random() * 5) + 1;
			let paragraghCount = Math.floor(Math.random() * 3) + 1;
			let accessIndex = Math.floor(Math.random() * docAccess.length);
			let date = faker.date.between('9-9-2018', '5-7-2019');
			//console.log(faker.date.between('9-9-2018', '5-7-2019'))
			//console.log(faker.lorem.paragraphs(paragraghCount,'./n'))
			await Document.create({
				title       : faker.lorem.sentence(titleText, 8),
				content     : faker.lorem.paragraphs(paragraghCount, '.\n'),
				creatorId   : users[userIndex]._id,
				access      : 'public',
				categoryId  : mongoose.Types.ObjectId(),
				createdAt   : date,
				publishDate : date,
			});
			i++;
		}
		//creating private
		i = 0;
		while (i < privateAccess) {
			let userIndex = Math.floor(Math.random() * users.length);
			let titleText = Math.floor(Math.random() * 5) + 1;
			let paragraghCount = Math.floor(Math.random() * 3) + 1;
			let accessIndex = Math.floor(Math.random() * docAccess.length);
			let date = faker.date.between('9-9-2018', '5-7-2019');
			//console.log(faker.date.between('9-9-2018', '5-7-2019'))
			//console.log(faker.lorem.paragraphs(paragraghCount,'./n'))
			await Document.create({
				title       : faker.lorem.sentence(titleText, 8),
				content     : faker.lorem.paragraphs(paragraghCount, '.\n'),
				creatorId   : users[userIndex]._id,
				access      : 'private',
				categoryId  : mongoose.Types.ObjectId(),
				createdAt   : date,
				publishDate : date,
			});
			i++;
		}
		//creating role based documents
		i = 0;
		while (i < role) {
			let userIndex = Math.floor(Math.random() * users.length);
			let titleText = Math.floor(Math.random() * 5) + 1;
			let paragraghCount = Math.floor(Math.random() * 3) + 1;
			let accessIndex = Math.floor(Math.random() * docAccess.length);
			let date = faker.date.between('9-9-2018', '5-7-2019');
			await Document.create({
				title       : faker.lorem.sentence(titleText, 8),
				content     : faker.lorem.paragraphs(paragraghCount, '.\n'),
				creatorId   : users[userIndex]._id,
				access      : 'role',
				categoryId  : mongoose.Types.ObjectId(),
				createdAt   : date,
				publishDate : date,
				role        : users[userIndex].roleId,
			});
			i++;
		}
		console.log('done');
	}
}

Seeder.userSeeder();
Seeder.document();

//should recieve specifications by query
