// ------------------------------------------------------------------
//
// Rendering function for a PlayerRemote object.
//
// ------------------------------------------------------------------
MyGame.renderer.PlayerRemote = (function(graphics) {
    'use strict';
    let that = {};

    // ------------------------------------------------------------------
    //
    // Renders a PlayerRemote model.
    //
    // ------------------------------------------------------------------
    that.render = function(model, texture) {
        graphics.saveContext();
        graphics.outlineObjectMiniMap(model.state.position, model.size, '#43ff00')
        graphics.rotateCanvas(model.state.position, model.state.direction);
        graphics.drawImage(texture, model.state.position, model.size);
        graphics.rotateCanvasMiniMap(model.state.position, model.state.direction);
        graphics.drawImageMiniMap(texture, model.state.position, model.size);
        graphics.restoreContext();
    };

    return that;

}(MyGame.graphics));
