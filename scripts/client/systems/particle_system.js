MyGame.systems.ParticleSystem = function (spec) {

    let image = new Image();
    let imageReady = false;

    image.onload = function() {
        imageReady = true;
    };
    image.src = spec.imageSrc;

    let nextName = 1;
    let particles = {};

    let counter = 0;

    function create() {
        let size = Random.nextGaussian(spec.size.mean, spec.size.stdev);
        let p = {
            center: { x: spec.center.x, y: spec.center.y },
            size: { width: size, height: size },
            direction: Random.nextCircleVector(),
            speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
            rotation: 0,
            lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev), // seconds
            alive: 0
        };

        return p;
    }

    function update(elapsedTime, particleType) {
        let removeMe = [];

        elapsedTime = elapsedTime / 1000;
        counter += elapsedTime;

        if(counter < .3 && particleType === 'explosion') {
            for (let particle = 0; particle < 2; particle++) {
                particles[nextName++] = create();
            }
        }
        else if(counter < .1){
            for (let particle = 0; particle < 2; particle++) {
                particles[nextName++] = create();
            }
        }
        Object.getOwnPropertyNames(particles).forEach(value => {
            let particle = particles[value];

            particle.alive += elapsedTime;
            particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
            particle.center.y += (elapsedTime * particle.speed * particle.direction.y);

            particle.rotation += particle.speed / 500;

            if (particle.alive > particle.lifetime) {
                removeMe.push(value);
            }
        });

        for (let particle = 0; particle < removeMe.length; particle++) {
            delete particles[removeMe[particle]];
        }
    }

    let api = {
        update: update,
        get particles() { return particles; },
        get imageReady() { return imageReady; },
    };

    return api;
};