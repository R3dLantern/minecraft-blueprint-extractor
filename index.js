/*jslint node:true*/
'use strict';
require('./block_data/ignored_blocks');
require('./block_data/materials_data_map');

var fs = require('fs'),
    nbt = require('prismarine-nbt'),
    argsReader = require('./util/argument_parser'),
    simplifier = require('./util/simplifier'),
    materialsCodeWriter = require('./materials_table/materials_table_code_writer'),
    blueprintMaker = require('./blueprint/blueprint_data_maker'),
    blueprintCodeWriter = require('./blueprint/blueprint_code_writer');

/**
 * Deconstructs a given set of parsed NBT data into a more readable set of instructions that
 * can be transformed easier into the Gamepedia source code.
 * @param {object} parsedData a set of parsed NBT data.
 */
function constructReadableData(parsedData, filenameWithoutExtension) {
    
    if (global.configuration.v) {
        console.log('Received data:');
        console.log(parsedData);
    }
    
    
    var simplifiedData = simplifier.simplifyObject(parsedData);
    if (global.configuration.v) {
        console.log('Simplified data:');
        console.log(simplifiedData);
    }
    
    if (global.configuration.o !== undefined) {
        if (global.configuration.v) {
            console.log('Simplified data will be written to output/' + global.configuration.o + '.json');
        }
		if (!fs.existsSync('./output')) {
            fs.mkdirSync('./output');
		}
        
        fs.writeFile('output/' + global.configuration.o + '.json', JSON.stringify(simplifiedData, null, "\t"), function (error) {
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
        blueprintData: blueprintMaker.createBlueprintData(simplifiedData, filenameWithoutExtension),
        materialsCode: materialsCodeWriter.generateTableCode(simplifiedData.palette, simplifiedData.blocks, structureSize.y)
    };
}

/**
 * Parse a given NBT file content string as JSON
 * @param {string} fileContents file content as a string. Must be valid NBT format.
 */
function parseFile(fileContents, filenameWithoutExtension) {
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
        
        var readableData = constructReadableData(parsedContent, filenameWithoutExtension),
            materialsTableCode = readableData.materialsCode,
            blueprintCode = blueprintCodeWriter.writeCodeFromBlueprintData(readableData.blueprintData),
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