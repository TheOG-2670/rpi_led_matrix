"use strict";
exports.__esModule = true;
var express = require("express");
var utils = require("../utils/patternUtils");
var app = express();
app.route('/patterns')
    .get(function (req, res) {
    utils.loadPatterns().then(function (content) {
        utils.bashExec();
        res.json({
            success: {
                response: 'display script successfully executed!',
                data: content
            }
        });
    })["catch"](function () {
        res.status(404).json({
            error: {
                response: "no pattern exists"
            }
        });
    });
})
    .post(function (req, res) {
    try {
        utils.savePatterns(req.body);
        res.status(201).json({
            success: {
                response: "patterns saved!"
            }
        });
    }
    catch (e) {
        res.status(401).json({
            error: {
                response: e.toString()
            }
        });
    }
});
exports["default"] = app;
