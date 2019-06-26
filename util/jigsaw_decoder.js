/*jslint node:true*/
module.exports = {
    /**
     * Retrieve and convert a state that is declared as a jigsaw block into a
     * materials data map item and prepared state item representation.
     * @param {number} state                    given state index
     * @param {array} simplifiedBlocksData      provided block array
     * @param {boolean} checkProperties            should the properties be checked?   
     * @returns {object}    Either the prepared state object or the data item, depending on the checkProperties flag
     */
    getJigsawPreparedStateOrDataItemFromBlocks: function (state, simplifiedBlocksData, checkProperties) {
        // Find the first block that matches the jigsaw state.
        global.vLog('Jigsaw Decoder: Searching block with state ' + i + '...');
        var block = simplifiedBlocksData.find(function (el) {
                return el.state === state;
            }),
            dataItem,
            preparedState,
            finalState,
            foundProperties,
            securedProperties,
            assignProperties,
            i,
            kv
        ;
        if (block === undefined) {
            throw new Error('Jigsaw Decoder: Target block state not found');
        }
        global.vLog(['Jigsaw Decoder: Found block:', block, 'Jigsaw Decoder: Checking for properties data...']);
        finalState = block.nbt.final_state;
        foundProperties = finalState.match(/\[(.)*\]/g);
        if (foundProperties === null) {
            global.vLog('Jigsaw Decoder: No properties data found.');
            dataItem = global.blockData[finalState];
            preparedState = { name: dataItem.text, states: [i] };
        } else {
            global.vLog('Jigsaw Decoder: Found properties data - analyzing...');
            dataItem = global.blockData[finalState.slice(0, finalState.indexOf('['))];
            preparedState = { name: dataItem.text, states: [i] };
            assignProperties = (
                checkProperties
                && (!dataItem.hasOwnProperty('ignoreProperties') || !dataItem.ignoreProperties)
                && dataItem.hasOwnProperty('Properties')
            );
            if (assignProperties) {
                securedProperties = foundProperties[0].slice(1, foundProperties[0].length - 1).split(',');
                i = 0;
                global.vLog(['Jigsaw Decoder: Secured properties for assignment:', securedProperties]);
                for (i; i < securedProperties.length; i += 1) {
                    kv = securedProperties[i].split('=');
                    global.vLog(['Jigsaw Decoder: Trying to assign property:', kv]);
                    if (dataItem.Properties.hasOwnProperty(kv[0]) && dataItem.Properties[kv[0]].hasOwnProperty(kv[1])) {
                        preparedState.name = dataItem.Properties[kv[0]][kv[1]].replace(/\%/g, dataItem.text);
                        i = securedProperties.length; // Cancel loop
                        global.vLog('Jigsaw Decoder: Property ' + securedProperties[i] + ' successfully assigned!');
                    }
                }
            } else if (checkProperties) {
                global.vLog('Jigsaw Decoder: Properties assignment unneccessary.');
            }
        }

        global.vLog(['Jigsaw Decoder: Constructed jigsaw data:', preparedState]);
        return checkProperties ? preparedState : dataItem;
    }
};