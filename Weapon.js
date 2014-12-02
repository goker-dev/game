// WEAPON
// =============================================================================
var Weapon = Class.extend({
    ID: 0,
    size: 0,
    angle: 0,
    range: 0,
    noise: 0,
    distance: 0,
    marker: 0,
    bullets: [],
    init: function (size, angle, range) {
        this.size = size;
        this.angle = (360 + angle) % 360;
        this.range = range;
        this.distance = 0;
        this.intersection = {'x': 0, 'y': 0};
    },
    cool: function () {
    },
    fire: function (x, y, angle) {
        this.bullets.push(new Bullet(x, y, angle, 10, 5));
        return;
        this.distance = 0;
        totalAngle = (360 + (this.angle + angle)) % 360;
        this.marker = {
            'x': (x + this.range * Math.sin(totalAngle * Math.PI / 180)),
            'y': (y - this.range * Math.cos(totalAngle * Math.PI / 180))
        };
        drawLine({'x': x, 'y': y}, this.marker, 'rgba(246, 66, 36, .5)', 3);
        return this.distance == this.range ? 0 : this.distance;
    },
    update: function () {
        for (var i in this.bullets) {
            if (this.bullets[i].life)
                this.bullets[i].update();
        }
    },
    draw: function () {
        for (var i in this.bullets) {
            if (this.bullets[i].life)
                this.bullets[i].draw();
            else if (this.bullets[i].life <= 0) {
                this.bullets.splice(i, 1);
            }
        }
    }
});