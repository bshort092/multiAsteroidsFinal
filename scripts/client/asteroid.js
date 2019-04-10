MyGame.components.Asteroid = function() {
    'use strict';

    // let canvas = document.getElementById('canvas-main');

    let that = {
        position:{x: 0, y: 0},
        size: {width: 148, height: 148},
        direction: 0,
        rotation: 0,
        rotateRate: 0,
        speed: 0,
        update: function() {
            let vectorX = Math.cos(that.direction);
            let vectorY = Math.sin(that.direction);
        
            that.position.x += (vectorX * that.speed);
            that.position.y += (vectorY * that.speed);
        
            that.rotation += that.rotateRate;
        
            if (that.position.x - (that.size.width/2) > 600)  { that.position.x = 0 - (that.size.width/2); }
            if (that.position.x + (that.size.width/2)  < 0)      { that.position.x = 600 + (that.size.width/2); }
            if (that.position.y - (that.size.height/2) > 600) { that.position.y = 0 - (that.size.height/2); }
            if (that.position.y + (that.size.height/2) < 0)      { that.position.y = 600 + (that.size.height/2); }
            
            // if (position.x - (size.width/2) > canvas.width)  { position.x = 0 - (size.width/2); }
            // if (position.x + (size.width/2)  < 0)      { position.x = canvas.width + (size.width/2); }
            // if (position.y - (size.height/2) > canvas.height) { position.y = 0 - (size.height/2); }
            // if (position.y + (size.height/2) < 0)      { position.y = canvas.height + (size.height/2); }
        },
    }

    return that;
};
