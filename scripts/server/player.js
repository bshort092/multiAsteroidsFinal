// ------------------------------------------------------------------
//
// Nodejs module that represents the model for a player.
//
// ------------------------------------------------------------------
'use strict';

let random = require('./random');
let Laser = require('./laser');

//------------------------------------------------------------------
//
// Public function used to initially create a newly connected player
// at some random location.
//
//------------------------------------------------------------------
function createPlayer() {
    let that = {
        position: {
            x: Math.floor(random.nextDouble() * 600),
            y: Math.floor(random.nextDouble() * 600)
        },

        velocityVector: {
            x: 0,
            y: 0
        },

        size: {
            width: 35,
            height: 35
        },

        direction: random.nextDouble() * 2 * Math.PI,    // Angle in radians
        rotateRate: Math.PI / 1000,    // radians per millisecond
        reportUpdate: false,    // Indicates if this model was updated during the last update

        acceleration: .2,
        maxSpeed: 2,

        move: function (elapsedTime) {
            that.reportUpdate = true;

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
            that.reportUpdate = true;
            that.direction += (that.rotateRate * elapsedTime);
        },

        rotateLeft: function (elapsedTime) {
            that.reportUpdate = true;
            that.direction -= (that.rotateRate * elapsedTime);
        },

        update: function (elapsedTime) {
            that.reportUpdate = true;

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
        }
    };

    return that;
}

module.exports.create = () => createPlayer();
