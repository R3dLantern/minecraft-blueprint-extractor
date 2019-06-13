/*jslint node:true*/
var dataMaker = require('./materials_table_maker');

var toTableRowCommand = function (item) {
    return '{{' + item.spriteType + '|' + item.internalId + '|link=' + item.link + '|text=' + item.text + '}}';
};

module.exports = {
    /**
     * Generate the Gamepedia source code from a given materials table data object created with materials_table_maker.js
     * @param {object} materialsTableData an object containing relevant table data
     */
    generateTableCode: function (rawPaletteList, blocks, layerCount) {
        var materialsTableData = dataMaker.getMaterialsTableData(rawPaletteList, blocks, layerCount),
            result = '==== Materials ====\n{|class="wikitable"\n|-\n!Name',
            i = 1,
            item,
            j
        ;
        
        for (i; i < materialsTableData.layerCount + 1; i += 1) {
            result = result + ' !!Layer ' + i;
        }
        result = result + ' !!Total\n';
        
        i = 0;
        for (i; i < materialsTableData.materials.length; i += 1) {
            item = materialsTableData.materials[i];
            result = result + '|-\n| ' + toTableRowCommand(item.item);
            j = 0;
            for (j; j < item.layers.length; j += 1) {
                if (item.layers[j] === 0) {
                    result = result + ' || -';
                } else {
                    result = result + ' || ' + item.layers[j];
                }
            }
            result = result + '\n';
        }
        
        return result + '|}';
    }
};