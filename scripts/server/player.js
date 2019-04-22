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
        score: 0,
        name: '',
        playerNumber: null,
        position: {
            x: Math.floor(random.nextDouble() * 600),
            y: Math.floor(random.nextDouble() * 600),
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
        radius: 35/2,
    
        //powerups 
        firingRate: 250,
        firingRateTime: 10000,

        hasWiderSpread: false,
        widerSpreadTime: 10000,

        hasShield: false,
        shieldTime: 10000,
        blinking: false,

        hasGuidedMissles: false,
        guidedMisslesTime: 10000,

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
            that.reportUpdate = true;

            if (intraUpdate === false) {
                elapsedTime -= that.lastUpdateDiff;
                that.lastUpdateDiff = 0;
            }
    
            that.position.x += (that.momentum.x * elapsedTime);
            that.position.y += (that.momentum.y * elapsedTime);

            if (that.position.y - (that.size.height/2) < 0) {
                that.position.y = (that.size.height/2);
                that.momentum.y = 0;
            }
            if (that.position.y + (that.size.height/2) > 1152) {
                that.position.y = 1152 - (that.size.height/2);
                that.momentum.y = 0;
            }
            if (that.position.x - (that.size.width/2) < (0)) {
                that.position.x = (that.size.width/2);
                that.momentum.x = 0;
            }
            if (that.position.x + (that.size.width/2) > 1920) {
                that.position.x = 1920 - (that.size.width/2);
                that.momentum.x = 0;
            }

            if(that.firingRate === 100){
                that.firingRateTime -= elapsedTime;
                if(that.firingRateTime <= 0){
                    that.firingRateTime = 10000;
                    that.firingRate = 250;
                }
            }

            if(that.hasWiderSpread){
                that.widerSpreadTime -= elapsedTime;
                if(that.widerSpreadTime <= 0){
                    that.widerSpreadTime = 10000;
                    that.hasWiderSpread = false;
                }
            }

            if(that.hasShield){
                that.shieldTime -= elapsedTime;
                if(that.shieldTime >= 900 && that.shieldTime < 1000){ that.blinking = true; }
                if(that.shieldTime >= 800 && that.shieldTime < 900){ that.blinking = false; }
                if(that.shieldTime >= 700 && that.shieldTime < 800){ that.blinking = true; }
                if(that.shieldTime >= 600 && that.shieldTime < 700){ that.blinking = false; }
                if(that.shieldTime >= 500 && that.shieldTime < 600){ that.blinking = true; }
                if(that.shieldTime >= 400 && that.shieldTime < 500){ that.blinking = false; }
                if(that.shieldTime >= 300 && that.shieldTime < 400){ that.blinking = true; }
                if(that.shieldTime >= 200 && that.shieldTime < 300){ that.blinking = false; }
                if(that.shieldTime >= 100 && that.shieldTime < 200){ that.blinking = true; }
                if(that.shieldTime > 0 && that.shieldTime < 100){ that.blinking = false; }
                if(that.shieldTime <= 0){
                    that.shieldTime = 10000;
                    that.hasShield = false;
                    that.blinking = false;
                }
            }
        }
    };

    return that;
}

module.exports.create = () => createPlayer();
