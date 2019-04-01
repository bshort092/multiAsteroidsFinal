//------------------------------------------------------------------
//
// Model for each player in the game.
//
//------------------------------------------------------------------
MyGame.components.Player = function() {
    'use strict';
    let that = {};
    let position = {
        x: 0,
        y: 0
    };
    let velocityVector = {
        x: 0,
        y: 0
    };
    let size = {
        width: 0.05,
        height: 0.05
    };
    let direction = 0;
    let rotateRate = 0;
    let speed = 0;
    let acceleration = 100;
    let maxSpeed = 10;

    Object.defineProperty(that, 'direction', {
        get: () => direction,
        set: (value) => { direction = value }
    });

    Object.defineProperty(that, 'velocityVector', {
        get: () => velocityVector,
        set: (value) => { velocityVector = value }
    });

    Object.defineProperty(that, 'acceleration', {
        get: () => acceleration,
        set: (value) => { acceleration = value }
    });

    Object.defineProperty(that, 'maxSpeed', {
        get: () => maxSpeed,
        set: (value) => { maxSpeed = value }
    });

    Object.defineProperty(that, 'speed', {
        get: () => speed,
        set: value => { speed = value; }
    });

    Object.defineProperty(that, 'rotateRate', {
        get: () => rotateRate,
        set: value => { rotateRate = value; }
    });

    Object.defineProperty(that, 'position', {
        get: () => position
    });

    Object.defineProperty(that, 'size', {
        get: () => size
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
};
