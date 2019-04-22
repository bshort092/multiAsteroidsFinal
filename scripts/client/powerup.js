MyGame.components.Powerup = function () {
    'use strict';

    let that = {

        position: {
            x: 0,
            y: 0
        },

        size: {
            width: 50,
            height: 35
        },

        radius: 25,
        type: "",
        spriteCount: 8,
        spriteTime: [100, 100, 100, 100, 100, 100, 100, 100],

        animationTime: 0,
        subImageIndex: 0,
        subTextureWidth: 256 / 8,
    
        //------------------------------------------------------------------
        //
        // Update the state of the animation
        //
        //------------------------------------------------------------------
        update: function (elapsedTime){
            that.animationTime += elapsedTime;
            //
            // Check to see if we should update the animation frame
            if (that.animationTime >= that.spriteTime[that.subImageIndex]) {
                //
                // When switching sprites, keep the leftover time because
                // it needs to be accounted for the next sprite animation frame.
                that.animationTime = that.spriteTime[that.subImageIndex];
                that.subImageIndex += 1;
                //
                // Wrap around from the last back to the first sprite as needed
                that.subImageIndex = that.subImageIndex % that.spriteCount;
            }
        },

    };
    return that;
}