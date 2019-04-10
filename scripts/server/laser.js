'use strict';

let random = require('./random');

function createLaser(laserSpec) {
    let that = {
        position: {
            x: laserSpec.position.x,
            y: laserSpec.position.y
        },

        size: {
            width: 25,
            height: 3
        },

        direction: laserSpec.direction,   // Angle in radians
        speed: 3,
        reportUpdate: false,

        update: function(elapsedTime) {
            let vectorX = Math.cos(that.direction);
            let vectorY = Math.sin(that.direction);
        
            that.position.x += (vectorX * that.speed * elapsedTime);
            that.position.y += (vectorY * that.speed * elapsedTime);
    
            // if (spec.center.x > MyGame.graphics.canvas.width) spec.center.x = 0;
            // if (spec.center.x < 0) spec.center.x = MyGame.graphics.canvas.width;
            // if (spec.center.y > MyGame.graphics.canvas.height) spec.center.y = 0;
            // if (spec.center.y < 0) spec.center.y = MyGame.graphics.canvas.height;
        },
    };

    //console.log(infoSpec);

    return that;
}

module.exports.create = (infoSpec) => createLaser(infoSpec);
