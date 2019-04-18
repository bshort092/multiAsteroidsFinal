MyGame.renderer.Tiles = (function(graphics) {
    'use strict';
    let that = {};

    function numberPad(n, p, c) {
        var pad_char = typeof c !== 'undefined' ? c : '0',
            pad = new Array(1 + p).join(pad_char);
        return (pad + n).slice(-pad.length);
    }

    that.render = function() {
        let tile = 0; 
        for(let row = 0; row < 9; row++){
            for(let col = 0; col < 15; col++){
                let tileFile = numberPad((tile++), 4);
                let tileSource = 'background' + tileFile;
                this.renderTile(col, row, MyGame.assets[tileSource])
            }
        }
    };

    that.renderTile = function(x, y, texture) {
        graphics.saveContext();
        graphics.drawImage(texture, {x: x * 128 + (128 / 2), y: y * 128 + (128 / 2)}, {width: 128, height: 128});
        graphics.restoreContext();
    }


    return that;

}(MyGame.graphics));