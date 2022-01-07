"use strict";
exports.__esModule = true;
var express = require("express");
var patternRoutes_1 = require("./pattern/routes/patternRoutes");
var swaggerDoc = require('./swagger.json');
var app = express();
//enable swagger for development
if (process.env.NODE_ENV === 'Development') {
    var swaggerUI = require('swagger-ui-express');
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
    app.listen(5000, function () { return console.log("swagger ui listening on 5000"); });
}
app.use(express.json());
app.use(patternRoutes_1["default"]);
app.listen(8080, function () { return console.log("main api listening on 8080"); });
