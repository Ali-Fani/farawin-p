"use strict";
const app = require("express")();
require('dotenv').config();
app.use(require("body-parser").json());
app.use(require("cookie-parser")());
app.use('/api/v1', require("./route"));
console.log("app listen on 8090");
app.listen(8090);
