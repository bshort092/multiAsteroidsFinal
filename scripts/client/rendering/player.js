// ------------------------------------------------------------------
//
// Rendering function for a Player object.
//
// ------------------------------------------------------------------
MyGame.renderer.Player = (function(graphics) {
    'use strict';
    let that = {};

    // ------------------------------------------------------------------
    //
    // Renders a Player model.
    //
    // ------------------------------------------------------------------
    that.render = function(model, texture) {
        graphics.saveContext();
        graphics.rotateCanvas(model.position, model.direction);
        graphics.drawImage(texture, model.position, model.size);
        graphics.restoreContext();

        model.laserArray.forEach(laser => {
            graphics.saveContext();
            graphics.rotateCanvas(laser.postion, laser.direction);
            graphics.drawImage(MyGame.assets['laser'], laser.position, laser.size);
            grapcics.restoreContext();
        })
    };

    return that;

}(MyGame.graphics));
