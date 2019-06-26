var dataMaker = require('./blueprint_data_maker');

/*jslint node:true*/
module.exports = {
    generateBlueprintCode: function (simplifiedData, filenameWithoutExtension) {
        var blueprintData = dataMaker.createBlueprintData(simplifiedData, filenameWithoutExtension),
            result = '==== Blueprint ====\n<table><tr><td style="width:250px";>\n{{layered blueprint',
            metadataKeys = Object.keys(blueprintData.metadata),
            variablesKeys = Object.keys(blueprintData.metadata.variables),
            i = 0,
            j
            ;
        
        for (i; i < metadataKeys.length; i += 1) {
            if (metadataKeys[i] !== 'variables') {
                result += '\n|' + metadataKeys[i] + '=' + blueprintData.metadata[metadataKeys[i]];
            }
        }
        
        i = 0;
        
        for (i; i < variablesKeys.length; i += 1) {
            result += '\n|' + blueprintData.metadata.variables[variablesKeys[i]].key + '=' + blueprintData.metadata.variables[variablesKeys[i]].name;
        }
        
        i = 0;
        
        for (i; i < blueprintData.layers.length; i += 1) {
            result += '\n|----Layer ' + (i + 1) + '|';
            j = 0;
            for (j; j < blueprintData.layers[i].length; j += 1) {
                result += '\n' + blueprintData.layers[i][j].join('');
            }
        }
        
        result += '\n}}\n</td><td style="vertical-align:top;">\n<!-- TODO: Photo -->\n</td></tr></table>';
        
        return result;
    }
};