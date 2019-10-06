let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let tasks = [];
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/tasks', (req, res) => res.send(tasks));
app.get('/tasks/:id', (req, res) => {
  let task = tasks.find(task => task.id === Number(req.params.id));
  res.send(task);
});

app.post('/tasks', (req, res) => {
  let task = {
    id: Date.now(),
    title: req.body.title,
    date: 'Monday, Jun 24, 16:00',
    location: req.body.location,
    type: req.body.type || 'electrician',
    tasks: ['unblock a toilet'],
    description: req.body.description
  }
  tasks.push(task);
  res.sendStatus(200);
});

app.put('/tasks/:id', (req, res) => {
  let task = tasks.find(task => task.id === Number(req.params.id));
  task.title = req.body.title;
  task.location = req.body.location;
  task.type = req.body.type;
  task.description = req.body.description;
  res.sendStatus(200);
});

app.delete('/tasks/:id', (req, res) => {
  let index = tasks.findIndex(task => task.id === Number(req.params.id));
  tasks.splice(index, 1);
  res.sendStatus(200);
});

app.listen(3333, () => console.log('API started'));