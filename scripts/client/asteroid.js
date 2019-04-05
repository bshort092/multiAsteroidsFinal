MyGame.components.Asteroid = function() {
    'use strict';

    let canvas = document.getElementById('canvas-main');

    let that = {};
    let position = {
        x: 0,
        y: 0
    };
    let size = {
        width: 148,
        height: 148
    };
    let direction = 0;
    let rotation = 0;
    let rotateRate = 0;
    let speed = 0;

    Object.defineProperty(that, 'position', {
        get: () => position
    });

    Object.defineProperty(that, 'size', {
        get: () => size
    });

    Object.defineProperty(that, 'direction', {
        get: () => direction,
        set: (value) => { direction = value }
    });

    Object.defineProperty(that, 'rotation', {
        get: () => rotation,
        set: (value) => { rotation = value }
    });

    Object.defineProperty(that, 'rotateRate', {
        get: () => rotateRate,
        set: value => { rotateRate = value; }
    });

    Object.defineProperty(that, 'speed', {
        get: () => speed,
        set: value => { speed = value; }
    });

    that.update = function(elapsedTime) {
        let vectorX = Math.cos(direction);
        let vectorY = Math.sin(direction);

        position.x += (vectorX * speed);
        position.y += (vectorY * speed);

        rotation += rotateRate;

        if (position.x - (size.width/2) > 600)  { position.x = 0 - (size.width/2); }
        if (position.x + (size.width/2)  < 0)      { position.x = 600 + (size.width/2); }
        if (position.y - (size.height/2) > 600) { position.y = 0 - (size.height/2); }
        if (position.y + (size.height/2) < 0)      { position.y = 600 + (size.height/2); }

    };

    return that;
};