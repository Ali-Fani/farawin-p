"use strict";
const app = require("express")();
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/test';
require('dotenv').config();
app.use(require("body-parser").json());
app.use(require("cookie-parser")());
app.use('/api/v2', require("./route"));
console.log("app listen on 8090");
//Set up mongoose connection
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.listen(8091);
