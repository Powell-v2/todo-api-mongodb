const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server ...');
  }

  console.log('Connected to MongoDB server!');

  const db = client.db('TodoApp');

  db.collection('Users')
    .find({ name: 'Roberto' })
    .toArray()
    .then(users => console.log('Users named Roberto:', JSON.stringify(users, undefined, 2)))
    .catch(err => console.log('Error:', err))

  client.close();
});
