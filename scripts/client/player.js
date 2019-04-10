//------------------------------------------------------------------
//
// Model for each player in the game.
//
//------------------------------------------------------------------
let Laser = require('./laser');

MyGame.components.Player = function () {
    'use strict';
    let that = {
        position: {
            x: 0,
            y: 0
        },

        velocityVector: {
            x: 0,
            y: 0
        },
    
        size: {
            width: 35,
            height: 35
        },
    
        direction: 0,
        rotateRate: 0,
        acceleration: 0,
        maxSpeed: 0,

        move: function (elapsedTime) {

            let vectorX = Math.cos(that.direction);
            let vectorY = Math.sin(that.direction);
    
            that.velocityVector.x += vectorX * that.acceleration * elapsedTime / 100;
            that.velocityVector.y += vectorY * that.acceleration * elapsedTime / 100;
    
            if (that.velocityVector.x > that.maxSpeed) {
                that.velocityVector.x = that.maxSpeed;
            }
            if (that.velocityVector.x < 0 - that.maxSpeed) {
                that.velocityVector.x = 0 - that.maxSpeed;
            }
    
            if (that.velocityVector.y > that.maxSpeed) {
                that.velocityVector.y = that.maxSpeed;
            }
            if (that.velocityVector.y < 0 - that.maxSpeed) {
                that.velocityVector.y = 0 - that.maxSpeed;
            }
        },

        rotateRight: function (elapsedTime) {
            that.direction += (that.rotateRate * elapsedTime);
        },

        rotateLeft: function (elapsedTime) {
            that.direction -= (that.rotateRate * elapsedTime);
        },
    
        update: function (elapsedTime) {
    
            that.position.x += that.velocityVector.x;
            that.position.y += that.velocityVector.y;
    
            if (that.position.x > 590) {
                that.position.x = 590;
                that.velocityVector.x = 0;
            }
            if (that.position.x < 10) {
                that.position.x = 10;
                that.velocityVector.x = 0;
            }
            if (that.position.y > 590) {
                that.position.y = 590;
                that.velocityVector.y = 0;
            }
            if (that.position.y < 10) {
                that.position.y = 10;
                that.velocityVector.y = 0;
            }
    
            that.laserArray.forEach(laser => {
                laser.update(elapsedTime);
            });
        }

    };

    return that;
};
