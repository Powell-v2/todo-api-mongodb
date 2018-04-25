const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// const id = '5addc146fbf88e3f1899463f11';
//
// if (!ObjectID.isValid(id)) {
//   console.log('id not valid');
// }

// Todo.find({ _id: id })
//   .then(todos => console.log('Todos:', todos));
//
// Todo.findOne({ _id: id })
//   .then(todo => console.log('Todo:', todo));

// Todo.findById(id)
//   .then(todo => {
//     if (!todo) return console.log('id not found');
//     console.log('Todo by ID:', todo)
//   })
//   .catch((e) => {
//     console.log(e);
//   });

const id = '5adcb5d2fe692c385a69d217';

User.findById(id)
  .then((user) => {
    if (!user) {
      return console.log('User not found');
    }
    console.log('User:', JSON.stringify(user, undefined, 2));
  })
  .catch((e) => console.log(e))
