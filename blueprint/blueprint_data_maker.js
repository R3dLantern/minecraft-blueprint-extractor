/*jslint node:true*/
'use strict';
/**
 * return all uppercase and lowercase letters of the standard latin alphabet as an array.
 * @returns {array} all uppercase and lowercase letters of the standard latin alphabet as an array
 */
var getAlphabetAsArray = function () {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
};

var decodeFinalStateForJigsawBlock = function (final_state) {
    var result = {
        dataName: '',
        Properties: {}
    },
        foundProperties = final_state.match(/\[(.)*\]/g),
        i = 0,
        keyValue;
    
    if (foundProperties === null) {
        global.vLog('Blueprint Data Maker: No additional properties for final state found');
        result.dataName = final_state;
        return result;
    }
    
    result.dataName = final_state.slice(0, final_state.indexOf('['));
    foundProperties = foundProperties[0].slice(1, foundProperties[0].length - 1).split(',');
    
    global.vLog(['Blueprint Data Maker: secured properties for final state: ', foundProperties]);
    
    for (i; i < foundProperties.length; i += 1) {
        keyValue = foundProperties[i].split('=');
        global.vLog(['Blueprint Data Maker: applying property to final state: ', keyValue]);
        result.Properties[keyValue[0]] = keyValue[1];
    }
    
    global.vLog(['Blueprint Data Maker: Generated final state object: ', result]);
    return result;
}

/**
 * Resolve a jigsaw block state with a final state reference to its final state.
 * @param   {object} block          A given block with an 'nbt' property
 * @param   {object} preparedStates A set of prepared blueprint block states
 * @returns {number} the index of the final state of the given block within the prepared states
 * @throws {Error} The given block does not have an 'nbt' property
 */
var getFinalStateFromNbtBlock = function (block, preparedStates) {
    if (!block.hasOwnProperty('nbt')) {
        throw new Error('block has no nbt property');
    }
    
    if (!block.nbt.hasOwnProperty('final_state')) {
        if (block.nbt.hasOwnProperty('id')) {
            global.vLog('Blueprint Data Maker: Found implicit jigsaw block with state ' + block.nbt.id);
            return block.state;
        }
        throw new Error('No entry point for final state data found')
    }
    
    global.vLog('Blueprint Data Maker: Found jigsaw block with final state ' + block.nbt.final_state);
    
    var finalStateObj = decodeFinalStateForJigsawBlock(block.nbt.final_state),
        dataItem = global.materialsDataMap[finalStateObj.dataName],
        preparedStateValues = Object.values(preparedStates),
        propKeys = Object.keys(finalStateObj.Properties),
        i = 0,
        j,
        matching
    ;
    
    if (propKeys.length > 0) {
        
        global.vLog('Blueprint Data Maker: Trying to match properties for final state block...');
        
        if (dataItem.hasOwnProperty('ignoreProperties') && dataItem.ignoreProperties) {
            
            global.vLog('Blueprint Data Maker: Ignore flag for property found. Fetching by dataName...');
            
            for (i; i < preparedStateValues.length; i += 1) {
                if (preparedStateValues[i].dataName === finalStateObj.dataName) {
                    
                    global.vLog('Blueprint Data Maker: Found matching final state!');
                    
                    return i;
                }
            }
            throw new Error('Error getting final state');
        } else {
            // TODO
            for (i; i < preparedStateValues.length; i += 1) {
                if (preparedStateValues[i].dataName === finalStateObj.dataName && preparedStateValues[i].hasOwnProperty('Properties')) {
                    
                    global.vLog('Blueprint Data Maker: Found matching dataName - matching properties...');
                    
                    j = 0;
                    matching = 0;
                    for (j; j < propKeys.length; j += 1) {
                        if (preparedStateValues[i].Properties.hasOwnProperty(propKeys[j]) && preparedStateValues[i].Properties[propKeys[j]] === finalStateObj.Properties[propKeys[j]]) {
                            global.vLog('Blueprint Data Maker: Found matching property ' + propKeys[j] + ' with value ' + finalStateObj.Properties[propKeys[j]]);
                            matching += 1;
                        }
                    }
                    if ((matching + 1) === propKeys.length) {
                        global.vLog('Blueprint Data Maker: Found matching final state!');
                        return i;
                    }
                    
                    throw new Error('Error getting final state');
                }
            }
            throw new Error('Error getting final state');
        }
    }
    
    for (i; i < preparedStateValues.length; i += 1) {
        if (preparedStateValues[i].dataName === finalStateObj.dataName) {
            return i;
        }
    }
                
    throw new Error('Error getting final state');
};

var getReferencedStateFromAmbigousBlock = function (block, preparedStates) {
    
    global.vLog('Blueprint Data Maker: Scouting for an ambiguous block...');
    
    
    var dataItem = global.materialsDataMap[preparedStates[block.state].dataName],
        keys,
        i;
    
    if (!dataItem.hasOwnProperty('reference')) {
        return block.state;
    }
    
    global.vLog('Blueprint Data Maker: Found a reference to state ' + dataItem.reference);
    i = 0;
    keys = Object.keys(preparedStates);
    for (i; i < keys.length; i += 1) {
        if (preparedStates[keys[i]].dataName === dataItem.reference) {
            return preparedStates[keys[i]].state;
        }
    }
}

var getPreparedStatesFromPalette = function (simplifiedPaletteData) {
    var i = 0,
        paletteItem,
        dataItem,
        resultItem,
        assignProperties = false,
        result = [],
        j,
        propKeys,
        propValue;
    
    global.vLog(['\nBlueprint Data Maker: Preparing states from simplified palette data:', simplifiedPaletteData]);
    
    for (i; i < simplifiedPaletteData.length; i += 1) {

        paletteItem = simplifiedPaletteData[i];
        global.vLog(['\nBlueprint Data Maker: Retrieved paletteItem:', paletteItem]);
        
        dataItem = global.materialsDataMap[paletteItem.Name];
        
        global.vLog(['Blueprint Data Maker: Matching dataItem:', dataItem]);
        
        if (dataItem.hasOwnProperty('reference')) {
            global.vLog('Blueprint Data Maker: Found reference to '+ dataItem.reference);
            dataItem = global.materialsDataMap[dataItem.reference];
            global.vLog(['Blueprint Data Maker: Referenced dataItem:', dataItem]);
        }
        
        resultItem = { dataName: paletteItem.Name };
        
        if (dataItem.hasOwnProperty('ignoreState') && dataItem.ignoreState) {
            // Skip Properties assignment
            resultItem.ignoreState = true;
            global.vLog('\nBlueprint Data Maker: Caught ignored state, skipping data item');
        } else {
            resultItem.name = dataItem.text;
            
            assignProperties = paletteItem.hasOwnProperty('Properties')
                && dataItem.hasOwnProperty('Properties')
                && (!dataItem.hasOwnProperty('ignoreProperties') || !dataItem.ignoreProperties)
            ;
            
            if (assignProperties) {
                
                global.vLog('\nBlueprint Data Maker: Trying to assign properties for paletteItem...');
                
                resultItem.Properties = paletteItem.Properties;
                
                j = 0;
                propKeys = Object.keys(paletteItem.Properties);
                
                if (propKeys.length > 0) {
                    
                    global.vLog(['\nBlueprint Data Maker: Found properties in paletteItem:', propKeys]);
                
                    for (j; j < propKeys.length; j += 1) {
                        
                        global.vLog("\nBlueprint Data Maker: Looking up paletteItem property '" + propKeys[j] + "' in dataItem...");
                    
                        if (dataItem.Properties.hasOwnProperty(propKeys[j])) {
                            
                            global.vLog("Blueprint Data Maker: Found property '" + propKeys[j] + "' in dataItem.");
                            
                            propValue = dataItem.Properties[propKeys[j]][paletteItem.Properties[propKeys[j]]];
                            
                            resultItem.name = propValue.replace(/\%/g, resultItem.name);
                            
                            global.vLog("Blueprint Data Maker: New resultItem name: " + resultItem.name);
                        } else {
                            global.vLog("Blueprint Data Maker: dataItem property '" + propKeys[j] + "' not found.");
                        }
                    }
                }
            }   
        }
        
        global.vLog(['\nBlueprint Data Maker: Created prepared state object:', resultItem]);
        result[i] = resultItem;
    }
    
    global.vLog(['\nBlueprint Data Maker: PreparedStates:', result]);
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
var getBlueprintVariablesMap = function (filename, preparedStates) {
    var variables = getAlphabetAsArray(),
        preparedStatesKeys = Object.keys(preparedStates),
        i = 0,
        j = 0,
        key,
        result = {
            name: 'Village ' + cleanAndCapitalize(filename) + ' ' + filename,
            default: 'Layer 1',
            variables: {}
        }
    ;
    
    if (preparedStatesKeys.length > variables.length) {
        throw new Error('state count exceeds variables count - please contact developer');
    }
    
    for (i; i < preparedStatesKeys.length; i += 1) {
        key = preparedStatesKeys[i];
        if (!preparedStates[key].hasOwnProperty('ignoreState') || !preparedStates[key].ignoreState) {
            result.variables[i] = {
                id: variables[j],
                name: preparedStates[key].name
            };
            j += 1;
        }
    }
    
    global.vLog(['\nBlueprint Data Maker: Returning blueprint variables map:', result]);
    return result;
};

module.exports = {
    createBlueprintData: function (simplifiedData, filenameWithoutExtension) {
        
        global.vLog('\nBlueprint Data Maker: Constructing blueprint data...');
        
        var layerCount = simplifiedData.size, // Extract the structure size
            variables = getAlphabetAsArray(),
            preparedStates = getPreparedStatesFromPalette(simplifiedData.palette),
            result = {
                metadata: getBlueprintVariablesMap(filenameWithoutExtension, preparedStates),
                layers: new Array(layerCount[1])
            },
            i = 0,
            j,
            block,
            fill,
            pos
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
        j = 0;
        
        // Iterate through the blocks and check whether they can be applied to a layer.
        for (i; i < simplifiedData.blocks.length; i += 1) {
            
            block = simplifiedData.blocks[i];
            global.vLog(['\nBlueprint Data Maker: Checking block:', block]);
            
            fill = ' ';
            pos = block.pos;
            
            if (block.hasOwnProperty('nbt')) {
                block.state = getFinalStateFromNbtBlock(block, preparedStates);
            }
            
            block.state = getReferencedStateFromAmbigousBlock(block, preparedStates);
            
            if (result.metadata.variables.hasOwnProperty(block.state)) {
                global.vLog('Found state ' + block.state);
                fill = result.metadata.variables[block.state].id;
            }
            
            result.layers[pos[1]][pos[2]][pos[0]] = fill;
        }
        
        global.vLog(['Blueprint Data Maker: Finished layers:', result.layers]);
        
        
        // TODO: Construct the blueprint data layer by layer
        
        return result;
    }
};