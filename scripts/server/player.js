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
        x: Math.floor( random.nextDouble() * 600),
        y: Math.floor( random.nextDouble() * 600)
    };

    let velocityVector = {
        x: 0,
        y: 0
    }

    let size = {
        width: 50,
        height: 50
    };

    let direction = random.nextDouble() * 2 * Math.PI;    // Angle in radians
    let rotateRate = Math.PI / 1000;    // radians per millisecond
    let reportUpdate = false;    // Indicates if this model was updated during the last update

    let acceleration = .1;
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

    Object.defineProperty(that, 'rotateRate', {
        get: () => rotateRate
    });

    Object.defineProperty(that, 'reportUpdate', {
        get: () => reportUpdate,
        set: value => reportUpdate = value
    });

    //------------------------------------------------------------------
    //
    // Moves the player forward based on how long it has been since the
    // last move took place.
    //------------------------------------------------------------------
    that.move = function(elapsedTime) {
        reportUpdate = true;

        let vectorX = Math.cos(direction);
        let vectorY = Math.sin(direction);

        velocityVector.x += vectorX * acceleration;
        velocityVector.y += vectorY * acceleration;
    };

    //------------------------------------------------------------------
    //
    // Rotates the player right based on how long it has been since the
    // last rotate took place.
    //------------------------------------------------------------------
    that.rotateRight = function(elapsedTime) {
        reportUpdate = true;
        direction += (rotateRate * elapsedTime);
    };

    //------------------------------------------------------------------
    //
    // Rotates the player left based on how long it has been since the
    // last rotate took place.
    //------------------------------------------------------------------
    that.rotateLeft = function(elapsedTime) {
        reportUpdate = true;
        direction -= (rotateRate * elapsedTime);
    };

    //------------------------------------------------------------------
    //
    // Function used to update the player during the game loop.
    //
    //------------------------------------------------------------------

    that.update = function(elapsedTime) {
        reportUpdate = true;

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

        if (position.x > 600) position.x = 0;
        if (position.x < 0) position.x = 600;
        if (position.y > 600) position.y = 0;
        if (position.y < 0) position.y = 600;
    };

    return that;
}

module.exports.create = () => createPlayer();
