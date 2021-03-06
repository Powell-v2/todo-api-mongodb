const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  const { token } = users[0].tokens[0]

  it('should create a new todo', (done) => {
    const text = 'Practice drums';

    request(app).post('/todos')
      .set('x-auth', token)
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(err => done(err));
      });
  });

  it('should not create a todo with invalid body data', (done) => {
    request(app).post('/todos')
      .set('x-auth', token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({})
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(err => done(err));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    const { token } = users[0].tokens[0]

    request(app).get('/todos')
      .set('x-auth', token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  const { token } = users[0].tokens[0]

  it('should return todo doc', (done) => {
    const hexId = todos[0]._id.toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo doc created by another user', (done) => {
    const hexId = todos[1]._id.toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    const hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123zxc')
      .set('x-auth', token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  const { token } = users[1].tokens[0]

  it('should remove a todo', (done) => {
    const hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId)
      })
      .end((err, res) => {
        if (err) return done(err);

        Todo.findById(hexId)
          .then((todo) => {
            expect(todo).toBeNull();
            done();
          })
          .catch(done);
      })
  });

  it('should not remove todo not owned by user', (done) => {
    const hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', token)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);

        Todo.findById(hexId)
          .then((todo) => {
            expect(todo).toBeDefined();
            done();
          })
          .catch(done);
      })
  });

  it('should return 404 if todo not found', (done) => {
    const hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', token)
      .expect(404)
      .end(done);
  });

  it ('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete(`/todos/123oops`)
      .set('x-auth', token)
      .expect(404)
      .end(done);
  });
})

describe('PATCH /todos/:id', () => {
  const { token } = users[1].tokens[0]

  it('should update the todo', (done) => {
    const hexId = todos[1]._id.toHexString();
    const text = 'Updated text';
    const completed = true;

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', token)
      .send({ text, completed })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof (res.body.todo.completedAt)).toBe('number');
      })
      .end((err, res) => {
        if (err) return done(err);

        Todo.findById(hexId)
          .then((todo) => {
            expect(todo.text).toEqual(text);
            done();
          })
          .catch(done);
      });
  });

  it('should not update todo not owned by user', (done) => {
    const hexId = todos[1]._id.toHexString();
    const text = 'Updated text';
    const completed = true;
    const anotherUsersToken = users[0].tokens[0].token

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', anotherUsersToken)
      .send({ text, completed })
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    const hexId = todos[1]._id.toHexString();
    const completed = false;

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', token)
      .send({ completed })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end((err, res) => {
        if (err) return done(err);

        Todo.findById(hexId)
          .then((todo) => {
            expect(todo.completedAt).toBe(null);
            done();
          })
          .catch(done);
      });
  });
})

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return a 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    const email = 'aaa@bbb.ccc';
    const password = 'hahaha0';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeDefined();
        expect(res.body._id).toBeDefined();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) return done(err);

        User.findOne({ email })
          .then((user) => {
            expect(user).toBeDefined();
            expect(user.password).not.toBe(password);
            done();
          })
          .catch(done);
      });
  });

  it('should return validation errors for invalid request', (done) => {
    const email = 'a@b.c';
    const password = 'haha';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    const email = 'pavel.one@err.org';
    const password = 'hahaha0';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[0].email,
        password: users[0].password,
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeDefined();
      })
      .end((err, res) => {
        if (err) return done(err);

        User.findById(users[0]._id)
          .then((user) => {
            expect(user.tokens[1].access).toBe('auth');
            expect(user.tokens[1].token).toBe(res.headers['x-auth']);
            done();
          })
          .catch(done);
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: 'yikes',
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).not.toBeDefined();
      })
      .end((err, res) => {
        if (err) return done(err);

        User.findById({ _id: users[1]._id })
          .then((user) => {
            expect(user.tokens.length).toBe(1);
            done();
          })
          .catch(done);
      })
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    const { token }= users[0].tokens[0]

    request(app)
      .delete('/users/me/token')
      .set('x-auth', token)
      .end((err, res) => {
        if (err) return done(err);

        User.findById(users[0]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(done);
      });
  });
});
