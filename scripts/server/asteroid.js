'use strict';

let random = require('./random');

function createAsteroid(spec) {

    let that = {
        position: { x: spec.position.x, y: spec.position.y },
        size: { width: spec.size.width, height: spec.size.height },
        direction: spec.direction, // Angle in radians
        rotation: spec.rotation, // Angle in radians
        rotateRate: spec.rotateRate, // radians per millisecond
        speed: spec.speed, // unit distance per millisecond
        reportUpdate: false, // Indicates if this model was updated during the last update 
        radius: spec.size.width / 2,

        update: function () {

            that.reportUpdate = true;

            let vectorX = Math.cos(that.direction);
            let vectorY = Math.sin(that.direction);

            that.position.x += (vectorX * that.speed);
            that.position.y += (vectorY * that.speed);

            that.rotation += that.rotateRate;

            // if (position.x - (size.width/2) > canvas.width)  { position.x = 0 - (size.width/2); }
            // if (position.x + (size.width/2)  < 0)      { position.x = canvas.width + (size.width/2); }
            // if (position.y - (size.height/2) > canvas.height) { position.y = 0 - (size.height/2); }
            // if (position.y + (size.height/2) < 0)      { position.y = canvas.height + (size.height/2); }

            if (that.position.x - (that.size.width / 2) > 600) { that.position.x = 0 - (that.size.width / 2); }
            if (that.position.x + (that.size.width / 2) < 0) { that.position.x = 600 + (that.size.width / 2); }
            if (that.position.y - (that.size.height / 2) > 600) { that.position.y = 0 - (that.size.height / 2); }
            if (that.position.y + (that.size.height / 2) < 0) { that.position.y = 600 + (that.size.height / 2); }

        },
    };
    return that;
}

module.exports.create = (spec) => createAsteroid(spec);