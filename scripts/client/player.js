//------------------------------------------------------------------
//
// Model for each player in the game.
//
//------------------------------------------------------------------
let Laser = require('./laser');

MyGame.components.Player = function () {
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
        width: 35,
        height: 35
    };

    let direction = 0;
    let rotateRate = 0;
    let acceleration = 0;
    let maxSpeed = 0;
    let laserArray = [];

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
    that.move = function (elapsedTime) {

        let vectorX = Math.cos(direction);
        let vectorY = Math.sin(direction);

        velocityVector.x += vectorX * acceleration * elapsedTime / 100;
        velocityVector.y += vectorY * acceleration * elapsedTime / 100;

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
    };

    that.fireLaser = function () {
        // //if (canFire) {
        // //canFire = false;

        // let myLaserSpec = {
        //     direction : direction,
        //     position : position
        // }

        // //console.log(Laser);

        // //console.log(myLaserSpec);

        // let myLaser = Laser.create();
        // laserArray.push(myLaser);

        // if (laserArray.length > 10) {
        //     laserArray.shift();
        // }

        // //}
    }

    //------------------------------------------------------------------
    //
    // Public function that rotates the player right.
    //
    //------------------------------------------------------------------
    that.rotateRight = function (elapsedTime) {
        direction += (rotateRate * elapsedTime);
    };

    //------------------------------------------------------------------
    //
    // Public function that rotates the player left.
    //
    //------------------------------------------------------------------
    that.rotateLeft = function (elapsedTime) {
        direction -= (rotateRate * elapsedTime);
    };

    that.update = function (elapsedTime) {

        position.x += velocityVector.x;
        position.y += velocityVector.y;

        if (position.x > 590) {
            position.x = 590;
            velocityVector.x = 0;
        }
        if (position.x < 10) {
            position.x = 10;
            velocityVector.x = 0;
        }
        if (position.y > 590) {
            position.y = 590;
            velocityVector.y = 0;
        }
        if (position.y < 10) {
            position.y = 10;
            velocityVector.y = 0;
        }

        laserArray.forEach(laser => {
            laser.update(elapsedTime);
        });
    }

    return that;
};
