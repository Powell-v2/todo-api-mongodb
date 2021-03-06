const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

const secret = process.env.JWT_SECRET

const pavelOneId = new ObjectID();
const pavelTwoId = new ObjectID();

const todos = [
  {
    _id: new ObjectID(),
    text: 'first test todo',
    completed: true,
    completedAt: 101,
    _creator: pavelOneId,
  }, {
    _id: new ObjectID(),
    text: 'second test todo',
    _creator: pavelTwoId,
  }
];

const populateTodos = (done) => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
}

const users = [
  {
    _id: pavelOneId,
    email: 'pavel.one@err.org',
    password: 'passForPavelOne',
    tokens: [{
      access: 'auth',
      token: jwt.sign({ _id: pavelOneId, access: 'auth' }, secret).toString(),
    }]
  }, {
    _id: pavelTwoId,
    email: 'pavel.two@err.org',
    password: 'passForPavelTwo',
    tokens: [{
      access: 'auth',
      token: jwt.sign({ _id: pavelTwoId, access: 'auth' }, secret).toString(),
    }]
  },
];

const populateUsers = (done) => {
  User.remove({})
    .then(() => {
      const userOne = new User(users[0]).save();
      const userTwo = new User(users[1]).save();

      return Promise.all([ userOne, userTwo ]);
    })
    .then(() => done());
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers,
};
