"use strict";
exports.__esModule = true;
exports.savePatterns = exports.loadPatterns = exports.executeRPiPatternDisplay = void 0;
var fs = require("fs");
var path = require("path");
var child_process_1 = require("child_process");
var file = path.resolve('assets', 'patterns.txt');
var executeRPiPatternDisplay = function () {
    (0, child_process_1.spawn)('cp', [file, process.env.RPI_DIR]);
    (0, child_process_1.spawn)('make', ['-C', process.env.RPI_DIR, 'run', "ARG=".concat(process.env.PATTERN_FILE)]).stdout.on('data', function (data) {
        process.stdout.write(data.toString());
    });
};
exports.executeRPiPatternDisplay = executeRPiPatternDisplay;
var constructPattern = function (patternObject) {
    //extract and parse pattern size
    var numRowNumColString = patternObject.split('\n')[0];
    var rows = parseInt(numRowNumColString.split(',')[0]);
    var columns = parseInt(numRowNumColString.split(',')[1]);
    //extract the pattern and remove trailing newline (if pattern is last one in file)
    var arr = patternObject.substring(numRowNumColString.length + 1).split('\n');
    var trailingNewlineIndex = arr.indexOf("");
    if (trailingNewlineIndex > 0) {
        arr.splice(trailingNewlineIndex, 1);
    }
    //parse and construct the pattern itself 
    var pattern = [];
    arr.forEach(function (rowString) {
        var currentRow = rowString.split(' ');
        currentRow = Array.from(currentRow, function (num) { return parseInt(num); });
        pattern.push(currentRow);
    });
    //return as a ready object
    var parsedPattern = {
        rows: rows,
        columns: columns,
        pattern: pattern
    };
    console.log("\n\nreading done.\ncontents:\n".concat(JSON.stringify(parsedPattern)));
    return parsedPattern;
};
var loadPatterns = function () {
    return new Promise(function (resolve, reject) {
        var readStream = fs.createReadStream(file, 'utf-8');
        var content = "";
        readStream.on('data', function (data) {
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
    var writeStream = fs.createWriteStream(file, 'utf-8');
    patternObjectArray.forEach(function (patternObject, i) {
        var rows = patternObject.rows, columns = patternObject.columns, pattern = patternObject.pattern;
        if (rows === 0 || columns === 0) {
            throw 'invalid pattern!';
        }
        writeStream.write("".concat(rows, ",").concat(columns, "\n"));
        pattern.forEach(function (row) {
            writeStream.write("".concat(row.join(' '), "\n"));
        });
        if (i !== patternObjectArray.length - 1)
            writeStream.write('\n');
    });
    writeStream.close();
};
exports.savePatterns = savePatterns;
