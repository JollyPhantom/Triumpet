var express        = require('express');
var mongoose       = require('mongoose');

var app = express();

//Declare Database path and default to localhost
//Remember to set process.env.dbPath on your deployment environment
var dbPath         = process.env.dbPath || 'mongodb://localhost/triumpet';

//connect to mongo
mongoose.connect(dbPath, function(err, res){
  if(err){console.log('error :', err)}
});

//configure server with all middleware and routing
require('./config/router.js')(app, express);

//export our app required by server.js
module.exports = app;
