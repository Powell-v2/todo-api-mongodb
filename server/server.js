const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

const Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  },
});

const dinnerTodo = new Todo({
  text: 'Cook dinner',
});

dinnerTodo.save()
  .then(doc => console.log('Saved todo:', doc))
  .catch(err => console.log('Unable to create todo :(', err))

const workoutTodo = new Todo({
  text: 'Work out',
  completed: false,
});

workoutTodo.save()
  .then(doc => console.log('Saved todo:', doc))
  .catch(err => console.log('Unable to create todo :(', err))
