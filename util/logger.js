/**
 * Logger object for the -v option.
 * @param {object|string} msg Either a single message string or an array of messages to be logged consecutively
 */
global.vLog = function (msg) {
    'use strict';
    
    if (global.configuration.v) {
        if (typeof msg === 'string') {
            console.log(msg);
        } else if (typeof msg === 'object') {
            var i = 0;
            for (i; i < msg.length; i += 1) {
                console.log(msg[i]);
            }
        }
    }
};