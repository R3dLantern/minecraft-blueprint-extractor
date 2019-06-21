/*jslint node:true*/
/**
 * Recursively simplify a parsed NBT JSON object.
 * @param   {object} obj given parsed NBT JSON object
 * @returns {object} Simplified representation of obj
 */
var simpliflyRecursive = function (obj, name) {
    'use strict';
    var result = {},
        keys,
        i = 0,
        tmp,
        j;
    
    if (typeof obj !== "object") {
        return result;
    }
    
    keys = Object.keys(obj);
    
    global.vLog('Simplifying object (name = ' + name + ')...');
    
    for (i; i < keys.length; i += 1) {
        var currentValueType = obj[keys[i]].type;
        
        global.vLog('Analyzing property "' + keys[i] + '"...');
        
        if (currentValueType === "compound") {
            // The current property is a compound - so to speak an object itself. Recursively traverse it
            global.vLog('Evaluated type is "compound" - beginning recursion for "' + keys[i] + '"');
            result[keys[i]] = simpliflyRecursive(obj[keys[i]].value, keys[i]);
        } else if (currentValueType === "list") {
            // the current property is an array. Here we have to check the item type as well
            global.vLog('Evaluated type is "list" - Evaluating list item type...');
            if (obj[keys[i]].value.type === "compound") {
                // the item is another compound - recursively traverse it
                global.vLog('Evaluated type is "compound" - beginning simplification for "' + keys[i] + '" items...');
                tmp = [];
                j = 0;
                for (j; j < obj[keys[i]].value.value.length; j += 1) {
                    tmp.push(simpliflyRecursive(obj[keys[i]].value.value[j], keys[i]));
                }
                result[keys[i]] = tmp;
                global.vLog('Simplification for "' + keys[i] + '" items completed!');
            } else {
                // the item is a simple data type - just get the whole list
                result[keys[i]] = obj[keys[i]].value.value;
                global.vLog('Simplification for "' + keys[i] + '" items completed!');
            }
        } else {
            // the current property is a simple data type
            result[keys[i]] = obj[keys[i]].value;
            global.vLog('Simplification for "' + keys[i] + '" completed!');
        }
    }
    
    global.vLog('Simplification for "' + name + '" completed!');
    return result;
};

module.exports = {
    simplifyObject: function (obj) {
        'use strict';
        return simpliflyRecursive(obj.value, 'root');
    }
};