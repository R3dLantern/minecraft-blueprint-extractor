/*jslint node:true*/
'use strict';
var fs = require('fs'),
    nbt = require('prismarine-nbt');

function parseFile(fileContents) {
    console.log('Parsing file contents...');
    nbt.parse(fileContents, function (error, parsedContent) {
        if (error) {
            throw error;
        }
    });
}