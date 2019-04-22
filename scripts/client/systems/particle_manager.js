MyGame.systems.Manager = function(spec) {
    let graphics = MyGame.graphics;
    let renderer = MyGame.renderer;
    let systems = MyGame.systems;
    let assets = MyGame.assets;

    function createAsteroidBreakup(centerX, centerY) {
        let particlesSmoke = systems.ParticleSystem({
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let particlesFire = systems.ParticleSystem({
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let particlesYellow = systems.ParticleSystem({
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
    function createPowerupPickup(centerX, centerY) {
        let particlesWhite = systems.ParticleSystem({
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .1, stdev: .01 }
        });
        let particlesYellow = systems.ParticleSystem({
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .3, stdev: .01 }
        });
        let whiteRenderer = renderer.ParticleSystem(particlesWhite, graphics, assets['white']);
        let yellowRenderer = renderer.ParticleSystem(particlesYellow, graphics, assets['yellow']);

        spec.particlesArray.push({system: particlesWhite, renderer: whiteRenderer});
        spec.particlesArray.push({system: particlesYellow, renderer: yellowRenderer});
    }
    function createShipExplosion(centerX, centerY) {
        let particlesBlue = systems.ParticleSystem({
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let particlesGreen = systems.ParticleSystem({
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let greenRenderer = renderer.ParticleSystem(particlesGreen, graphics, assets['green']);
        let blueRenderer = renderer.ParticleSystem(particlesBlue, graphics, assets['blue']);

        spec.particlesArray.push({system: particlesBlue, renderer: blueRenderer});
        spec.particlesArray.push({system: particlesGreen, renderer: greenRenderer});
    }
    function createHyperspace(centerX, centerY) {
        let particlesBlack = systems.ParticleSystem({
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let particlesWhite = systems.ParticleSystem({
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let blackRenderer = renderer.ParticleSystem(particlesBlack, graphics, assets['black']);
        let whiteRenderer = renderer.ParticleSystem(particlesWhite, graphics, assets['white']);

        spec.particlesArray.push({system: particlesBlack, renderer: blackRenderer});
        spec.particlesArray.push({system: particlesWhite, renderer: whiteRenderer});
    }
    function createUFOExplosion(centerX, centerY) {
        let particlesRainbow = systems.ParticleSystem({
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let particlesWhite = systems.ParticleSystem({
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let particlesSmoke = systems.ParticleSystem({
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 1 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .08, stdev: .01}
        });
        let rainbowRenderer = renderer.ParticleSystem(particlesRainbow, graphics, assets['rainbow']);
        let whiteRenderer = renderer.ParticleSystem(particlesWhite, graphics, assets['white']);
        let smokeRenderer = renderer.ParticleSystem(particlesSmoke, graphics, assets['smoke']);

        spec.particlesArray.push({system: particlesSmoke, renderer: smokeRenderer});
        spec.particlesArray.push({system: particlesWhite, renderer: whiteRenderer});
        spec.particlesArray.push({system: particlesRainbow, renderer: rainbowRenderer});
    }
    function createThrustParticles(centerX, centerY) {
        let particlesFire = systems.ParticleSystem({
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 1 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .08, stdev: .01}
        });
        let particlesSmoke = systems.ParticleSystem({
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 1 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .08, stdev: .01}
        });
        let fireRenderer = renderer.ParticleSystem(particlesFire, graphics, assets['fire']);
        let smokeRenderer = renderer.ParticleSystem(particlesSmoke, graphics, assets['smoke']);

        spec.particlesArray.push({system: particlesFire, renderer: fireRenderer});
        spec.particlesArray.push({system: particlesSmoke, renderer: smokeRenderer});
    }

    function createSadParticles(centerX, centerY) {
        let particlesBlack = systems.ParticleSystem({
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 1 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let particlesSmoke = systems.ParticleSystem({
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let particlesBlue = systems.ParticleSystem({
            center: { x: centerX, y: centerY },
            size: { mean: 20, stdev: 5 },
            speed: { mean: 150, stdev: 50 },
            lifetime: { mean: .5, stdev: .1 }
        });
        let blackRenderer = renderer.ParticleSystem(particlesBlack, graphics, assets['black']);
        let smokeRenderer = renderer.ParticleSystem(particlesSmoke, graphics, assets['smoke']);
        let blueRenderer = renderer.ParticleSystem(particlesBlue, graphics, assets['blue']);

        spec.particlesArray.push({system: particlesBlue, renderer: blueRenderer});
        spec.particlesArray.push({system: particlesBlack, renderer: blackRenderer});
        spec.particlesArray.push({system: particlesSmoke, renderer: smokeRenderer});
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
        createPowerupPickup: createPowerupPickup,
        createShipExplosion: createShipExplosion,
        createUFOExplosion: createUFOExplosion,
        createHyperspace: createHyperspace,
        createThrustParticles: createThrustParticles,
        updateParticleSystems: updateParticleSystems,
        createSadParticles: createSadParticles,
        get particlesArray() { return spec.particlesArray; },
    };

    return api;
};