'use strict';

let random = require('./random');

function createPowerup(spec) {
    let that = {
        position: {
            x: spec.position.x,
            y: spec.position.y
        },

        size: {
            width: 250,
            height: 250
        },

        reportUpdate: false,
        radius: 3,
        type: spec.type,

        update: function (elapsedTime) {
            that.reportUpdate = true;
        },
    };

    return that;
}

module.exports.create = (spec) => createPowerup(spec);
