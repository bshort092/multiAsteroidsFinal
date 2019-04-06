// --------------------------------------------------------------
//
//
// --------------------------------------------------------------
MyGame.components.Laser = function() {
    'use strict';

    let canvas = document.getElementById('canvas-main');

    let that = {};

    let position = {
        x: 0,
        y: 0
    };

    let size = {
        width: 3,
        height: 3
    };

    let direction = {
        x: 0,
        y: 0
    };

    let rotation = 0;
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

    Object.defineProperty(that, 'speed', {
        get: () => speed,
        set: value => { speed = value; }
    });

    that.update = function(elapsedTime) {

        position.x += (elapsedTime * speed * direction.x);
        position.y += (elapsedTime * speed * direction.y);

        // if (spec.center.x > MyGame.graphics.canvas.width) spec.center.x = 0;
        // if (spec.center.x < 0) spec.center.x = MyGame.graphics.canvas.width;
        // if (spec.center.y > MyGame.graphics.canvas.height) spec.center.y = 0;
        // if (spec.center.y < 0) spec.center.y = MyGame.graphics.canvas.height;

    };

    return that;
}
