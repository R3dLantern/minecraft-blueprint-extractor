/*jslint node:true*/
'use strict';

require('./block_data/ignored_blocks');
require('./block_data/materials_data_map');
require('./util/logger');

var fs = require('fs'),
    nbt = require('prismarine-nbt'),
    argsReader = require('./util/argument_parser'),
    simplifier = require('./util/simplifier'),
    materialsCodeWriter = require('./materials_table/materials_table_code_writer'),
    blueprintCodeWriter = require('./blueprint/blueprint_code_writer');

/**
 * Deconstructs a given set of parsed NBT data into a more readable set of instructions that
 * can be transformed easier into the Gamepedia source code.
 * @param {object} parsedData a set of parsed NBT data.
 */
function constructReadableData(parsedData, filenameWithoutExtension) {
    
    global.vLog(['\nParsed data:', parsedData]);
    
    var simplifiedData = simplifier.simplifyObject(parsedData);
    
    global.vLog(['\nSimplified data:', simplifiedData]);
    
    if (global.configuration.v) {
        console.log('Simplified data will be written to ' + global.configuration.s);
        if (!fs.existsSync('./output')) {
            fs.mkdirSync('./output');
		}
        fs.writeFile(global.configuration.s, JSON.stringify(simplifiedData, null, "\t"), function (error) {
            if (error) {
                throw error;
            }
        });
    }
    
    // Save the overall size of the structure.
    var structureSize = { x: simplifiedData.size[0], y: simplifiedData.size[1], z: simplifiedData.size[2] };
    
    // Represents all block states of the structure, referencing the palette data and containing their position.
    // var rawBlocksList = parsedData['palette']['value']['value'];
    
    return {
        blueprintCode: blueprintCodeWriter.generateBlueprintCode(simplifiedData, filenameWithoutExtension),
        materialsCode: materialsCodeWriter.generateTableCode(simplifiedData.palette, simplifiedData.blocks, structureSize.y)
    };
}

/**
 * Parse a given NBT file content string as JSON
 * @param {string} fileContents file content as a string. Must be valid NBT format.
 */
function parseFile(fileContents, filenameWithoutExtension) {
    
    global.vLog('Parsing file contents...');
    
    nbt.parse(fileContents, function (error, parsedContent) {
        if (error) {
            throw error;
        }
        
        global.vLog('File successfully parsed.');
        
        var readableData = constructReadableData(parsedContent, filenameWithoutExtension),
            materialsTableCode = readableData.materialsCode,
            blueprintCode = readableData.blueprintCode,
            i = 0
        ;
        
        console.log(materialsTableCode);
        console.log(blueprintCode);
        console.log('\n\nWriting to output file...');
        fs.writeFile('output/' + global.configuration.o, materialsTableCode + '\n\n' + blueprintCode, function (error) {
            if (error) {
                throw error;
            }
            console.log('Wrote to file. Finished!');
        });
    });
}

argsReader.readArgumentsFromCli(require('minimist')(process.argv.slice(2)));
console.log('Generating code...\n\n');
fs.readFile(global.configuration.file, function (error, data) {
    if (error) {
        throw error;
    }
    var filename = global.configuration.file;
    filename = filename.substr(filename.lastIndexOf('/') + 1, filename.length - 1);
    filename = filename.substr(0, filename.lastIndexOf('.'));
    
    parseFile(data, filename);
});