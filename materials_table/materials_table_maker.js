/**
 * Deconstruct a parsed raw palette list into a readable list of materials for the structure. Prune functional or redundant blocks.
 * @param {list} rawPaletteList the list of palette items.
 */
var getMaterialsListFromRawPalette = function (rawPaletteList) {
    if (typeof rawPaletteList !== 'object') {
            return [];
        }
        
        var result = [],
            usedItems = [],
            item,
            i = 0;
    
        for (i; i < rawPaletteList.length; i += 1) {
            
            // Simplify
            item = rawPaletteList[i];
        
            // 1. The item must not be on the ignored list (we will ignore functional and redundant blocks, such as minecraft:air or minecraft:jigsaw)
            if (global.ignoredBlocks.includes(item.Name) || usedItems.includes(item.Name)) {
                continue;
            }
            usedItems.push(item.Name);
            result.push({
                item: global.materialsDataMap[item.Name],
                state: i
            });
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
    
    getMaterialsTableData: function(rawPaletteList, blocks, layerCount) {
        var result = {
            layers: layerCount,
            materials: getMaterialsListFromRawPalette(rawPaletteList)
        },
            targetStates = [],
            i = 0;
        
        for (i; i < result.materials.length; i += 1) {
            targetStates.push(result.materials[i].state);
        }
        
        if (global.configuration.v) {
            console.log('target states:');
            console.log(targetStates);
        }
        
        i = 0;
        
        for (i; i < blocks.length; i += 1) {
            if (global.configuration.v && targetStates.includes(blocks[i].state)) {
                console.log('Found target state at blocks index ' + i);
            }
        }
        
        // TODO: construct layer information
        
        return result;
    }
};