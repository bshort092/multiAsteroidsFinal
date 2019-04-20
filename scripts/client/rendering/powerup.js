MyGame.renderer.Powerup = (function(graphics) {
    'use strict';
    let that = {};

    that.render = function(model, texture) {
        graphics.saveContext();
        graphics.drawImage(texture, model.position, model.size);
        graphics.drawImageMiniMap(texture, model.position, model.size);
        graphics.restoreContext();
    };

    return that;

}(MyGame.graphics));