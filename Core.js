Array.prototype.erase = function (item) {
    for (var i = this.length; i--; i) {
        if (this[i] === item) this.splice(i, 1);
    }

    return this;
};

Function.prototype.bind = function (bind) {
    var self = this;
    return function () {
        var args = Array.prototype.slice.call(arguments);
        return self.apply(bind || null, args);
    };
};

merge = function (original, extended) {
    for (var key in extended) {
        var ext = extended[key];
        if (typeof (ext) != 'object' || ext instanceof Class) {
            original[key] = ext;
        } else {
            if (!original[key] || typeof (original[key]) != 'object') {
                original[key] = {};
            }
            merge(original[key], ext);
        }
    }
    return original;
};

function copy(object) {
    if (!object || typeof (object) != 'object' || object instanceof Class) {
        return object;
    } else if (object instanceof Array) {
        var c = [];
        for (var i = 0, l = object.length; i < l; i++) {
            c[i] = copy(object[i]);
        }
        return c;
    } else {
        var c = {};
        for (var i in object) {
            c[i] = copy(object[i]);
        }
        return c;
    }
}

function ksort(obj) {
    if (!obj || typeof (obj) != 'object') {
        return [];
    }

    var keys = [],
        values = [];
    for (var i in obj) {
        keys.push(i);
    }

    keys.sort();
    for (var i = 0; i < keys.length; i++) {
        values.push(obj[keys[i]]);
    }

    return values;
}

// -----------------------------------------------------------------------------
// Class object based on John Resigs code; inspired by base2 and Prototype
// http://ejohn.org/blog/simple-javascript-inheritance/
(function () {
    var initializing = false,
        fnTest = /xyz/.test(function () {
            xyz;
        }) ? /\bparent\b/ : /.*/;

    this.Class = function () {
    };
    var inject = function (prop) {
        var proto = this.prototype;
        var parent = {};
        for (var name in prop) {
            if (typeof (prop[name]) == "function" && typeof (proto[name]) == "function" && fnTest.test(prop[name])) {
                parent[name] = proto[name]; // save original function
                proto[name] = (function (name, fn) {
                    return function () {
                        var tmp = this.parent;
                        this.parent = parent[name];
                        var ret = fn.apply(this, arguments);
                        this.parent = tmp;
                        return ret;
                    };
                })(name, prop[name]);
            } else {
                proto[name] = prop[name];
            }
        }
    };

    this.Class.extend = function (prop) {
        var parent = this.prototype;

        initializing = true;
        var prototype = new this();
        initializing = false;

        for (var name in prop) {
            if (typeof (prop[name]) == "function" && typeof (parent[name]) == "function" && fnTest.test(prop[name])) {
                prototype[name] = (function (name, fn) {
                    return function () {
                        var tmp = this.parent;
                        this.parent = parent[name];
                        var ret = fn.apply(this, arguments);
                        this.parent = tmp;
                        return ret;
                    };
                })(name, prop[name]);
            } else {
                prototype[name] = prop[name];
            }
        }

        function Class() {
            if (!initializing) {

                // If this class has a staticInstantiate method, invoke it
                // and check if we got something back. If not, the normal
                // constructor (init) is called.
                if (this.staticInstantiate) {
                    var obj = this.staticInstantiate.apply(this, arguments);
                    if (obj) {
                        return obj;
                    }
                }

                for (var p in this) {
                    if (typeof (this[p]) == 'object') {
                        this[p] = copy(this[p]); // deep copy!
                    }
                }

                if (this.init) {
                    this.init.apply(this, arguments);
                }
            }

            return this;
        }

        Class.prototype = prototype;
        Class.constructor = Class;
        Class.extend = arguments.callee;
        Class.inject = inject;

        return Class;
    };

})();

// =====================================================================================================================
// GAME
// =====================================================================================================================
var body = document.getElementById('body');
var canvas = document.createElement('canvas');
console.log(body.offsetHeight);
var CANVAS_WIDTH = canvas.width = body.offsetWidth;
var CANVAS_HEIGHT = canvas.height = body.offsetHeight;

body.appendChild(canvas);
canvas = canvas.getContext('2d');
canvas.globalCompositeOperation = "lighter";

var FPS = 30;

var update = new Event('update');
var draw = new Event('draw');

setInterval(function () {
    canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    document.dispatchEvent(update);
    document.dispatchEvent(draw);
}, 1000 / FPS);

function bind(scope, fn) {
    return function () {
        return fn.apply(scope, arguments);
    }
};

function drawLine(begin, end, color, lineWidth) {
    canvas.save();
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = lineWidth || 3;
    canvas.strokeStyle = color || 'rgb(255, 45, 251)';
    canvas.stroke();
    canvas.closePath();
    canvas.restore();
}

function drawLineWithAngle(begin, angle, length, color, lineWidth) {
    angle = ((270 + angle) % 360);
    var end = {
        'x': (begin.x + length * Math.cos(angle * Math.PI / 180)),
        'y': (begin.y + length * Math.sin(angle * Math.PI / 180))
    };
    canvas.save();
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = lineWidth || 3;
    canvas.strokeStyle = color || 'rgb(255, 45, 251)';
    canvas.stroke();
    canvas.closePath();
    canvas.restore();
}

function drawCircle(center, color, r) {
    canvas.save();
    canvas.beginPath();
    canvas.lineWidth = 0;
    //canvas.fillStyle = color || 'rgba(255, 55, 55, 1)';
    var p = {};
    p.r = Math.round(Math.random() * 255);
    p.g = Math.round(Math.random() * 255);
    p.b = Math.round(Math.random() * 255);
    p.opacity = .8;

    var gradient = canvas.createRadialGradient(center.x, center.y, 0, center.x, center.y, r * 2);
    gradient.addColorStop(0, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
    gradient.addColorStop(0.5, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
    gradient.addColorStop(1, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", 0)");
    canvas.fillStyle = gradient;

    canvas.arc(center.x, center.y, (r || 4), 0, 2 * Math.PI, false);
    canvas.fill();
    canvas.closePath();
    canvas.restore();
}

// INTERSECTIONS
// =============================================================================
function lineIntersect(p1, p2, p3, p4) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
    };
    denominator = ((p4.y - p3.y) * (p2.x - p1.x)) - ((p4.x - p3.x) * (p2.y - p1.y));
    if (denominator == 0) {
        return false;
    }
    a = p1.y - p3.y;
    b = p1.x - p3.x;
    numerator1 = ((p4.x - p3.x) * a) - ((p4.y - p3.y) * b);
    numerator2 = ((p2.x - p1.x) * a) - ((p2.y - p1.y) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    result.x = p1.x + (a * (p2.x - p1.x));
    result.y = p1.y + (a * (p2.y - p1.y));

    if ((a > 0 && a < 1) && (b > 0 && b < 1))
        return {'x': result.x, 'y': result.y};
    else
        return false;

};

// =============================================================================
// Keyboard Controls
// =============================================================================
var key = {};
var keyMap = {32: 'space', 37: 'left', 38: 'up', 39: 'right', 40: 'down'};
document.addEventListener('keydown', function (e) {
    if (e.keyCode >= 37 && e.keyCode <= 40 || e.keyCode == 32)
        e.preventDefault();
    key[keyMap[e.keyCode]] = 'down';
    key.ctrl = e.ctrlKey;
    key.shift = e.shiftKey;
}, false);
document.addEventListener('keyup', function (e) {
    if (e.keyCode >= 37 && e.keyCode <= 40 || e.keyCode == 32)
        e.preventDefault();
    key[keyMap[e.keyCode]] = 'up';
    key.ctrl = e.ctrlKey;
    key.shift = e.shiftKey;
}, false);
	