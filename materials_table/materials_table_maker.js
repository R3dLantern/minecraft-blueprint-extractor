/**
 * Deconstruct a parsed raw palette list into a readable list of materials for the structure. Prune functional or redundant blocks.
 * @param {list} rawPaletteList the list of palette items.
 */
var getMaterialsListFromRawPalette = function (rawPaletteList) {
    if (typeof rawPaletteList !== 'object') {
            return [];
        }
        
        var result = {
                materials: [],
                usedStates: []
            },
            item,
            i = 0,
            j,
            found;
    
        for (i; i < rawPaletteList.length; i += 1) {
            
            // Simplify
            item = rawPaletteList[i];
        
            // 1. The item must not be on the ignored list (we will ignore functional and redundant blocks, such as minecraft:air or minecraft:jigsaw)
            if (global.ignoredBlocks.includes(item.Name)) {
                continue;
            }
            
            if (result.length === 0) {
                result.materials.push({
                    item: global.materialsDataMap[item.Name],
                    name: item.Name,
                    states: [i]
                });
                result.usedStates.push(i);
            } else {
                j = 0;
                found = false;
                for (j; j < result.materials.length; j += 1) {
                    if (item.Name === result.materials[j].name) {
                        found = true;
                        result.materials[j].states.push(i);
                        result.usedStates.push(i);
                        j = result.materials.length;
                    }
                }
                
                if (!found) {
                    result.materials.push({
                        item: global.materialsDataMap[item.Name],
                        name: item.Name,
                        states: [i]
                    });
                    result.usedStates.push(i);
                }
            }
        }
    
        if (global.configuration.v) {
            console.log('used states:');
            console.log(result.usedStates);
        }
    
        return result;
};

/*jslint node:true*/
'use strict';
module.exports = {
    /**
     * From a given Materials data map item, create a table row command for the Gamepedia source code.
     * @param   {object} item A data map item @see materials_data_map.json
     * @returns {string} the item data as a Gamepedia materials table row command.
     */
    toTableRowCommand: function (item) {
        return '{{' + item.spriteType + '|' + item.internalId + '|link=' + item.link + '|text=' + item.text + '}}';
    },
    
    /**
     * Generate an object that contains relevant data to create the Gamepedia source code for a materials table.
     * @param   {object} rawPaletteList The simplified raw palette list from a parsed NBT Structure file.
     * @param   {object} blocks         The simplified blocks list from a parsed NBT Structure file.
     * @param   {number} layerCount     The number of layers the structure covers
     * @returns {object} An object filled will all relevant data to generate a Gamepedia source code for a materials table.
     *                   This includes:
     *                    - layer count
     *                    - used materials
     *                      - usage per layer
     *                      - total usage
     */
    getMaterialsTableData: function(rawPaletteList, blocks, layerCount) {
        
        // 1. Pull the materials list from the palette. This will reduce ambiguous states (such as wall torches that face in different directions)
        var materialsData = getMaterialsListFromRawPalette(rawPaletteList),
            
        // 2. Prepare a result object and loop variables.
            result = {
                layerCount: layerCount,
                materials: []
            },
            i = 0,
            j,
            sum
        ;
        
        // 3. We need to prepare the material data for the layer counting. For this, we will apply an array with layerCount length to each item.
        for (i; i < materialsData.materials.length; i += 1) {
            j = 0;
            materialsData.materials[i].layers = [];
            for (j; j < layerCount + 1; j += 1) {
                materialsData.materials[i].layers.push(0);
            }
        }
        
        /*
         * 4. The function must walk through all blocks of the given blocks list.
         * TODO:
         * 1.   The block must be contained within the collected states of all materials. This excludes irrelevant blocks like minecraft:air or minecraft:jigsaw.
         *      We can utilize materialsData.usedStates to determine whether the block is irrelevant or not.
         * 2.   We need to find the matching material via state.
         * 3.   If found, we need to increment the layer of the matching material from the block position data.
         */
        
        i = 0;
        for (i; i < blocks.length; i += 1) {
            if (materialsData.usedStates.includes(blocks[i].state)) {
                if (global.configuration.v) {
                    console.log('Found relevant block at index ' + i);
                }
                j = 0;
                for (j; j < materialsData.materials.length; j += 1) {
                    if (materialsData.materials[j].states.includes(blocks[i].state)) {
                        materialsData.materials[j].layers[blocks[i].pos[1]] += 1;
                        j = materialsData.materials.length;
                    }
                }
            }
        }
        
        // 5. finally, iterate through all material layer arrays and assign the sum of all indices to the last index
        i = 0;
        for (i; i < materialsData.materials.length; i += 1) {
            j = 0;
            sum = 0;
            for (j; j < materialsData.materials[i].layers.length - 1; j += 1) {
                sum += materialsData.materials[i].layers[j];
            }
            materialsData.materials[i].layers[j] = sum;
        }
        
        result.materials = materialsData.materials;
        
        if (global.configuration.v) {
            console.log('materials table data:');
            console.log(result);
            i = 0;
            for (i; i < result.materials.length; i += 1) {
                console.log('layer count for material item ' + i + ':');
                console.log(result.materials[i].layers);
            }
        }
        
        return result;
    }
};