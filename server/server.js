const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Number,
    default: null,
  },
});

// const workoutTodo = new Todo({
//   text: 'Work out',
// });

// workoutTodo.save()
//   .then(doc => console.log('Saved todo:', doc))
//   .catch(err => console.log('Unable to create todo :(', err))

const User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
});

const userMay = new User({
  email: 'may@hotmail.com',
});

userMay.save()
  .then(doc => console.log('Saved user:', doc))
  .catch(err => console.log('Unable to create user :(', err))
