const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server ...');
  }

  console.log('Connected to MongoDB server!');

  const db = client.db('TodoApp');

  // deleteMany
  // db.collection('Todos')
  //   .deleteMany({ text: 'Eat lunch' })
  //   .then(result => console.log(result))
  //   .catch(err => console.log('Error:', err))

  // deleteOne
  // db.collection('Todos')
  //   .deleteOne({ text: 'Eat lunch' })
  //   .then(result => console.log(result))
  //   .catch(err => console.log('Error:', err))

  // findOneAndDelete
  db.collection('Todos')
    .findOneAndDelete({ completed: false })
    .then(result => console.log(result))
    .catch(err => console.log(err))

  // client.close();
});
