// BULLET
// =============================================================================
var Bullet = Class.extend({
    x: 0,
    y: 0,
    size: 0,
    angle: 0,
    speed: 0,
    life: 100,
    intersection: 0,
    init: function (x, y, angle, speed, size) {
        this.x = x;
        this.y = y;
        this.angle = (360 + angle) % 360;
        this.speed = speed;
        this.size = size;
        //document.addEventListener("update", bind(this, this.update), false);
        //document.addEventListener("draw", bind(this, this.draw), false);
    },
    destroy: function () {
        //document.removeEventListener("update", bind(this, this.update), false);
        //document.removeEventListener("draw", bind(this, this.draw), false);
        //delete this;
    },
    update: function () {
        if ((this.life--) < 0)
            this.destroy();
        if (this.x > CANVAS_WIDTH || this.x < 0) {
            this.angle = 360 - this.angle;
        } else if (this.y > CANVAS_HEIGHT || this.y < 0) {
            this.angle = 180 - this.angle;
        }
        var radians = this.angle * Math.PI / 180;
        this.x += this.speed * Math.sin(radians);
        this.y += this.speed * -Math.cos(radians);
    },
    draw: function () {
        drawCircle(this, 'rgba(255, 255, 155, .8)', this.size);
    }
});