/*jslint node:true*/
'use strict';
var jigsawDecoder = require('../util/jigsaw_decoder');

/**
 * return all uppercase and lowercase letters of the standard latin alphabet as an array.
 * @returns {array} all uppercase and lowercase letters of the standard latin alphabet as an array
 */
var getAlphabetAsArray = function () {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
};

/**
 * Construct a list of prepared states that can be mapped against a variables map.
 * @param {array} simplifiedPaletteData     given palette data
 * @param {array} simplifiedBlocksData      given blocks data
 * @returns {array} a list of prepared states that can be mapped against a variables map
 */
var getPreparedStatesFromPaletteAndBlocks = function (simplifiedPaletteData, simplifiedBlocksData) {
    var i = 0,
        paletteItem,
        dataItem,
        resultItem,
        assignProperties,
        result = []
    ;

    for (i; i < simplifiedPaletteData.length; i += 1) {

        // Retrieve the paletteItem
        var paletteItem = simplifiedPaletteData[i],
            resultItem
        ;
        global.vLog(['\nBlueprint Data Maker: Retrieved paletteItem:', paletteItem]);

        // Retrieve the corresponding data item
        // If the item is a jigsaw item, we need to pull the final state data from the blocks
        if (paletteItem.Name === 'minecraft:jigsaw') {
            resultItem = jigsawDecoder.getJigsawPreparedStateOrDataItemFromBlocks(i, simplifiedBlocksData, true);
        } else {
            var dataItem = global.blockData[paletteItem.Name];
            if (dataItem.hasOwnProperty('ignoreState') && dataItem.ignoreState) {
                global.vLog('Blueprint Data Maker: Found ignorable state');
                continue;
            }

            global.vLog(['Blueprint Data Maker: Matching dataItem:', dataItem]);
            
            if (dataItem.hasOwnProperty('reference')) {
                global.vLog('Blueprint Data Maker: Found reference to '+ dataItem.reference);
                dataItem = global.blockData[dataItem.reference];
                global.vLog(['Blueprint Data Maker: Referenced dataItem:', dataItem]);
            }

            resultItem = { name: dataItem.text, states: [i] };
            var assignProperties = (
                (!dataItem.hasOwnProperty('ignoreProperties') || !dataItem.ignoreProperties)
                && dataItem.hasOwnProperty('Properties')
                && paletteItem.hasOwnProperty('Properties')
            );

            if (assignProperties) {
                global.vLog('Blueprint Data Maker: Found properties data. Trying to assign...');
                var propKeys = Object.keys(paletteItem.Properties);
                var j = 0;
                for (j; j < propKeys.length; j += 1) {
                    var propKey = propKeys[j];
                    var propValue = paletteItem.Properties[propKey];
                    if (dataItem.Properties.hasOwnProperty(propKey) && dataItem.Properties[propKey].hasOwnProperty(propValue)) {
                        global.vLog('Blueprint Data Maker: Found assignable property value ' + propKey + " -> " + propValue);
                        resultItem.name = dataItem.Properties[propKey][propValue].replace(/\%/g, dataItem.text);
                        j = propKeys.length;
                    }
                }
            } else if (dataItem.hasOwnProperty('defaultProperty')) {
                resultItem.name = dataItem.defaultProperty.replace(/\%/g, dataItem.text);
            }
        }

        if (result.length === 0) {
            result.push(resultItem);
        } else {
            var existing = result.findIndex((el) => el.name === resultItem.name);
            if (existing > -1) {
                result[existing].states.push(i);
            } else {
                result.push(resultItem);
            }
        }
    }

    return result;
};

/**
 * Split a given structure block file name
 * @param   {string} filename given filename. Words must be separated by underscores, e.g. "file_name_to_split"
 * @returns {string} The filename without underscores and capitalized words, e.g. "File Name To Split"
 */
var cleanAndCapitalize = function (filename) {
    
    global.vLog(['\nReceived filename:', filename]);
    
    if (typeof filename !== 'string') {
        global.vLog('Blueprint Data Maker: Argument ' + filename + ' is not of type string - file name cannot be split');
        return '';
    }
    
    var splitted = filename.split('_'),
        i = 0,
        tmp;
    
    for (i; i < splitted.length; i += 1) {
        tmp = splitted[i];
        splitted[i] = tmp.charAt(0).toUpperCase() + tmp.slice(1);
    }
    
    return splitted.join(' ');
};

/**
 * Creates the variables map for the blueprint
 * @param {string} filename the name of the structure block file.
 * @returns {objectr} an object containing all information for the blueprint header data
 */
var getBlueprintVariablesMap = function (simplifiedData, filename) {
    var variables = getAlphabetAsArray(),
        preparedStates = getPreparedStatesFromPaletteAndBlocks(simplifiedData.palette, simplifiedData.blocks),
        i = 0,
        result = {
            name: 'Village ' + cleanAndCapitalize(filename) + ' ' + filename,
            default: 'Layer 1',
            variables: []
        }
    ;
    
    if (preparedStates.length > variables.length) {
        throw new Error('state count exceeds variables count - please contact developer');
    }
    
    for (i; i < preparedStates.length; i += 1) {
        result.variables.push({
            key: variables[i],
            name: preparedStates[i].name,
            states: preparedStates[i].states
        });
    }
    
    global.vLog(['\nBlueprint Data Maker: Returning blueprint variables map:', result]);
    return result;
};

module.exports = {
    createBlueprintData: function (simplifiedData, filenameWithoutExtension) {
        
        global.vLog('\nBlueprint Data Maker: Constructing blueprint data...');
        
        var layerCount = simplifiedData.size, // Extract the structure size
            result = {
                metadata: getBlueprintVariablesMap(simplifiedData, filenameWithoutExtension),
                layers: new Array(layerCount[1])
            },
            i = 0,
            j = 0,
            block,
            fill,
            pos,
            stateIdx
        ;
        
        global.vLog(['\nBlueprint Data Maker: Constructing layers for dimensions:', layerCount]);
        
        // Create the 3-dimensional layers array to store state positions
        for (i; i < layerCount[1]; i += 1) {
            global.vLog('Blueprint Data Maker: Constructing data for layer ' + i + '...');
            
            result.layers[i] = new Array(layerCount[2]);
            j = 0;
            for (j; j < layerCount[2]; j += 1) {
                result.layers[i][j] = new Array(layerCount[0]);
            }
        }
        
        global.vLog(['Blueprint Data Maker: Constructed layers:', result.layers]);
        
        i = 0;
        
        // Iterate through the blocks and check whether they can be applied to a layer.
        for (i; i < simplifiedData.blocks.length; i += 1) {
            
            block = simplifiedData.blocks[i];
            global.vLog(['\nBlueprint Data Maker: Checking block:', block]);
            
            fill = ' ';
            pos = block.pos;

            stateIdx = result.metadata.variables.findIndex((el) => el.states.includes(block.state));
            if (stateIdx > -1) {
                fill = result.metadata.variables[stateIdx].key;
            }
            
            result.layers[pos[1]][pos[2]][pos[0]] = fill;
        }
        
        global.vLog(['Blueprint Data Maker: Finished layers:', result.layers]);
        
        return result;
    }
};