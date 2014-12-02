// ENEMY
// =============================================================================
var Enemy = Class.extend({
    sensors: [],
    size: 0,
    x: 0,
    y: 0,
    angle: 0,
    speed: 0,
    noise: 0,
    sensorMeasuring: 0,
    p_cache: .5,
    life: 0,
    spawning: false,
    weapon: null,
    init: function (size, x, y, angle, speed, life) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.angle = angle || 0;
        this.speed = speed || 5;
        this.life = life || 10;
        this.spawning = false;

        this.setColor();

        this.updateFunc = bind(this, this.update);
        this.drawFunc = bind(this, this.draw);
        document.addEventListener("update", this.updateFunc, false);
        document.addEventListener("draw", this.drawFunc, false);
    },
    destroy: function () {
        document.removeEventListener("draw", this.drawFunc, false);
        document.removeEventListener("update", this.updateFunc, false);
        delete this;
    },
    respawn: function () {
        if(!this.spawning) {
            this.spawning = true;
            this.init(this.size, Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT, this.angle, this.speed);
            this.destroy();
        }
    },
    setColor: function () {
        this.color = {};
        this.color.r = Math.round(Math.random() * 255);
        this.color.g = Math.round(Math.random() * 255);
        this.color.b = Math.round(Math.random() * 255);
        this.color.opacity = .8;
    },
    setWeapon: function (weapon) {
        this.weapon = weapon;
    },
    go: function (step) {
        if (this.x > CANVAS_WIDTH || this.x < 0) {
            this.angle = 360 - this.angle;
        } else if (this.y > CANVAS_HEIGHT || this.y < 0) {
            this.angle = 180 - this.angle;
        }
        var radians = this.angle * Math.PI / 180;
        this.x += step * Math.sin(radians);
        this.y += step * -Math.cos(radians);
    },
    turn: function (angle) {
        this.angle += angle;
        this.angle = (360 + (this.angle)) % 360;
    },
    move: function (x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
    },
    update: function () {
        if (this.x > CANVAS_WIDTH || this.x < 0) {
            this.angle = 360 - this.angle;
        } else if (this.y > CANVAS_HEIGHT || this.y < 0) {
            this.angle = 180 - this.angle;
        }
        var radians = this.angle * Math.PI / 180;
        this.x += this.speed * Math.sin(radians);
        this.y += this.speed * -Math.cos(radians);

        var bullets = player.getBullets();
        for (var i in bullets) {
            if (bullets[i] && Math.abs(this.x - bullets[i].x) <= this.size && Math.abs(this.y - bullets[i].y) <= this.size) {
                //this.life = -1;
                //this.destroy();
                this.respawn();
            }
        }

        //if (this.weapon)
        //    this.weapon.update();
    },
    draw: function () {
        canvas.save();
        canvas.beginPath();
        canvas.fillStyle = "rgba(" + this.color.r + ", " + this.color.g + ", " + this.color.b + ", " + this.color.opacity + ")";
        canvas.translate(this.x, this.y);
        canvas.rotate(this.angle * Math.PI / 180);
        canvas.moveTo(0, -this.size * .5);
        canvas.lineTo(0, -this.size * .5);
        canvas.lineTo(-this.size * .5, this.size * .5);
        canvas.lineTo(this.size * .5, this.size * .5);
        canvas.fill();
        //canvas.fillRect(0, 0, 10, 10);
        canvas.closePath();
        canvas.restore();
        if (this.weapon)
            this.weapon.draw();
    },
    toString: function () {
        return '[' + this.x + ',' + this.y + ']';
    }
});