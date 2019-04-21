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
        graphics.outlineObjectMiniMap(model.position, model.size, '#00faff')
        graphics.rotateCanvas(model.position, model.direction);
        graphics.drawImage(texture, model.position, model.size);
        graphics.rotateCanvasMiniMap(model.position, model.direction);
        graphics.drawImageMiniMap(texture, model.position, model.size);
        graphics.restoreContext();
        graphics.drawText({x: model.position.x - (model.size.width/ 2) - 10, y: model.position.y + (model.size.width / 2) + 10}, model.name, 'lightblue')
    };

    return that;

}(MyGame.graphics));
