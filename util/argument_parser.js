/*jslint node:true*/
global.configuration = {
    f: undefined,
    file: undefined,
    o: "./output.txt",
    output: "./output.txt",
    s: "./output/simplified-data.json",
    simplifiedOutput: "./output/simplified-data.json",
    v: false,
    verbose: false
};

/**
 * Check if all required arguments are set.
 * @throws {Error} A required argument is missing.
 */
var checkRequiredArguments = function () {
    'use strict';
    if (global.configuration.f === undefined && global.configuration.file === undefined) {
        throw new Error('Missing input file argument. Please specify a file with -f or --file');
    } else if (global.configuration.f === undefined) {
        global.configuration.f = global.configuration.file;
    } else {
        global.configuration.file = global.configuration.f;
    }
};

/**
 * Assign ambiguous arguments
 */
var assignArguments = function () {
    if (global.configuration.verbose) {
        global.configuration.v = global.configuration.verbose;
    } else if (global.configuration.v) {
        global.configuration.verbose = global.configuration.v;
    }
    // TODO: Check output/o and simplifiedOutput/s
}

module.exports = {
    readArgumentsFromCli: function (givenArgs) {
        'use strict';
        var configKeys = Object.keys(global.configuration),
            keys = Object.keys(givenArgs),
            i = 1;
        for (i; i < keys.length; i += 1) {
            if (configKeys.includes(keys[i])) {
                global.configuration[keys[i]] = givenArgs[keys[i]];
            }
        }
        checkRequiredArguments();
        assignArguments();
        if (global.configuration.v) {
            console.log('Received Arguments:');
            console.log(givenArgs);
        }
    }
};