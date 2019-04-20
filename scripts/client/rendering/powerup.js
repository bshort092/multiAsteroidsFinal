// --------------------------------------------------------------
//
// Renders an animated model based on a spritesheet.
//
// --------------------------------------------------------------
MyGame.renderer.Powerup = (function (graphics) {
    'use strict';
    let that = {};
    let color = "";

    that.render = function (model, texture) {
        graphics.saveContext();
        graphics.drawSubTexture(texture, model.subImageIndex, model.subTextureWidth, model.position, model.size);
        if (model.type === 'rate') color = '#b87333';
        if (model.type === 'spread') color = '#c0c0c0';
        if (model.type === 'guided') color = '#ffd700';
        if (model.type === 'shield') color = 'lime';
        graphics.outlineObjectMiniMap(model.position, { width: 25, height: 25 }, 'white', color, true);

        graphics.restoreContext();
    };

    return that;

}(MyGame.graphics));
