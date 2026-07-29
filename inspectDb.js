const mongoose = require('mongoose');
require('dotenv').config();

async function inspectDb() {
  await mongoose.connect(process.env.DATABASE_URL);
  const collection = mongoose.connection.db.collection('users');
  const users = await collection.find({}).toArray();
  console.log('Users count:', users.length);
  console.log(JSON.stringify(users, null, 2));
  await mongoose.disconnect();
}

inspectDb().catch(console.error);
