/*jslint node:true*/
'use strict';

var jigsawDecoder = require('../util/jigsaw_decoder');

var getMaterialsFromPaletteAndBlocks = function (simplifiedPalette, simplifiedBlocks) {
    if (typeof simplifiedPalette !== 'object' || typeof simplifiedBlocks !== 'object') {
        global.vLog(['given parameters have wrong datatypes', typeof simplifiedPalette, typeof simplifiedBlocks]);
        return [];
    }

    var result = [],
        i = 0,
        paletteItem,
        resultItem,
        existing
    ;

    for (i; i < simplifiedPalette.length; i += 1) {

        paletteItem = simplifiedPalette[i];
        global.vLog(['Materials Data Maker: Retrieved paletteItem:', paletteItem]);

        if (paletteItem.Name === 'minecraft:jigsaw') {
            resultItem = jigsawDecoder.getJigsawPreparedStateOrDataItemFromBlocks(i, simplifiedBlocks, false);
        } else {
            resultItem = global.blockData[paletteItem.Name];

            if (dataItem === undefined) {
                throw new Error('State not defined in block data. Check the issue tracker for addition of ' + paletteItem.Name);
            }

            if (resultItem.hasOwnProperty('ignoreState') && resultItem.ignoreState) {
                global.vLog('Materials Data Maker: Found ignorable state');
                continue;
            }

            if (resultItem.hasOwnProperty('reference')) {
                global.vLog('Materials Data Maker: Found reference to '+ resultItem.reference);
                resultItem = global.blockData[resultItem.reference];
                global.vLog(['Materials Data Maker: Referenced dataItem:', resultItem]);
            }
        }

        if (result.length === 0) {
            resultItem.states = [i];
            result.push(resultItem);
        } else {
            existing = result.findIndex((el) => el.internalId === resultItem.internalId);
            if (existing > -1) {
                result[existing].states.push(i);
            } else {
                resultItem.states = [i];
                result.push(resultItem);
            }
        }
    }

    return result;
};

/*jslint node:true*/
'use strict';
module.exports = {
    /**
     * Generate an object that contains relevant data to create the Gamepedia source code for a materials table.
     * @param   {object} palette The simplified raw palette list from a parsed NBT Structure file.
     * @param   {object} blocks         The simplified blocks list from a parsed NBT Structure file.
     * @param   {number} layerCount     The number of layers the structure covers
     * @returns {object} An object filled will all relevant data to generate a Gamepedia source code for a materials table.
     *                   This includes:
     *                    - layer count
     *                    - used materials
     *                      - usage per layer
     *                      - total usage
     */
    getMaterialsTableData: function(palette, blocks, layerCount) {
        
        // 1. Pull the materials list from the palette. This will reduce ambiguous states (such as wall torches that face in different directions)
        var materials = getMaterialsFromPaletteAndBlocks(palette, blocks),
            i = 0,
            j,
            targetIdx,
            sum
        ;
        
        // 3. We need to prepare the material data for the layer counting. For this, we will apply an array with layerCount length to each item.
        for (i; i < materials.length; i += 1) {
            j = 0;
            materials[i].layers = [];
            for (j; j < layerCount + 1; j += 1) {
                materials[i].layers.push(0);
            }
        }
        
        i = 0;
        
        // 4. We need to iterate through all blocks of the structure.
        for (i; i < blocks.length; i += 1) {
            targetIdx = materials.findIndex((el) => el.states.includes(blocks[i].state));
            if (targetIdx > -1) {
                materials[targetIdx].layers[blocks[i].pos[1]] += 1;
            }
        }
        
        i = 0;
        
        // 5. finally, iterate through all material layer arrays and assign the sum of all indices to the last index
        for (i; i < materials.length; i += 1) {
            j = 0;
            sum = 0;
            for (j; j < materials[i].layers.length - 1; j += 1) { // Ignoring the last index here is adequate since j is being incremented anyway
                sum += materials[i].layers[j];
            }
            materials[i].layers[j] = sum;
        }
        
        // Debugging purposes
        if (global.configuration.v) {
            console.log('\nMaterials table data:');
            console.log(materials);
            i = 0;
            for (i; i < materials.length; i += 1) {
                console.log('Layer count for material item ' + i + ':');
                console.log(materials[i].layers);
            }
        }

        materials.sort((a, b) => a.text < b.text ? -1 : a.text > b.text ? 1 : 0);
        
        return { materials: materials, layerCount: layerCount };
    }
};