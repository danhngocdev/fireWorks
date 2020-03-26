const WIDTH = 1900;
const HEIGHT = 1000;
const PARTICLE_SIZE = 7;
const SIZENHO = 0.1;
const SPEED_CHANGE = 0.1;
const GIATOC = 0.12;
const DOT_CHANGE_SIZE_SPEED = 0.2;
const DOT_ALPHA = 0.07;
const PARTICLE_MIN_SPEED = 7;

const NUMBER_PARTICLE_PER_BULLET = 30;

class particle {
    constructor(bullet, deg) {
        this.bullet = bullet;
        this.ctx = this.bullet.ctx;
        this.deg = deg;
        this.x = this.bullet.x;
        this.y = this.bullet.y;
        this.size = PARTICLE_SIZE;
        this.speed = Math.random() * 5 + PARTICLE_MIN_SPEED;
        this.speedX = 0;
        this.speedY = 0;
        this.fallspeed = 0;
        this.color = this.bullet.color;
        this.dots = [
            // { x: 10, y: 10, alpha: 1,size:10 }
        ];
    }
    update() {
        this.speed -= SPEED_CHANGE;
        if (this.speed < 0) {
            this.speed = 0;
        }

        this.fallspeed += GIATOC;

        this.speedX = this.speed * Math.cos(this.deg);
        this.speedY = this.speed * Math.sin(this.deg) + this.fallspeed;

        //tính vị trí

        this.x += this.speedX;
        this.y += this.speedY;


        if (this.size > SIZENHO) {
            this.size -= SIZENHO;
        }


        if (this.size > 0) {
            this.dots.push(
                {
                    x: this.x,
                    y: this.y,
                    alpha: 1,
                    size: this.size
                })
        }
        this.dots.forEach(dot => {
            dot.size -= DOT_CHANGE_SIZE_SPEED;
            dot.alpha -= DOT_ALPHA;
        });

        this.dots = this.dots.filter(dot => {
            return dot.size > 0;
        });

        if (this.dots.length == 0) {
            this.remove();
        }
    }

    remove() {
        this.bullet.particles.splice(this.bullet.particles.indexOf(this), 1)
    }
    draw() {
        this.dots.forEach(dot => {
            this.ctx.fillStyle = 'rgba(' + this.color + ',' + dot.alpha + ')';
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
            this.ctx.fill();
        })

    }
}

class bullet {
    constructor(fireworks) {
        this.fireworks = fireworks;
        this.ctx = fireworks.ctx;
        // tọa độ
        this.x = Math.random() * WIDTH;
        this.y = Math.random() * HEIGHT / 2;
        //Ramdom màu pháo
        this.color = Math.floor(Math.random() * 255) + ',' +
            Math.floor(Math.random() * 255) + ',' +
            Math.floor(Math.random() * 255);

        // hạt quả pháo
        this.particles = [
            // tạo 1 particle

        ];

        let bulletDeg = Math.PI * 2 / NUMBER_PARTICLE_PER_BULLET;

        for (let i = 0; i < NUMBER_PARTICLE_PER_BULLET; i++) {
            let newPaticle = new particle(this, i * bulletDeg);
            this.particles.push(newPaticle);
        }

    }

    remove() {
        this.fireworks.bullets.splice(this.fireworks.bullets.indexOf(this), 1);
    }
    update() {
        if (this.particles.length == 0) {
            this.remove();
        }
        this.particles.forEach(particle => particle.update());
    }
    draw() {
        this.particles.forEach(particle => particle.draw());
    }
}

class fireworks {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT; 
        // var sound      = document.createElement('audio');
        // sound.id       = 'audio-player';
        // sound.controls = 'controls';
        // sound.src      = 'media/happynewyear.mp3';
        // sound.type     = 'audio/mpeg';
        // sound.autoplay = true;
        // document.getElementById('song')

        // var img = new Image();
        // var background = new Image();
        // background.src = "http://www.samskirrow.com/background.png";
        
        // // Make sure the image is loaded first otherwise nothing will draw.
        // background.onload = function(){
        //     this.ctx.drawImage(background,0,0);   
        // }
        // img.src= 'https://vcdn-vnexpress.vnecdn.net/2019/12/26/thiep-chuc-mung-8574-1577348291.jpg';
        
        
        document.body.appendChild(this.canvas);
        // document.body.appendChild(sound)

        this.bullets = [];

        setInterval(() => {
            let newBullet = new bullet(this);
            this.bullets.push(newBullet);
        }, 500)

        this.loop();
    }
    loop() {
        this.bullets.forEach(bullet => bullet.update());
        this.draw();
        setTimeout(() => this.loop(), 20);
    }

    clearScreen() {
        
  
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);

    }

    draw() {
        this.clearScreen();
        this.bullets.forEach(bullet => bullet.draw());
    }
}
var f = new fireworks();