/*jslint node:true*/
'use strict';
/**
 * return all uppercase and lowercase letters of the standard latin alphabet as an array.
 * @returns {array} all uppercase and lowercase letters of the standard latin alphabet as an array
 */
var getAlphabetAsArray = function () {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
};

var getFinalStateFromJigsawBlock = function (block, preparedStates) {
    var dataItem = global.materialsDataMap[block.nbt.final_state],
        i = 0
    ;
    if (dataItem.hasOwnProperty('ignoreProperties') && dataItem.ignoreProperties) {
        for (i; i < preparedStates.length; i += 1) {
            if (preparedStates[i].dataName === block.nbt.final_state) {
                return preparedStates[i].state;
            }
        }
    } else {
        // TODO
        console.log("Properties have to be checked. This is not implemented yet. Please contact the developer");
        return -1;
    }
};

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
    
    global.vLog(['\nPreparing states from simplified palette data:', simplifiedPaletteData]);
    
    for (i; i < simplifiedPaletteData.length; i += 1) {

        paletteItem = simplifiedPaletteData[i];
        global.vLog(['\nRetrieved paletteItem:', paletteItem]);
        
        dataItem = global.materialsDataMap[paletteItem.Name];
        global.vLog(['Matching dataItem:', dataItem]);
        
        resultItem = { state: i, dataName: paletteItem.Name };
        
        if (dataItem.hasOwnProperty('ignoreState') && dataItem.ignoreState) {
            // Skip Properties assignment
            resultItem.ignoreState = true;
            global.vLog('\nCaught ignored state, skipping data item');
        } else {
            resultItem.name = dataItem.text;
            
            assignProperties = paletteItem.hasOwnProperty('Properties')
                && dataItem.hasOwnProperty('Properties')
                && (!dataItem.hasOwnProperty('ignoreProperties') || !dataItem.ignoreProperties)
            ;
            
            if (assignProperties) {
                
                global.vLog('\nTrying to assign properties for paletteItem...');
                
                j = 0;
                propKeys = Object.keys(paletteItem.Properties);
                
                if (propKeys.length > 0) {
                    
                    global.vLog(['\nFound properties in paletteItem:', propKeys]);
                
                    for (j; j < propKeys.length; j += 1) {
                        
                        global.vLog("\nLooking up paletteItem property '" + propKeys[j] + "' in dataItem...");
                    
                        if (dataItem.Properties.hasOwnProperty(propKeys[j])) {
                            
                            global.vLog("Found property '" + propKeys[j] + "' in dataItem.");
                            
                            propValue = dataItem.Properties[propKeys[j]][paletteItem.Properties[propKeys[j]]];
                            
                            resultItem.name += propValue;
                            resultItem.dataName += propValue;
                            
                            global.vLog("New resultItem name: " + resultItem.name);
                        } else {
                            global.vLog("dataItem property '" + propKeys[j] + "' not found.");
                        }
                    }
                }
            }   
        }
        
        global.vLog(['\nCreated prepared state object:', resultItem]);
        result.push(resultItem);
    }
    
    global.vLog(['\nPreparedStates:', result]);
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
        global.vLog('Argument ' + filename + ' is not of type string - file name cannot be split');
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
        i = 0,
        j = 0,
        result = {
            name: 'Village ' + cleanAndCapitalize(filename) + ' ' + filename,
            default: 'Layer 1',
            variables: {}
        }
    ;
    
    if (preparedStates.length > variables.length) {
        throw new Error('state count exceeds variables count - please contact developer');
    }
    
    for (i; i < preparedStates.length; i += 1) {
        if (!preparedStates[i].hasOwnProperty('ignoreState') || !preparedStates[i].ignoreState) {
            result.variables[i] = {
                id: variables[j],
                name: preparedStates[i].name
            };
            j += 1;
        }
    }
    
    global.vLog(['\nReturning blueprint variables map:', result]);
    return result;
};

module.exports = {
    createBlueprintData: function (simplifiedData, filenameWithoutExtension) {
        
        global.vLog('\nConstructing blueprint data...');
        
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
        
        global.vLog(['\nConstructing layers for dimensions:', layerCount]);
        
        
        // Create the 3-dimensional layers array to store state positions
        for (i; i < layerCount[1]; i += 1) {
            global.vLog('Constructing data for layer ' + i + '...');
            
            result.layers[i] = new Array(layerCount[2]);
            j = 0;
            for (j; j < layerCount[2]; j += 1) {
                result.layers[i][j] = new Array(layerCount[0]);
            }
        }
        
        global.vLog(['Constructed layers:', result.layers]);
        
        i = 0;
        j = 0;
        
        // Iterate through the blocks and check whether they can be applied to a layer.
        for (i; i < simplifiedData.blocks.length; i += 1) {
            
            block = simplifiedData.blocks[i];
            global.vLog(['\nChecking block:', block]);
            
            fill = ' ';
            pos = block.pos;
            
            if (block.hasOwnProperty('nbt')) {
                block.state = getFinalStateFromJigsawBlock(block, preparedStates);
            }
            
            if (result.metadata.variables.hasOwnProperty(block.state)) {
                global.vLog('\nFound state ' + block.state);
                fill = result.metadata.variables[block.state].id;
            }
            
            result.layers[pos[1]][pos[2]][pos[0]] = fill;
        }
        
        global.vLog(['Finished layers:', result.layers]);
        
        
        // TODO: Construct the blueprint data layer by layer
        
        return result;
    }
};