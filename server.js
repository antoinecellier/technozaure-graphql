const express = require('express');
const compression = require('compression');
const fs = require('fs');
const app = express();

import Schema from './src/schema.js';
import { graphql } from 'graphql';

const bodyParser = require('body-parser');
const indexFile = fs.readFileSync('index.html', 'utf8');

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
