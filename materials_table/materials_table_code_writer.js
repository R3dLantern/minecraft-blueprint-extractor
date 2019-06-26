/*jslint node:true*/
var dataMaker = require('./materials_table_maker'),
    toTableRowCommand = function (item) {
        return '{{' + item.spriteType + '|' + item.internalId + '|link=' + item.link + '|text=' + item.text + '}}';
    }
;

module.exports = {
    /**
     * Generate the Gamepedia source code from a given materials table data object created with materials_table_maker.js
     * @param {object} materialsTableData an object containing relevant table data
     */
    generateTableCode: function (palette, blocks, layerCount) {
        var data = dataMaker.getMaterialsTableData(palette, blocks, layerCount),
            result = '==== Materials ====\n{|class="wikitable"\n|-\n!Name',
            i = 1,
            j
        ;
        
        for (i; i < data.layerCount + 1; i += 1) {
            result = result + ' !!Layer ' + i;
        }
        result = result + ' !!Total\n';
        
        i = 0;
        for (i; i < data.materials.length; i += 1) {
            result = result + '|-\n| ' + toTableRowCommand(data.materials[i]);
            j = 0;
            for (j; j < data.materials[i].layers.length; j += 1) {
                if (data.materials[i].layers[j] === 0) {
                    result = result + ' || -';
                } else {
                    result = result + ' || ' + data.materials[i].layers[j];
                }
            }
            result = result + '\n';
        }
        
        return result + '|}';
    }
};