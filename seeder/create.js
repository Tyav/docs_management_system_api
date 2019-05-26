import Seeder from './cli';

Seeder.users().then(()=>{
  Seeder.documents();
}).catch(err=>console.log(err));


