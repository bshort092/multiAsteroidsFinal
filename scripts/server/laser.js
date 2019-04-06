'use strict';

let random = require ('./random');
// let canvas = document.getElementById('canvas-main');


function createLaser(shipSpec) {
    let that = {};
    // let valid = [canvas.width/2 - shipWidth*2, canvas.width/2 + shipWidth*2, canvas.height/2 - shipHeight*2, canvas.height/2 + shipHeight*2];

    let position = {
        x: shipSpec.center.x,
        y: shipSpec.center.y
    };

    let size = {
        width: 148,
        height: 148
    };
    
    let direction = Math.random() * 360;    // Angle in radians
    let rotation = Math.random() * 360;    // Angle in radians
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

    Object.defineProperty(that, 'rotation', {
        get: () => rotation
    });

    Object.defineProperty(that, 'rotateRate', {
        get: () => rotateRate
    });

    Object.defineProperty(that, 'speed', {
        get: () => speed
    });

    Object.defineProperty(that, 'reportUpdate', {
        get: () => reportUpdate,
        set: value => reportUpdate = value
    });

    that.update = function(when) {
        reportUpdate = true;

        let vectorX = Math.cos(direction);
        let vectorY = Math.sin(direction);

        position.x += (vectorX * speed);
        position.y += (vectorY * speed);

        rotation += rotateRate;

        // if (position.x - (size.width/2) > canvas.width)  { position.x = 0 - (size.width/2); }
        // if (position.x + (size.width/2)  < 0)      { position.x = canvas.width + (size.width/2); }
        // if (position.y - (size.height/2) > canvas.height) { position.y = 0 - (size.height/2); }
        // if (position.y + (size.height/2) < 0)      { position.y = canvas.height + (size.height/2); }

        if (position.x - (size.width/2) > 600)  { position.x = 0 - (size.width/2); }
        if (position.x + (size.width/2)  < 0)      { position.x = 600 + (size.width/2); }
        if (position.y - (size.height/2) > 600) { position.y = 0 - (size.height/2); }
        if (position.y + (size.height/2) < 0)      { position.y = 600 + (size.height/2); }

    };

    return that;
}

module.exports.create = () => createLaser();
