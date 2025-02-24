var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');

var cors = require('cors')
var port = process.env.port || 8081;
app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.json({ limit: '50mb' }));
app.use(cors());
var server = http.createServer(app);
server.listen(port, () => console.log('Running at port : ' + port));

let connectdb = require('./db/connectdb')
let userService = require("./services/userService")
let taskService = require("./services/taskService")

app.get('/testEndPoint', function (req, res) {
  var response = { "response": "Application is running" };
  res.json(response);
});


app.get('/getAllUser', async function (req, res) {
  userService.getAllUser().then(newTask => { res.status(201).json(newTask); }).catch(error => { res.status(error.StatusCode || 500).json({ message: error.message }); });
});

app.post('/addUser', function (req, res) {
  userService.addUser().then(newTask => { res.status(201).json(newTask); }).catch(error => { res.status(error.StatusCode || 500).json({ message: error.message }); });
});

app.post('/task', async function (req, res) {
  taskService.createNewTask(req.body).then(newTask => { res.status(201).json(newTask); }).catch(error => { res.status(error.StatusCode || 500).json({ message: error.message }); });
});

app.get('/task', async function (req, res) {
  taskService.getAll().then(newTask => { res.status(201).json(newTask); }).catch(error => { res.status(error.StatusCode || 500).json({ message: error.message }); });
});

app.delete('/task', async function (req, res) {
  taskService.deleteTask(req.query.taskId, req.query.taskId).then(newTask => { res.status(201).json(newTask); }).catch(error => { res.status(error.StatusCode || 500).json({ message: error.message }); });
});

app.put('/task', async function (req, res) {
  taskService.updateTask(req.body).then(newTask => { res.status(201).json(newTask); }).catch(error => { res.status(error.StatusCode || 500).json({ message: error.message }); });
});