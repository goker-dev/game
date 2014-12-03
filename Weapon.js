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
    ammo: 0,
    bullets: [],
    init: function (opt) {
        this.size = opt.size || 5;
        this.angle = (360 + (opt.angle || 0)) % 360;
        this.range = opt.range || 0;
        this.ammo = opt.ammo || 10;
        //this.distance = 0;
        //this.intersection = {'x': 0, 'y': 0};
    },
    cool: function () {
    },
    fire: function (x, y, angle) {
        if (this.ammo-- > 0) {
            Ammo.innerText = this.ammo;
            Score.innerText = Score.innerText * 1 - 1;
            this.bullets.push(new Bullet(x, y, angle, 10, 5));
            /*
             this.distance = 0;
             totalAngle = (360 + (this.angle + angle)) % 360;
             this.marker = {
             'x': (x + this.range * Math.sin(totalAngle * Math.PI / 180)),
             'y': (y - this.range * Math.cos(totalAngle * Math.PI / 180))
             };
             drawLine({'x': x, 'y': y}, this.marker, 'rgba(246, 66, 36, .5)', 3);
             return this.distance == this.range ? 0 : this.distance;
             */
        }
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