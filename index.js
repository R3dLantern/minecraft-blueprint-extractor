/*jslint node:true*/
'use strict';
require('./block_data/ignored_blocks');
require('./block_data/materials_data_map');

var fs = require('fs'),
    nbt = require('prismarine-nbt'),
    argsReader = require('./util/argument_parser'),
    simplifier = require('./util/simplifier'),
    materialsListMaker = require('./materials_table/materials_table_maker');

/**
 * Deconstructs a given set of parsed NBT data into a more readable set of instructions that
 * can be transformed easier into the Gamepedia source code.
 * @param {object} parsedData a set of parsed NBT data.
 */
function constructReadableData(parsedData) {
    
    if (global.configuration.v) {
        console.log('Received data:');
        console.log(parsedData);
    }
    
    
    var simplifiedData = simplifier.simplifyObject(parsedData);
    if (global.configuration.v) {
        console.log('Simplified data:');
        console.log(simplifiedData);
    }
    
    // Save the overall size of the structure.
    var structureSize = { x: simplifiedData.size[0], y: simplifiedData.size[1], z: simplifiedData.size[2] };
    
    // Represents all block states of the structure, referencing the palette data and containing their position.
    // var rawBlocksList = parsedData['palette']['value']['value'];
    
    return {
        structureSize: structureSize,
        materialsList: materialsListMaker.getMaterialsListFromRawPalette(simplifiedData.palette)
    };
}

/**
 * Parse a given NBT file content string as JSON
 * @param {string} fileContents file content as a string. Must be valid NBT format.
 */
function parseFile(fileContents) {
    if (global.configuration.v) {
        console.log('Parsing file contents...');
    }
    nbt.parse(fileContents, function (error, parsedContent) {
        if (error) {
            throw error;
        }
        
        if (global.configuration.v) {
            console.log('File successfully parsed.');
        }
        
        var materialsList = constructReadableData(parsedContent).materialsList,
            i = 0;
        for (i; i < materialsList.length; i += 1) {
            console.log(materialsListMaker.toTableRowCommand(materialsList[i]));
        }
        
    });
}

argsReader.readArgumentsFromCli(require('minimist')(process.argv.slice(2)));
fs.readFile(global.configuration.file, function (error, data) {
    if (error) {
        throw error;
    }
    parseFile(data);
});