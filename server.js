const newrelic = require('newrelic');
const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');

const port = process.env.PORT || 3000;
const app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/home/:homeId', express.static(path.join(__dirname, 'public')));
app.use('/descriptions/:homeId', proxy({target: 'http://localhost:3002'}));
app.use('/descriptions', proxy({target: 'http://localhost:3002'}));

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});
