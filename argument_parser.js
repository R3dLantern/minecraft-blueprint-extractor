/*jslint node:true*/
global.configuration = {
    file: undefined,
    f: undefined,
    output: "./output.txt",
    o: "./output.txt"
};

/**
 * Check if all required arguments are set.
 * @throws {Error} A required argument is missing.
 */
var checkRequiredArguments = function () {
    'use strict';
    if (global.configuration.file === undefined && global.configuration.f === undefined) {
        throw new Error('Missing input file argument. Please specify a file with -f or -file');
    } else if (global.configuration.file === undefined) {
        global.configuration.file = global.configuration.f;
    } else {
        global.configuration.f = global.configuration.file;
    }
};

module.exports = {
    readArgumentsFromCli: function (givenArgs) {
        'use strict';
        var configKeys = Object.keys(global.configuration),
            keys = Object.keys(givenArgs),
            i = 1;
        console.log('Received arguments: ' + givenArgs);
        for (i; i < keys.length; i += 1) {
            if (configKeys.includes(keys[i])) {
                console.log('Accepting argument ' + keys[i] + ' with value ' + givenArgs[keys[i]]);
                global.configuration[keys[i]] = givenArgs[keys[i]];
            }
        }
        checkRequiredArguments();
    }
};