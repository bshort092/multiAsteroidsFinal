'use strict';

let random = require('./random');

function createPowerup(spec) {
    let that = {
        position: {
            x: spec.position.x,
            y: spec.position.y
        },

        size: {
            width: 50,
            height: 35
        },

        reportUpdate: false,
        radius: 25,
        type: spec.type,

        spriteCount: 8,
        spriteTime: [100, 100, 100, 100, 100, 100, 100, 100],

        animationTime: 0,
        subImageIndex: 0,
        subTextureWidth: 256 / 8,

        update: function (elapsedTime){
            that.reportUpdate = true;
            that.animationTime += elapsedTime;
            //
            // Check to see if we should update the animation frame
            if (that.animationTime >= that.spriteTime[that.subImageIndex]) {
                //
                // When switching sprites, keep the leftover time because
                // it needs to be accounted for the next sprite animation frame.
                that.animationTime -= that.spriteTime[that.subImageIndex];
                that.subImageIndex += 1;
                //
                // Wrap around from the last back to the first sprite as needed
                that.subImageIndex = that.subImageIndex % that.spriteCount;
            }
        },
    };

    return that;
}

module.exports.create = (spec) => createPowerup(spec);
