MyGame.renderer.Laser = (function(graphics) {
    'use strict';
    let that = {};

    that.render = function(model, texture) {
        //console.log(model);
        //console.log(texture);
        graphics.saveContext();
        graphics.rotateCanvas(model.position, model.direction);
        graphics.drawImage(texture, model.position, model.size);
        graphics.restoreContext();
    };

    return that;

}(MyGame.graphics));