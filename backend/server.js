const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const cors = require('cors');

let Todo = require('./todo.model');

const PORT = 4000;


app.use(cors());

app.use(bodyParser.json())

mongoose.connect("mongodb://127.0.0.1:27017/todos", { useNewUrlParser: true })
const connection = mongoose.connection;

connection.once('open', function() {
    console.log('connected to MongoDB successfully')
})

app.listen(PORT, function() {
    console.log(`Server runninng at PORT- ${PORT}`)
})


const todoRouter = express.Router();

app.use('/todos', todoRouter);


todoRouter.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            console.log(todos);
            res.json(todos);
        }
    });
});

todoRouter.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

todoRouter.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

todoRouter.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

