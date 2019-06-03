/*jslint node:true*/
module.exports = {
    writeCodeFromBlueprintData: function (blueprintData) {
        var result = '==== Blueprint ====\n<table><tr><td style="width:250px";>\n{{layered blueprint',
            metadataKeys = Object.keys(blueprintData.metadata),
            
            i = 0;
        
        for (i; i < metadataKeys.length; i += 1) {
            if (metadataKeys[i] !== 'variables') {
                result += '\n|' + metadataKeys[i] + '=' + blueprintData.metadata[metadataKeys[i]];
            }
        }
        
        // TODO: layers
        return result + '\n}}\n</td><td style="vertical-align:top;">\n<!-- TODO: Photo -->\n</td></tr></table>';
    }
};