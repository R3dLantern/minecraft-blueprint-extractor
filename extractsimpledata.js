/*jslint node:true*/
'use strict';

var fs = require('fs'),
    nbt = require('prismarine-nbt'),
    argsReader = require('./util/argument_parser'),
    simplifier = require('./util/simplifier')
;

/**
 * Parse a given NBT file content string as JSON and output it to a file.
 * @param {string} data file content as a string. Must be valid NBT format.
 */
function parseFile(data) {
    global.vLog('Parsing file contents...');
    nbt.parse(data, function (error, parsed) {
        if (error) {
            throw error;
        }
        
        global.vLog(['File successfully parsed.\nReceived data:', parsed]);
    
        var simplifiedData = simplifier.simplifyObject(parsed);
        
        global.vLog(['Simplified data:', simplifiedData, 'Simplified data will be written to ' + global.configuration.s]);
        
        if (!fs.existsSync('./output')) {
            fs.mkdirSync('./output');
        }
        
        fs.writeFile(global.configuration.s, JSON.stringify(simplifiedData, null, "\t"), function (error) {
            if (error) {
                throw error;
            }
            console.log("File has been written to " + global.configuration.s + "!");
        });
    });
}

argsReader.readArgumentsFromCli(require('minimist')(process.argv.slice(2)));
console.log('Generating simple data...\n\n');
fs.readFile(global.configuration.f, function (error, data) {
    if (error) {
        throw error;
    }
    var filename = global.configuration.f;
    filename = filename.substr(filename.lastIndexOf('/') + 1, filename.length - 1);
    filename = filename.substr(0, filename.lastIndexOf('.'));
    parseFile(data);
});