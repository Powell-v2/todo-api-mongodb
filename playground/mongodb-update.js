const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server ...');
  }

  console.log('Connected to MongoDB server!');

  const db = client.db('TodoApp');

  // findOneAndUpdate
  // db.collection('Todos')
  //   .findOneAndUpdate(
  //     {
  //       _id: new ObjectID('5adb5342f94d1389bb4bc620')
  //     }, {
  //       $set: {
  //         completed: true,
  //       }
  //     }, {
  //       returnOriginal: false,
  //     }
  //   )
  //   .then(result => console.log(result))
  //   .catch(error => console.log(error))

  db.collection('Users')
    .findOneAndUpdate(
      {
        _id: new ObjectID('5ad74f1534ce042d321aa904')
      }, {
        $inc: {
          age: 1,
        }
      }, {
        returnOriginal: false,
      }
    )
    .then(result => console.log(result))
    .catch(error => console.log(error))

  // client.close();
});
