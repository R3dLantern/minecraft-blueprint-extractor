var dataMaker = require('./blueprint_data_maker');

/*jslint node:true*/
module.exports = {
    generateBlueprintCode: function (simplifiedData, filenameWithoutExtension) {
        var blueprintData = dataMaker.createBlueprintData(simplifiedData, filenameWithoutExtension),
            result = '==== Blueprint ====\n<table><tr><td style="width:250px";>\n{{layered blueprint',
            metadataKeys = Object.keys(blueprintData.metadata),
            i = 0,
            j
            ;
        
        for (i; i < metadataKeys.length; i += 1) {
            if (metadataKeys[i] !== 'variables') {
                result += '\n|' + metadataKeys[i] + '=' + blueprintData.metadata[metadataKeys[i]];
            }
        }
        
        i = 0;
        
        for (i; i < blueprintData.metadata.variables.length; i += 1) {
            result += '\n|' + blueprintData.metadata.variables[i].id + '=' + blueprintData.metadata.variables[i].name;
        }
        
        i = 0;
        
        for (i; i < blueprintData.layers.length; i += 1) {
            result += '\n|----Layer ' + i + '|';
            j = 0;
            for (j; j < blueprintData.layers[i].length; j += 1) {
                result += '\n' + blueprintData.layers[i][j].join('');
            }
        }
        
        result += '\n}}\n</td><td style="vertical-align:top;">\n<!-- TODO: Photo -->\n</td></tr></table>';
        
        global.vLog(['\Constructed blueprint data:', result]);
        
        return result;
    }
};