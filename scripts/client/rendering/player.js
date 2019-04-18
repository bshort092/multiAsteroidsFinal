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
        graphics.outlineShipMiniMap(model.position, model.size, '#00faff')
        graphics.rotateCanvas(model.position, model.direction);
        graphics.drawImage(texture, model.position, model.size);
        graphics.rotateCanvasMiniMap(model.position, model.direction);
        graphics.drawImageMiniMap(texture, model.position, model.size);
        graphics.restoreContext();
    };

    return that;

}(MyGame.graphics));
