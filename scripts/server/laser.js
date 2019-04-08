'use strict';

let random = require ('./random');

function createLaser(infoSpec) {
    let that = {};

    let position = {
        x: infoSpec.center.x,
        y: infoSpec.center.y
    };

    let size = {
        width: 25,
        height: 3
    };

    let directionVector = {
        x: Math.cos(infoSpec.direction),
        y: Math.sin(infoSpec.direction)
    }
    
    let direction = infoSpec.direction;    // Angle in radians
    let speed = 3;
    let reportUpdate = false;    // Indicates if this model was updated during the last update

    Object.defineProperty(that, 'position', {
        get: () => position
    });

    Object.defineProperty(that, 'size', {
        get: () => size
    });

    Object.defineProperty(that, 'direction', {
        get: () => direction
    });    
    
    Object.defineProperty(that, 'directionVector', {
        get: () => directionVector
    });

    Object.defineProperty(that, 'speed', {
        get: () => speed
    });

    Object.defineProperty(that, 'reportUpdate', {
        get: () => reportUpdate,
        set: value => reportUpdate = value
    });

    that.update = function(elapsedTime) {
        that.reportUpdate = true;

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
