'use strict';

let random = require('./random');

function createLaser(infoSpec) {
    let that = {
        position: {
            x: infoSpec.position.x,
            y: infoSpec.position.y
        },

        size: {
            width: 25,
            height: 3
        },

        directionVector: {
            x: Math.cos(infoSpec.direction),
            y: Math.sin(infoSpec.direction)
        },

        direction: infoSpec.direction,   // Angle in radians
        speed: 3,
        reportUpdate: false,

        update: function (elapsedTime) {
            that.reportUpdate = true;

            that.position.x += (elapsedTime * that.speed * that.directionVector.x);
            that.position.y += (elapsedTime * that.speed * that.directionVector.y);

            // if (spec.center.x > MyGame.graphics.canvas.width) spec.center.x = 0;
            // if (spec.center.x < 0) spec.center.x = MyGame.graphics.canvas.width;
            // if (spec.center.y > MyGame.graphics.canvas.height) spec.center.y = 0;
            // if (spec.center.y < 0) spec.center.y = MyGame.graphics.canvas.height;
        },
    };

    //console.log(infoSpec);

    // Indicates if this model was updated during the last update

    return that;
}

module.exports.create = (infoSpec) => createLaser(infoSpec);
