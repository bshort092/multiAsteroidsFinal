MyGame.components.Laser = function () {
    'use strict';

    let that = {
        shipId: "",

        position: {
            x: 0,
            y: 0
        },

        size: {
            width: 25,
            height: 3
        },

        direction: 0,
        speed: 0,
        lifetime: 0,
        radius: 0,

        update: function (elapsedTime) {
            let vectorX = Math.cos(that.direction);
            let vectorY = Math.sin(that.direction);

            that.position.x += (vectorX * that.speed * elapsedTime);
            that.position.y += (vectorY * that.speed * elapsedTime);
        },
    };
    return that;

}