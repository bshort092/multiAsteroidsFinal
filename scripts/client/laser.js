'use strict';

let random = require ('./random');

function createLaser() {
    let that = {
        position: {
            x: 0,
            y: 0
        },
    
        size: {
            width: 25,
            height: 3
        },
    
        directionVector: {
            x: 0,
            y: 0
        },
        
        direction: 0,    // Angle in radians
        speed: 0,
        
        update: function(elapsedTime) {

            that.position.x += (elapsedTime * that.speed * that.directionVector.x);
            that.position.y += (elapsedTime * that.speed * that.directionVector.y);
    
            // if (spec.center.x > MyGame.graphics.canvas.width) spec.center.x = 0;
            // if (spec.center.x < 0) spec.center.x = MyGame.graphics.canvas.width;
            // if (spec.center.y > MyGame.graphics.canvas.height) spec.center.y = 0;
            // if (spec.center.y < 0) spec.center.y = MyGame.graphics.canvas.height;
    
        },
    };
    return that;
}

module.exports.create = () => createLaser();
