/*jslint node:true*/
'use strict';
/**
 * return all uppercase and lowercase letters of the standard latin alphabet as an array.
 * @returns {array} all uppercase and lowercase letters of the standard latin alphabet as an array
 */
var getAlphabetAsArray = function () {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
}

var getPreparedStatesFromPalette = function (simplifiedPaletteData) {
    var i = 0,
        paletteItem,
        dataItem,
        resultItem,
        result = [],
        j,
        propKeys;
    
    for (i; i < simplifiedPaletteData.length; i += 1) {
        /*
         * {
         *   Properties: { facing: 'north' },
         *   Name: 'minecraft:wall_torch'
         * }
         */
        paletteItem = simplifiedPaletteData[i];
        
        /*
         * {
         *   spriteType: 'BlockSprite',
         *   internalId: 'torch',
         *   link: 'Torch',
         *   text: 'Torch',
         *   Properties: {
         *     facing: {
         *       north: '',
         *       east: '-rot90',
         *       south: '-rot180',
         *       west: '-rot270'
         *     }
         *   }
         * }
         */
        dataItem = global.materialsDataMap[paletteItem.Name];
        
        resultItem = {};
        if (dataItem.hasOwnProperty('ignoreState') && dataItem.ignoreState) {
            resultItem.ignoreState = true;
        } else {
            resultItem.name = dataItem.text;
            if (dataItem.hasOwnProperty('Properties') && paletteItem.hasOwnProperty('Properties')) {
                j = 0;
                propKeys = Object.keys(paletteItem.Properties);
                for (j; j < paletteItem.Properties.length; j += 1) {
                    if (dataItem.Properties.hasOwnProperty(propKeys[j])) {
                        resultItem.name = resultItem.name + dataItem.Properties[paletteItem.Properties[propKeys[j]]];
                    }
                }
            }   
        }
        
        result.push(resultItem);
    }
    
    return result;
}

/**
 * Split a given structure block file name
 * @param   {string} filename given filename. Words must be separated by underscores, e.g. "file_name_to_split"
 * @returns {string} The filename without underscores and capitalized words, e.g. "File Name To Split"
 */
var cleanAndCapitalize = function (filename) {
    if (global.configuration.v) {
        console.log('Received filename:');
        console.log(filename);
    }
    
    if (typeof filename !== 'string') {
        if (global.configuration.v) {
            console.log('Argument ' + filename + ' is not of type string - file name cannot be split');
        }
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
}

/**
 * Creates the variables map for the blueprint
 * @param {string} filename the name of the structure block file.
 * @returns {objectr} an object containing all information for the blueprint header data
 */
var getBlueprintVariablesMap = function (filename, preparedStates) {
    var variables = getAlphabetAsArray(),
        i = 0,
        result = {
            name: 'Village ' + cleanAndCapitalize(filename) + ' ' + filename,
            default: 'Layer 1',
            variables: []
        }
    ;
    
    if (global.configuration.v) {
        console.log('preparedStates:');
        console.log(preparedStates);
    }
    
    if (preparedStates.length > variables.length) {
        throw new Error('state count exceeds variables count - please contact developer');
    }
    
    for (i; i < preparedStates.length; i += 1) {
        
        if (!preparedStates[i].hasOwnProperty('ignoreState') || !preparedStates[i].ignoreState) {
            result.variables.push({
                id: variables[i],
                name: preparedStates[i].name
            });
        }
    }
    
    return result;
}

module.exports = {
    createBlueprintData: function (simplifiedData, filenameWithoutExtension) {
        var layerCount = simplifiedData.size[1], // Extract the structure Y size
            variables = getAlphabetAsArray(),
            result = {
                metadata: getBlueprintVariablesMap(filenameWithoutExtension, getPreparedStatesFromPalette(simplifiedData.palette)),
                layers: []
            }
        ;
        
        // TODO: Construct the blueprint data layer by layer
        
        return result;
    }
};