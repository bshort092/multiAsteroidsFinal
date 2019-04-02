'use strict';

let random = require ('./random');
let canvas = document.getElementById('canvas-main');


function checkXpos(){
    let x = Math.random() * canvas.width;
    while(x > valid[0] && x < valid[1]){
        x = Math.random() * canvas.width;
    }
    return x;
}
function checkYpos(){
    let y = Math.random() * canvas.height;
    while(y > valid[2] && y < valid[3]) {
        y = Math.random() * canvas.height;
    }
    return y;
}
function getNewSpeed(){
    let minSpeed = 0.5;
    let maxSpeed = 2;
    return minSpeed + (Math.random() * ((maxSpeed-1) - minSpeed));
}
function difRotations(){
    let randomRotate = Math.random() * Math.PI / 150;
    let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    return randomRotate * plusOrMinus;
}

function createAsteroid(shipWidth, shipHeight) {
    let that = {};
    let valid = [canvas.width/2 - shipWidth*2, canvas.width/2 + shipWidth*2, canvas.height/2 - shipHeight*2, canvas.height/2 + shipHeight*2];

    let position = {
        x: checkXpos(),
        y: checkYpos()
    };
    let size = {
        width: 148,
        height: 148
    };
    let direction = Math.random() * 360;    // Angle in radians
    let rotation = Math.random() * 360;    // Angle in radians
    let rotateRate = difRotations();    // radians per millisecond
    let speed = getNewSpeed();                  // unit distance per millisecond
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

        if (position.x - (size.width/2) > canvas.width)  { position.x = 0 - (size.width/2); }
        if (position.x + (size.width/2)  < 0)      { position.x = width + (size.width/2); }
        if (position.y - (size.height/2) > canvas.height) { position.y = 0 - (size.height/2); }
        if (position.y + (size.height/2) < 0)      { position.y = height + (size.height/2); }

    };

    return that;
}

module.exports.create = () => createAsteroid();