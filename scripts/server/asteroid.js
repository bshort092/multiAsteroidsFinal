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
        
            if (that.position.x - (that.size.width/2) > 1920)  { that.position.x = 0 - (that.size.width/2); }
            if (that.position.x + (that.size.width/2)  < 0)      { that.position.x = 1920 + (that.size.width/2); }
            if (that.position.y - (that.size.height/2) > 1152) { that.position.y = 0 - (that.size.height/2); }
            if (that.position.y + (that.size.height/2) < 0)      { that.position.y = 1152 + (that.size.height/2); }

        },
    };
    return that;
}

module.exports.create = (spec) => createAsteroid(spec);