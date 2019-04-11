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

        momentum: {
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

        thrustRate: .04,
        maxSpeed: .2,
        reportUpdate: false,        // Indicates if this model was updated during the last update
        lastUpdateDiff: 0,

        thrust: function (elapsedTime, updateDiff) {
            that.lastUpdateDiff += updateDiff;
            that.update(updateDiff, true);
            that.reportUpdate = true;

            let vectorX = Math.cos(that.direction);
            let vectorY = Math.sin(that.direction);

            that.momentum.x += (vectorX * that.thrustRate * elapsedTime/100);
            that.momentum.y += (vectorY * that.thrustRate * elapsedTime/100);

            if (that.momentum.x > that.maxSpeed) {
                that.momentum.x = that.maxSpeed;
            }
            if (that.momentum.x < 0 - that.maxSpeed) {
                that.momentum.x = 0 - that.maxSpeed;
            }

            if (that.momentum.y > that.maxSpeed) {
                that.momentum.y = that.maxSpeed;
            }
            if (that.momentum.y < 0 - that.maxSpeed) {
                that.momentum.y = 0 - that.maxSpeed;
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

        update: function(elapsedTime, intraUpdate) {

            if (intraUpdate === false) {
                elapsedTime -= that.lastUpdateDiff;
                that.lastUpdateDiff = 0;
            }
    
            that.position.x += (that.momentum.x * elapsedTime);
            that.position.y += (that.momentum.y * elapsedTime);

            if (that.position.x > 590) {
                that.position.x = 590;
                that.momentum.x = 0;
            }
            if (that.position.x < 10) {
                that.position.x = 10;
                that.momentum.x = 0;
            }
            if (that.position.y > 590) {
                that.position.y = 590;
                that.momentum.y = 0;
            }
            if (that.position.y < 10) {
                that.position.y = 10;
                that.momentum.y = 0;
            }
        }
    };

    return that;
}

module.exports.create = () => createPlayer();
