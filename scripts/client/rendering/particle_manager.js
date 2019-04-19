MyGame.renderer.Manager = (function(graphics) {
    'use strict';

    function render(spec) {
        for (let particleSystem of spec.particlesArray) {
            particleSystem.renderer.render();
        }
    }
    return {
        render: render,
    };

}(MyGame.graphics));