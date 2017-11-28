'use strict';

const express = require('express');
const PORT = 4200;
const app = express();
app.use("/", express.static(__dirname+"/dist"));

app.listen(PORT);
console.log("running:")