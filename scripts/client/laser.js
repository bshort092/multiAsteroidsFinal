'use strict';

let random = require ('./random');

function createLaser(infoSpec) {
    let that = {};

    let position = {
        x: 0,
        y: 0
    };

    let size = {
        width: 25,
        height: 3
    };

    let directionVector = {
        x: 0,
        y: 0
    }
    
    let direction = 0;    // Angle in radians
    let speed = 0;

    Object.defineProperty(that, 'position', {
        get: () => position,
    });

    Object.defineProperty(that, 'size', {
        get: () => size,
        set: value => { size = value; }
    });

    Object.defineProperty(that, 'direction', {
        get: () => direction,
        set: value => { direction = value; }
    });    
    
    Object.defineProperty(that, 'directionVector', {
        get: () => directionVector,
        set: value => { directionVector = value; }
    });

    Object.defineProperty(that, 'speed', {
        get: () => speed,
        set: value => { speed = value; }
    });

    that.update = function(elapsedTime) {

        position.x += (elapsedTime * speed * directionVector.x);
        position.y += (elapsedTime * speed * directionVector.y);

        // if (spec.center.x > MyGame.graphics.canvas.width) spec.center.x = 0;
        // if (spec.center.x < 0) spec.center.x = MyGame.graphics.canvas.width;
        // if (spec.center.y > MyGame.graphics.canvas.height) spec.center.y = 0;
        // if (spec.center.y < 0) spec.center.y = MyGame.graphics.canvas.height;

    };

    return that;
}

module.exports.create = () => createLaser();
