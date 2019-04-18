MyGame.components.Asteroid = function() {
    'use strict';

    let that = {
        position:{x: 0, y: 0},
        size: {width: 0, height: 0},
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
        
            if (that.position.x - (that.size.width/2) > 1920)  { that.position.x = 0 - (that.size.width/2); }
            if (that.position.x + (that.size.width/2)  < 0)      { that.position.x = 1920 + (that.size.width/2); }
            if (that.position.y - (that.size.height/2) > 1152) { that.position.y = 0 - (that.size.height/2); }
            if (that.position.y + (that.size.height/2) < 0)      { that.position.y = 1152 + (that.size.height/2); }
        },
    }

    return that;
};
