"use strict";
exports.__esModule = true;
exports.savePatterns = exports.loadPatterns = exports.bashExec = void 0;
var fs = require("fs");
var path = require("path");
var child_process_1 = require("child_process");
var file = path.resolve('assets', 'patterns.txt');
var bashExec = function () {
    var dest = '~/led_matrix';
    (0, child_process_1.spawn)('cp', [file, dest]);
    (0, child_process_1.spawn)('make', ['-C', dest]).stdout.on('data', function (data) {
        process.stdout.write(data.toString());
    });
};
exports.bashExec = bashExec;
var constructPattern = function (patternObject) {
    //extract and parse pattern size
    var numRowNumColString = patternObject.split('\n')[0];
    var rows = parseInt(numRowNumColString.split(',')[0]);
    var columns = parseInt(numRowNumColString.split(',')[1]);
    //extract the pattern and remove trailing newline (if any)
    var arr = patternObject.substring(numRowNumColString.length + 1).split('\n');
    var n = arr.indexOf("");
    if (n > 0)
        arr.splice(n, 1);
    //parse and construct the pattern itself 
    var pattern = [];
    arr.forEach(function (a) {
        var b = a.split(',');
        b = Array.from(b, function (i) { return parseInt(i); });
        pattern.push(b);
    });
    //return as a ready object
    var obj = {
        rows: rows,
        columns: columns,
        pattern: pattern
    };
    console.log("\n\nreading done.\ncontents:\n".concat(JSON.stringify(obj)));
    return obj;
};
var loadPatterns = function () {
    return new Promise(function (resolve, reject) {
        var rs = fs.createReadStream(file, 'utf-8');
        var content = "";
        rs.on('data', function (data) {
            content += data;
        })
            .once('end', function () {
            if (content.length === 0) {
                reject();
            }
            else {
                /*separate the pattern strings and parse each one.
                add the pattern object to an array which will be
                sent back to add to the response object*/
                var patternsArray_1 = [];
                var patternStrings = content.split('\n\n');
                patternStrings.forEach(function (pattern) {
                    patternsArray_1.push(constructPattern(pattern));
                });
                resolve(patternsArray_1);
            }
        });
    });
};
exports.loadPatterns = loadPatterns;
var savePatterns = function (patternObjectArray) {
    var ws = fs.createWriteStream(file, 'utf-8');
    patternObjectArray.forEach(function (p, i) {
        var rows = p.rows, columns = p.columns, pattern = p.pattern;
        if (rows === 0 || columns === 0) {
            throw 'invalid pattern!';
        }
        ws.write("".concat(rows, ",").concat(columns, "\n"));
        pattern.forEach(function (row) {
            ws.write("".concat(row, "\n"));
        });
        if (i !== patternObjectArray.length - 1)
            ws.write('\n');
    });
    ws.close();
};
exports.savePatterns = savePatterns;
