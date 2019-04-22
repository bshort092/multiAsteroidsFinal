'use strict';

let random = require('./random');

function createLaser(laserSpec, isGuided) {
    let that = {
        shipId: laserSpec.shipId,
        position: {
            x: laserSpec.position.x,
            y: laserSpec.position.y
        },

        size: {
            width: 25,
            height: 3
        },

        direction: laserSpec.direction,   // Angle in radians
        speed: laserSpec.speed,
        reportUpdate: false,
        lifetime: 1000,
        radius: 3,

        update: function (elapsedTime, flyingObjects) {
            that.reportUpdate = true;
            let vectorX = Math.cos(that.direction);
            let vectorY = Math.sin(that.direction);

            that.position.x += (vectorX * that.speed * elapsedTime);
            that.position.y += (vectorY * that.speed * elapsedTime);

            if(isGuided){
                let minimumDistance = 1000000;
                let minimumPosition = 0;
        
                for (let i = 0; i < flyingObjects.length; i++) {
                    let dx = that.position.x - flyingObjects[i].position.x;
                    let dy = that.position.y - flyingObjects[i].position.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
        
                    if (distance < minimumDistance) {
                        minimumDistance = distance;
                        minimumPosition = i;
                    }
                }
        
                var p1 = {
                    x: that.position.x,
                    y: that.position.y
                };
        
                var p2 = {
                    x: flyingObjects[minimumPosition].position.x,
                    y: flyingObjects[minimumPosition].position.y
                };
        
                // angle in radians
                that.direction = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            }

            // if (spec.center.x > MyGame.graphics.canvas.width) spec.center.x = 0;
            // if (spec.center.x < 0) spec.center.x = MyGame.graphics.canvas.width;
            // if (spec.center.y > MyGame.graphics.canvas.height) spec.center.y = 0;
            // if (spec.center.y < 0) spec.center.y = MyGame.graphics.canvas.height;
        },
    };

    //console.log(infoSpec);

    return that;
}

module.exports.create = (laserSpec, isGuided, flyingObjects) => createLaser(laserSpec, isGuided, flyingObjects);
