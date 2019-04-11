//------------------------------------------------------------------
//
// Model for each player in the game.
//
//------------------------------------------------------------------

MyGame.components.Player = function () {
    'use strict';
    let that = {
        position: {
            x: 0,
            y: 0
        },

        momentum: {
            x: 0,
            y: 0
        },
    
        size: {
            width: 35,
            height: 35
        },
    
        direction: 0,
        rotateRate: 0,
        thrustRate: 0,
        maxSpeed: 0,

        thrust: function (elapsedTime) {

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
            that.direction += (that.rotateRate * elapsedTime);
        },

        rotateLeft: function (elapsedTime) {
            that.direction -= (that.rotateRate * elapsedTime);
        },
    
        update: function (elapsedTime) {

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
};
