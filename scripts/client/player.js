//------------------------------------------------------------------
//
// Model for each player in the game.
//
//------------------------------------------------------------------

MyGame.components.Player = function () {
    'use strict';
    let that = {
        score: 0,
        playerNumber: null,

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
        radius: 0,

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

            let playerView = MyGame.components.Viewport.changeView(that.position); 
            if(playerView.y < (0.2*600) && that.position.y > (0.2*600)) {
                MyGame.components.Viewport.moveY(-1 * ((0.2*600) - playerView.y));  //up
            }
            if(playerView.y > (0.8*600) && that.position.y < 1152 - (0.2*600)) {
                MyGame.components.Viewport.moveY(playerView.y - (0.8*600)); //down
            }
            if(playerView.x < (0.2*600) && that.position.x > (0.2*600)) {
                MyGame.components.Viewport.moveX(-1 * ((0.2*600) - playerView.x)); //left
            }
            if(playerView.x > (0.8*600) && that.position.x < 1920 - (0.2*600)) {
                MyGame.components.Viewport.moveX(playerView.x - (0.8*600)); //right
            }
    
        }
        

    };

    return that;
};
