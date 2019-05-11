import Seeder from './cli';

Seeder.users().then(()=>{
  Seeder.documents();
});


