MyGame.renderer.Ufo = (function(graphics) {
    'use strict';
    let that = {};

    that.render = function(model, texture) {
        graphics.saveContext();
        // graphics.rotateCanvas(model.position, model.direction);
        graphics.drawImage(texture, model.position, model.size, model.rotation);
        graphics.drawImageMiniMap(texture, model.position, model.size, model.rotation);
        graphics.restoreContext();
    };

    return that;

}(MyGame.graphics));