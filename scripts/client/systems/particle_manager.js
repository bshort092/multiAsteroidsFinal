MyGame.systems.Manager = function(spec) {
    let graphics = MyGame.graphics;
    let renderer = MyGame.renderer;
    let systems = MyGame.systems;
    let assets = MyGame.assets;


    function createAsteroidBreakup(centerX, centerY) {
        let particlesSmoke = systems.ParticleSystem({
            imageSrc: assets['smoke'],
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let particlesFire = systems.ParticleSystem({
            imageSrc: assets['fire'],
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let particlesYellow = systems.ParticleSystem({
            imageSrc: assets['yellow'],
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let smokeRenderer = renderer.ParticleSystem(particlesSmoke, graphics, assets['smoke']);
        let fireRenderer = renderer.ParticleSystem(particlesFire, graphics, assets['fire']);
        let yellowRenderer = renderer.ParticleSystem(particlesYellow, graphics, assets['yellow']);

        spec.particlesArray.push({system: particlesSmoke, renderer: smokeRenderer});
        spec.particlesArray.push({system: particlesFire, renderer: fireRenderer});
        spec.particlesArray.push({system: particlesYellow, renderer: yellowRenderer});
    }
    function createUFOExplosion(centerX, centerY) {
        let particlesSmoke = systems.ParticleSystem({
            imageSrc: assets['smoke'],
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let particlesBlue = systems.ParticleSystem({
            imageSrc: assets['smoke'],
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let particlesRainbow = systems.ParticleSystem({
            imageSrc: assets['rainbow'],
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let smokeRenderer = renderer.ParticleSystem(particlesSmoke, graphics, assets['smoke']);
        let blueRenderer = renderer.ParticleSystem(particlesBlue, graphics, assets['blue']);
        let rainbowRenderer = renderer.ParticleSystem(particlesRainbow, graphics, assets['rainbow']);

        spec.particlesArray.push({system: particlesSmoke, renderer: smokeRenderer});
        spec.particlesArray.push({system: particlesBlue, renderer: blueRenderer});
        spec.particlesArray.push({system: particlesRainbow, renderer: rainbowRenderer});
    }
    function createShipExplosion(centerX, centerY) {
        let particlesSmoke = systems.ParticleSystem({
            imageSrc: assets['smoke'],
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let particlesWhite = systems.ParticleSystem({
            imageSrc: assets['white'],
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let particlesGreen = systems.ParticleSystem({
            imageSrc: assets['green'],
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let smokeRenderer = renderer.ParticleSystem(particlesSmoke, graphics, assets['smoke']);
        let whiteRenderer = renderer.ParticleSystem(particlesWhite, graphics, assets['white']);
        let greenRenderer = renderer.ParticleSystem(particlesGreen, graphics, assets['green']);

        spec.particlesArray.push({system: particlesSmoke, renderer: smokeRenderer});
        spec.particlesArray.push({system: particlesWhite, renderer: whiteRenderer});
        spec.particlesArray.push({system: particlesGreen, renderer: greenRenderer});
    }
    function createShipAsteroidExplosion(centerX, centerY) {
        let particlesGreen = systems.ParticleSystem({
            imageSrc: assets['green'],
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let particlesSmoke = systems.ParticleSystem({
            imageSrc: assets['smoke'],
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let particlesYellow = systems.ParticleSystem({
            imageSrc: assets['yellow'],
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let greenRenderer = renderer.ParticleSystem(particlesGreen, graphics, assets['green']);
        let smokeRenderer = renderer.ParticleSystem(particlesSmoke, graphics, assets['smoke']);
        let yellowRenderer = renderer.ParticleSystem(particlesYellow, graphics, assets['yellow']);

        spec.particlesArray.push({system: particlesGreen, renderer: greenRenderer});
        spec.particlesArray.push({system: particlesSmoke, renderer: smokeRenderer});
        spec.particlesArray.push({system: particlesYellow, renderer: yellowRenderer});
    }
    function createShipUFOExplosion(centerX, centerY) {
        let particlesRainbow = systems.ParticleSystem({
            imageSrc: assets['rainbow'],
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let particlesGreen = systems.ParticleSystem({
            imageSrc: assets['green'],
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let rainbowRenderer = renderer.ParticleSystem(particlesRainbow, graphics, assets['rainbow']);
        let greenRenderer = renderer.ParticleSystem(particlesGreen, graphics, assets['green']);

        spec.particlesArray.push({system: particlesRainbow, renderer: rainbowRenderer});
        spec.particlesArray.push({system: particlesGreen, renderer: greenRenderer});
    }
    function createThrustParticles(centerX, centerY) {
        let particlesWhite = systems.ParticleSystem({
            imageSrc: assets['white'],
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 1 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .08, stdev: .01}
        });
        let particlesGreen = systems.ParticleSystem({
            imageSrc: 'assets/particles/greenLight.png',
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 1 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .08, stdev: .01}
        });
        let whiteRenderer = renderer.ParticleSystem(particlesWhite, graphics, 'assets/particles/whiteLight.png');
        let greenRenderer = renderer.ParticleSystem(particlesGreen, graphics, 'assets/particles/greenLight.png');

        spec.particlesArray.push({system: particlesWhite, renderer: whiteRenderer});
        spec.particlesArray.push({system: particlesGreen, renderer: greenRenderer});
    }

    function updateParticleSystems(elapsedTime){
        for (let particleSystem of spec.particlesArray) {
            particleSystem.system.update(elapsedTime, 'explosion');
        }
        // delete old particle systems:
        for (let particleSystem of spec.particlesArray) {
            let isEmpty = true;
            for(let key in particleSystem.system.particles) {
                if(particleSystem.system.particles.hasOwnProperty(key)) {
                    isEmpty = false;
                    break;
                }
            }
            if(isEmpty) {
                spec.particlesArray.shift();
            }
        }
    }
    let api = {
        createAsteroidBreakup: createAsteroidBreakup,
        createUFOExplosion: createUFOExplosion,
        createShipExplosion: createShipExplosion,
        createShipAsteroidExplosion: createShipAsteroidExplosion,
        createShipUFOExplosion: createShipUFOExplosion,
        createThrustParticles: createThrustParticles,
        updateParticleSystems: updateParticleSystems,
        get particlesArray() { return spec.particlesArray; },
    };

    return api;
};