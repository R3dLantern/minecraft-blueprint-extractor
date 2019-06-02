/*jslint node:true*/
'use strict';
/**
 * return all uppercase and lowercase letters of the standard latin alphabet as an array.
 * @returns {array} all uppercase and lowercase letters of the standard latin alphabet as an array
 */
var getAlphabetAsArray = function () {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
}

var getDistinctAndIgnoredStatesFromPalette = function (simplifiedPaletteData) {
    var i = 0,
        paletteItem,
        dataItem,
        result = {
            allStates: [],
            ignoredStates: [],
        };
    
    for (i; i < simplifiedPaletteData.length; i += 1) {
        paletteItem = simplifiedPaletteData[i];
        if (global.ignoredBlocks.includes(paletteItem.Name)) {
            result.ignoredStates.push(i);
        }
        dataItem = global.materialsDataMap[paletteItem.Name];
    }
}

module.exports = {
    createBlueprintData: function (simplifiedData) {
        var layerCount = simplifiedData.size[1], // Extract the structure Y size
            variables = getAlphabetAsArray(),
            result = [];
        return result;
    }
};