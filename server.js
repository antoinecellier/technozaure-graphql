var express = require('express');
var compression = require('compression');
var fs = require('fs');
var app = express();

import Schema from './src/schema.js';
import { graphql } from 'graphql';

var bodyParser = require('body-parser');


var indexFile = fs.readFileSync('index.html', 'utf8');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.post('/graphql', function(req, res) {

  var query = req.body.query.replace("\n", "");
  graphql(Schema, query, null, req.body.queryVariables).then(function(data) {
    res.status(200).send(data);
  }).catch(function(err) {
    console.log(err);
    res.status(500).send(err);
  })

});


var port = 8080;
app.listen(port);
console.log("App started on port: " + port);
