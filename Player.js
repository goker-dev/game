// PLAYER
// =============================================================================
var Player = Class.extend({
    sensors: [],
    size: 0,
    x: 0,
    y: 0,
    angle: 0,
    speed: 0,
    noise: 0,
    sensorMeasuring: 0,
    p_cache: .5,
    weapon: null,
    init: function (size, x, y, angle, speed) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.angle = angle || 0;
        this.speed = speed || 5;

        this.setColor();

        document.addEventListener("update", bind(this, this.update), false);
        document.addEventListener("draw", bind(this, this.draw), false);
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
    getBullets: function () {
        return this.weapon.bullets;
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
        if (key.space === 'down') {
            this.weapon.fire(this.x, this.y, this.angle);

            //this.setColor();
        } else if (key.space === 'up')
            this.weapon.cool();

        if (key.up === 'down')
            this.go(this.speed);

        if (key.down === 'down')
            this.go(-this.speed);

        if (key.left === 'down')
            this.turn(-this.speed);

        if (key.right === 'down')
            this.turn(this.speed);

        if (this.weapon)
            this.weapon.update();
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