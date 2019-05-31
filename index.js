/*jslint node:true*/
'use strict';
var fs = require('fs'),
    nbt = require('prismarine-nbt'),
    argsReader = require('./argument_parser'),
    materialsListMaker = require('./materials_table/materials_list_maker');

/**
 * Deconstructs a given set of parsed NBT data into a more readable set of instructions that
 * can be transformed easier into the Gamepedia source code.
 * @param {object} parsedData a set of parsed NBT data.
 */
function constructReadableData(parsedData) {
    // Save the overall size of the structure.
    var structureSize = {
        x: parsedData.value.size.value.value[0],
        y: parsedData.value.size.value.value[1],
        z: parsedData.value.size.value.value[2]
    };
    
    // Represents all block states of the structure, referencing the palette data and containing their position.
    // var rawBlocksList = parsedData['palette']['value']['value'];
    
    return {
        structureSize: structureSize,
        materialsList: materialsListMaker.getMaterialsListFromRawPalette(parsedData.value.palette.value.value)
    };
}

/**
 * Parse a given NBT file content string as JSON
 * @param {string} fileContents file content as a string. Must be valid NBT format.
 */
function parseFile(fileContents) {
    console.log('Parsing file contents...');
    nbt.parse(fileContents, function (error, parsedContent) {
        if (error) {
            throw error;
        }
        
        var materialsList = constructReadableData(parsedContent).materialsList,
            i = 0;
        for (i; i < materialsList.length; i += 1) {
            console.log(materialsListMaker.toTableRowCommand(materialsList[i]));
        }
        console.log('File successfully parsed.');
    });
}

argsReader.readArgumentsFromCli(require('minimist')(process.argv.slice(2)));
fs.readFile(global.configuration.file, function (error, data) {
    if (error) {
        throw error;
    }
    parseFile(data);
});