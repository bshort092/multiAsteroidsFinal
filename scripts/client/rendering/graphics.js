// ------------------------------------------------------------------
//
// This is the graphics rendering code for the game.
//
// ------------------------------------------------------------------
MyGame.graphics = (function () {
    'use strict';

    let canvas = document.getElementById('canvas-main');
    let context = canvas.getContext('2d')
    let canvas_minimap = document.getElementById('canvas-world');
    let context_minimap = canvas_minimap.getContext('2d');

    //------------------------------------------------------------------
    //
    // Place a 'clear' function on the Canvas prototype, this makes it a part
    // of the canvas, rather than making a function that calls and does it.
    //
    //------------------------------------------------------------------
    CanvasRenderingContext2D.prototype.clear = function () {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.clearRect(0, 0, canvas_minimap.width, canvas_minimap.height);
        this.restore();
    };

    //------------------------------------------------------------------
    //
    // Public function that allows the client code to clear the canvas.
    //
    //------------------------------------------------------------------
    function clear() {
        context.clear();
        context_minimap.clear();
    }

    //------------------------------------------------------------------
    //
    // Simple pass-through to save the canvas context.
    //
    //------------------------------------------------------------------
    function saveContext() {
        context.save();
        context_minimap.save();
    }

    //------------------------------------------------------------------
    //
    // Simple pass-through the restore the canvas context.
    //
    //------------------------------------------------------------------
    function restoreContext() {
        context.restore();
        context_minimap.restore();
    }

    //------------------------------------------------------------------
    //
    // Rotate the canvas to prepare it for rendering of a rotated object.
    //
    //------------------------------------------------------------------
    function rotateCanvas(center, rotation) {
        let centerView = MyGame.components.Viewport.changeView(center);
        context.translate(centerView.x, centerView.y);
        context.rotate(rotation);
        context.translate(-centerView.x, -centerView.y);
    }
    function rotateCanvasMiniMap(center, rotation) {
        context_minimap.translate(center.x / 1920 * canvas_minimap.width, center.y / 1152 * canvas_minimap.height);
        context_minimap.rotate(rotation);
        context_minimap.translate(-center.x / 1920 * canvas_minimap.width, -center.y / 1152 * canvas_minimap.height);
    }
    //------------------------------------------------------------------
    //
    // Draw an image into the local canvas coordinate system.
    //
    //------------------------------------------------------------------
    function drawImage(texture, center, size, rotation) {
        let localCenter = {
            x: MyGame.components.Viewport.changeViewX(center.x),
            y: MyGame.components.Viewport.changeViewY(center.y)
        };
        let localSize = {
            width: size.width, 
            height: size.height
        };
        
        context.translate(localCenter.x, localCenter.y);
        context.rotate(rotation);
        context.translate(-localCenter.x, -localCenter.y);

        context.drawImage(
            texture,
            localCenter.x - localSize.width / 2,
            localCenter.y - localSize.height / 2,
            localSize.width, localSize.height);
    }
    function drawImageMiniMap(texture, center, size, rotation) {
        let localCenter = {
            x: center.x / 1920 * canvas_minimap.width,
            y: center.y / 1152 * canvas_minimap.height
        };
        let localSize = {
            width: size.width / 1920 * canvas_minimap.width,
            height: size.height / 1152 * canvas_minimap.height
        };
        context_minimap.translate(localCenter.x, localCenter.y);
        context_minimap.rotate(rotation);
        context_minimap.translate(-localCenter.x, -localCenter.y);

        context_minimap.drawImage(
            texture,
            localCenter.x - localSize.width / 2,
            localCenter.y - localSize.height / 2,
            localSize.width, localSize.height);
    }

    return {
        clear: clear,
        saveContext: saveContext,
        restoreContext: restoreContext,
        rotateCanvas: rotateCanvas,
        rotateCanvasMiniMap: rotateCanvasMiniMap,
        drawImage: drawImage,
        drawImageMiniMap: drawImageMiniMap,
    };
}());
