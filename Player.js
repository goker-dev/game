// PLAYER
// =============================================================================
var Player = Class.extend({
    _eventListeners: [],
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
    init: function (opt) {
        this.size = opt.size || 20;
        this.x = opt.x || 0;
        this.y = opt.y || 0;
        this.angle = opt.angle || 0;
        this.speed = opt.speed || 5;
        this.setColor(opt.color || '242,177,56,.8');
    },
    spawn: function () {
        this.updateFunc = bind(this, this.update);
        this.drawFunc = bind(this, this.draw);
        document.addEventListener("update", this.updateFunc, false);
        document.addEventListener("draw", this.drawFunc, false);
    },
    destroy: function () {
        this.fire('destroy');
        document.removeEventListener("draw", this.drawFunc, false);
        document.removeEventListener("update", this.updateFunc, false);
        delete this;
    },
    setColor: function (rgba) {
        rgba = rgba.replace(/ /, '').split(/,/)
        this.color = {};
        this.color.r = rgba[0] || Math.round(Math.random() * 255);
        this.color.g = rgba[1] || Math.round(Math.random() * 255);
        this.color.b = rgba[2] || Math.round(Math.random() * 255);
        this.color.opacity = rgba[3] || .8;
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

Player.prototype.addEventListener = function (type, listener) {
    if (typeof this._eventListeners[type] == "undefined") {
        this._eventListeners[type] = [];
    }
    this._eventListeners[type].push(listener);
};
Player.prototype.fire = function (event) {
    if (typeof event == "string") {
        event = {type: event};
    }
    if (!event.target) {
        event.target = this;
    }
    if (!event.type) {
        throw new Error("Event object missing 'type' property.");
    }
    if (this._eventListeners[event.type] instanceof Array) {
        var listeners = this._eventListeners[event.type];
        for (var i = 0, len = listeners.length; i < len; i++) {
            listeners[i].call(this, event);
        }
    }
};
Player.prototype.removeEventListener = function (type, listener) {
    if (this._eventListeners[type] instanceof Array) {
        var listeners = this._eventListeners[type];
        for (var i = 0, len = listeners.length; i < len; i++) {
            if (listeners[i] === listener) {
                listeners.splice(i, 1);
                break;
            }
        }
    }

};