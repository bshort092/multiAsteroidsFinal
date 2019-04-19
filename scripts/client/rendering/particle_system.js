MyGame.renderer.ParticleSystem = function (system, graphics, image) {

    function render() {
        Object.getOwnPropertyNames(system.particles).forEach(function (value) {
            let particle = system.particles[value];
        graphics.drawImage(image, particle.center, particle.size, particle.rotation);
        graphics.drawImageMiniMap(image, particle.center, particle.size, particle.rotation);
        })
    }

    let api = {
        render: render
    };

    return api;
};