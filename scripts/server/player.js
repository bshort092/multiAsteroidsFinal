// ------------------------------------------------------------------
//
// Nodejs module that represents the model for a player.
//
// ------------------------------------------------------------------
'use strict';

let random = require ('./random');

//------------------------------------------------------------------
//
// Public function used to initially create a newly connected player
// at some random location.
//
//------------------------------------------------------------------
function createPlayer() {
    let that = {};

    let position = {
        x: random.nextDouble(),
        y: random.nextDouble()
    };

    let size = {
        width: 0.01,
        height: 0.01
    };
    let direction = random.nextDouble() * 2 * Math.PI;    // Angle in radians
    let rotateRate = Math.PI / 1000;    // radians per millisecond
    let speed = 0.0002;                  // unit distance per millisecond
    let reportUpdate = false;    // Indicates if this model was updated during the last update
    let velocityVector = {
        x: 0,
        y: 0
    }
    let acceleration = 0;
    let maxSpeed = 10;

    Object.defineProperty(that, 'velocityVector', {
        get: () => velocityVector
    });

    Object.defineProperty(that, 'acceleration', {
        get: () => acceleration
    });

    Object.defineProperty(that, 'maxSpeed', {
        get: () => maxSpeed
    });

    Object.defineProperty(that, 'direction', {
        get: () => direction
    });

    Object.defineProperty(that, 'position', {
        get: () => position
    });

    Object.defineProperty(that, 'size', {
        get: () => size
    });

    Object.defineProperty(that, 'speed', {
        get: () => speed
    })

    Object.defineProperty(that, 'rotateRate', {
        get: () => rotateRate
    });

    Object.defineProperty(that, 'reportUpdate', {
        get: () => reportUpdate,
        set: value => reportUpdate = value
    });

    //------------------------------------------------------------------
    //
    // Public function that moves the player in the current direction.
    //
    //------------------------------------------------------------------
    that.move = function(elapsedTime) {

        let vectorX = Math.cos(direction);
        let vectorY = Math.sin(direction);

        velocityVector.x += vectorX * acceleration;
        velocityVector.y += vectorY * acceleration;
    };

    //------------------------------------------------------------------
    //
    // Public function that rotates the player right.
    //
    //------------------------------------------------------------------
    that.rotateRight = function(elapsedTime) {
        direction += (rotateRate * elapsedTime);
    };

    //------------------------------------------------------------------
    //
    // Public function that rotates the player left.
    //
    //------------------------------------------------------------------
    that.rotateLeft = function(elapsedTime) {
        direction -= (rotateRate * elapsedTime);
    };

    that.update = function(elapsedTime) {

        if (velocityVector.x > maxSpeed) {
            velocityVector.x = maxSpeed;
        }
        if (velocityVector.x < 0 - maxSpeed) {
            velocityVector.x = 0 - maxSpeed;
        }

        if (velocityVector.y > maxSpeed) {
            velocityVector.y = maxSpeed;
        }
        if (velocityVector.y < 0 - maxSpeed) {
            velocityVector.y = 0 - maxSpeed;
        }

        position.x += velocityVector.x;
        position.y += velocityVector.y;
    };

    return that;
}

module.exports.create = () => createPlayer();
