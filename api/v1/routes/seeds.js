import express from 'express';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import faker from 'faker'

const router = express.Router();
import { User } from '../../../server/model/user';
import { Role } from '../../../server/model/role';

//SEEDS USERS' DATA TO DATABASE
router.post('/users', async(req, res)=>{
  await User.deleteMany({})
	let adminRole = await Role.findOne({title:'admin'});
	let regularRole = await Role.findOne({title:'regular'})
	let adminSeed = req.query.adminSeed || 4;
  let regularSeed = req.query.regularSeed || 16;
  const salt = await bcrypt.genSalt(10);
	let adminPassword = await bcrypt.hash('adminPassword', salt);
  let regularPassword = await bcrypt.hash('regularPassword', salt);
  // console.log('start')
	for (let i = 0; i < adminSeed; i++) {
		User.create({
			username: faker.internet.userName(),
			name: {
				firstName: faker.name.firstName(),
				lastName: faker.name.lastName()
			},
			email: faker.internet.email(),
			password: adminPassword,
			roleId: adminRole._id,
		})
	}
  for (let i = 0; i < regularSeed; i++) {
		await User.create({
			username: faker.internet.userName(),
			name: {
				firstName: faker.name.firstName(),
				lastName: faker.name.lastName()
			},
			email: faker.internet.email(),
			password: regularPassword,
			roleId: regularRole._id,
    })
    // console.log(admin)
  }
  //res.redirect(307,'documents')
  res.status(201).send('done')
})

router.post('/documents',async(req,res)=>{
  res.status(201).send('done')
})




module.exports = router

