const express = require('express');
const path = require('path');
const app = express();
const { runGetList, runAddNewToDo } = require('./grpc-client');
const bodyParser = require('body-parser');

app.use('/build', express.static(path.resolve(__dirname, '../../build')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../app/index.html'));
});

app.get('/getList', (req, res) => {
  runGetList(res);
});

app.post('/add', (req, res) => {
  runAddNewToDo(req.body, res);
});

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
