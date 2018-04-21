const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server ...');
  }

  console.log('Connected to MongoDB server!');

  const db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text: 'Smth to do',
  //   completed: false,
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo.', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  db.collection('Users').insertOne({
      name: 'Pedro',
      age: '33',
      location: 'Santa Clarita',
    }, (err, result) => {
      if (err) {
        return console.log('Unable to insert user.', err);
      }
    
      console.log(JSON.stringify(result.ops, undefined, 2));
  });

  client.close();
});
