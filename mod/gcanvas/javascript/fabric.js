var fabric = fabric || {version: "2.4.2"};
"undefined" != typeof exports ? exports.fabric = fabric : "function" == typeof define && define.amd && define([], function() {
    return fabric
}), "undefined" != typeof document && "undefined" != typeof window ? (fabric.document = document, fabric.window = window) : (fabric.document = require("jsdom").jsdom(decodeURIComponent("%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E"), {features: {FetchExternalResources: ["img"]}}), fabric.jsdomImplForWrapper = require("jsdom/lib/jsdom/living/generated/utils").implForWrapper, fabric.nodeCanvas = require("jsdom/lib/jsdom/utils").Canvas, fabric.window = fabric.document.defaultView, DOMParser = require("xmldom").DOMParser), fabric.isTouchSupported = "ontouchstart" in fabric.window, fabric.isLikelyNode = "undefined" != typeof Buffer && "undefined" == typeof window, fabric.SHARED_ATTRIBUTES = ["display", "transform", "fill", "fill-opacity", "fill-rule", "opacity", "stroke", "stroke-dasharray", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "id", "paint-order", "instantiated_by_use", "clip-path"], fabric.DPI = 96, fabric.reNum = "(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)", fabric.fontPaths = {}, fabric.iMatrix = [1, 0, 0, 1, 0, 0], fabric.canvasModule = "canvas", fabric.perfLimitSizeTotal = 2097152, fabric.maxCacheSideLimit = 4096, fabric.minCacheSideLimit = 256, fabric.charWidthsCache = {}, fabric.textureSize = 2048, fabric.enableGLFiltering = !0, fabric.devicePixelRatio = fabric.window.devicePixelRatio || fabric.window.webkitDevicePixelRatio || fabric.window.mozDevicePixelRatio || 1, fabric.browserShadowBlurConstant = 1, fabric.arcToSegmentsCache = {}, fabric.boundsOfCurveCache = {}, fabric.cachesBoundsOfCurve = !0, fabric.initFilterBackend = function() {
    return fabric.enableGLFiltering && fabric.isWebglSupported && fabric.isWebglSupported(fabric.textureSize) ? (console.log("max texture size: " + fabric.maxTextureSize), new fabric.WebglFilterBackend({tileSize: fabric.textureSize})) : fabric.Canvas2dFilterBackend ? new fabric.Canvas2dFilterBackend : void 0
};
"undefined" != typeof document && "undefined" != typeof window && (window.fabric = fabric);
!function() {
    function e(e, i) {
        if (this.__eventListeners[e]) {
            var t = this.__eventListeners[e];
            i ? t[t.indexOf(i)] = !1 : fabric.util.array.fill(t, !1)
        }
    }

    function i(e, i) {
        if (this.__eventListeners || (this.__eventListeners = {}), 1 === arguments.length) {
            for (var t in e) {
                this.on(t, e[t]);
            }
        } else {
            this.__eventListeners[e] || (this.__eventListeners[e] = []), this.__eventListeners[e].push(i);
        }
        return this
    }

    function t(i, t) {
        if (this.__eventListeners) {
            if (0 === arguments.length) {
                for (i in this.__eventListeners) {
                    e.call(this, i);
                }
            } else if (1 === arguments.length && "object" == typeof arguments[0]) {
                for (var r in i) {
                    e.call(this, r, i[r]);
                }
            } else {
                e.call(this, i, t);
            }
            return this
        }
    }

    function r(e, i) {
        if (this.__eventListeners) {
            var t = this.__eventListeners[e];
            if (t) {
                for (var r = 0, n = t.length; n > r; r++) {
                    t[r] && t[r].call(this, i || {});
                }
                return this.__eventListeners[e] = t.filter(function(e) {
                    return e !== !1
                }), this
            }
        }
    }

    fabric.Observable = {
        observe: i,
        stopObserving: t,
        fire: r,
        on: i,
        off: t,
        trigger: r
    }
}();
fabric.Collection = {
    _objects: [],
    add: function() {
        if (this._objects.push.apply(this._objects, arguments), this._onObjectAdded) {
            for (var e = 0, i = arguments.length; i > e; e++) {
                this._onObjectAdded(arguments[e]);
            }
        }
        return this.renderOnAddRemove && this.requestRenderAll(), this
    },
    insertAt: function(e, i, t) {
        var r = this._objects;
        return t ? r[i] = e : r.splice(i, 0, e), this._onObjectAdded && this._onObjectAdded(e), this.renderOnAddRemove && this.requestRenderAll(), this
    },
    remove: function() {
        for (var e, i = this._objects, t = !1, r = 0, n = arguments.length; n > r; r++) {
            e = i.indexOf(arguments[r]), -1 !== e && (t = !0, i.splice(e, 1), this._onObjectRemoved && this._onObjectRemoved(arguments[r]));
        }
        return this.renderOnAddRemove && t && this.requestRenderAll(), this
    },
    forEachObject: function(e, i) {
        for (var t = this.getObjects(), r = 0, n = t.length; n > r; r++) {
            e.call(i, t[r], r, t);
        }
        return this
    },
    getObjects: function(e) {
        return "undefined" == typeof e ? this._objects.concat() : this._objects.filter(function(i) {
            return i.type === e
        })
    },
    item: function(e) {
        return this._objects[e]
    },
    isEmpty: function() {
        return 0 === this._objects.length
    },
    size: function() {
        return this._objects.length
    },
    contains: function(e) {
        return this._objects.indexOf(e) > -1
    },
    complexity: function() {
        return this._objects.reduce(function(e, i) {
            return e += i.complexity ? i.complexity() : 0
        }, 0)
    }
};
fabric.CommonMethods = {
    _setOptions: function(e) {
        for (var t in e) {
            this.set(t, e[t])
        }
    },
    _initGradient: function(e, t) {
        !e || !e.colorStops || e instanceof fabric.Gradient || this.set(t, new fabric.Gradient(e))
    },
    _initPattern: function(e, t, i) {
        !e || !e.source || e instanceof fabric.Pattern ? i && i() : this.set(t, new fabric.Pattern(e, i))
    },
    _initClipping: function(e) {
        if (e.clipTo && "string" == typeof e.clipTo) {
            var t = fabric.util.getFunctionBody(e.clipTo);
            "undefined" != typeof t && (this.clipTo = new Function("ctx", t))
        }
    },
    _setObject: function(e) {
        for (var t in e) {
            this._set(t, e[t])
        }
    },
    set: function(e, t) {
        return "object" == typeof e ? this._setObject(e) : "function" == typeof t && "clipTo" !== e ? this._set(e, t(this.get(e))) : this._set(e, t), this
    },
    _set: function(e, t) {
        this[e] = t
    },
    toggle: function(e) {
        var t = this.get(e);
        return "boolean" == typeof t && this.set(e, !t), this
    },
    get: function(e) {
        return this[e]
    }
};
!function(e) {
    var t = Math.sqrt, i = Math.atan2, n = Math.pow, r = Math.abs, a = Math.PI / 180, o = Math.PI / 2;
    fabric.util = {
        cos: function(e) {
            if (0 === e) {
                return 1;
            }
            0 > e && (e = -e);
            var t = e / o;
            switch (t) {
                case 1:
                case 3:
                    return 0;
                case 2:
                    return -1
            }
            return Math.cos(e)
        },
        sin: function(e) {
            if (0 === e) {
                return 0;
            }
            var t = e / o, i = 1;
            switch (0 > e && (i = -1), t) {
                case 1:
                    return i;
                case 2:
                    return 0;
                case 3:
                    return -i
            }
            return Math.sin(e)
        },
        removeFromArray: function(e, t) {
            var i = e.indexOf(t);
            return -1 !== i && e.splice(i, 1), e
        },
        getRandomInt: function(e, t) {
            return Math.floor(Math.random() * (t - e + 1)) + e
        },
        degreesToRadians: function(e) {
            return e * a
        },
        radiansToDegrees: function(e) {
            return e / a
        },
        rotatePoint: function(e, t, i) {
            e.subtractEquals(t);
            var n = fabric.util.rotateVector(e, i);
            return new fabric.Point(n.x, n.y).addEquals(t)
        },
        rotateVector: function(e, t) {
            var i = fabric.util.sin(t), n = fabric.util.cos(t), r = e.x * n - e.y * i, a = e.x * i + e.y * n;
            return {
                x: r,
                y: a
            }
        },
        transformPoint: function(e, t, i) {
            return i ? new fabric.Point(t[0] * e.x + t[2] * e.y, t[1] * e.x + t[3] * e.y) : new fabric.Point(t[0] * e.x + t[2] * e.y + t[4], t[1] * e.x + t[3] * e.y + t[5])
        },
        makeBoundingBoxFromPoints: function(e) {
            var t = [e[0].x, e[1].x, e[2].x, e[3].x], i = fabric.util.array.min(t), n = fabric.util.array.max(t),
                r = n - i, a = [e[0].y, e[1].y, e[2].y, e[3].y], o = fabric.util.array.min(a),
                c = fabric.util.array.max(a), s = c - o;
            return {
                left: i,
                top: o,
                width: r,
                height: s
            }
        },
        invertTransform: function(e) {
            var t = 1 / (e[0] * e[3] - e[1] * e[2]), i = [t * e[3], -t * e[1], -t * e[2], t * e[0]],
                n = fabric.util.transformPoint({
                    x: e[4],
                    y: e[5]
                }, i, !0);
            return i[4] = -n.x, i[5] = -n.y, i
        },
        toFixed: function(e, t) {
            return parseFloat(Number(e).toFixed(t))
        },
        parseUnit: function(e, t) {
            var i = /\D{0,2}$/.exec(e), n = parseFloat(e);
            switch (t || (t = fabric.Text.DEFAULT_SVG_FONT_SIZE), i[0]) {
                case"mm":
                    return n * fabric.DPI / 25.4;
                case"cm":
                    return n * fabric.DPI / 2.54;
                case"in":
                    return n * fabric.DPI;
                case"pt":
                    return n * fabric.DPI / 72;
                case"pc":
                    return n * fabric.DPI / 72 * 12;
                case"em":
                    return n * t;
                default:
                    return n
            }
        },
        falseFunction: function() {
            return !1
        },
        getKlass: function(e, t) {
            return e = fabric.util.string.camelize(e.charAt(0).toUpperCase() + e.slice(1)), fabric.util.resolveNamespace(t)[e]
        },
        getSvgAttributes: function(e) {
            var t = ["instantiated_by_use", "style", "id", "class"];
            switch (e) {
                case"linearGradient":
                    t = t.concat(["x1", "y1", "x2", "y2", "gradientUnits", "gradientTransform"]);
                    break;
                case"radialGradient":
                    t = t.concat(["gradientUnits", "gradientTransform", "cx", "cy", "r", "fx", "fy", "fr"]);
                    break;
                case"stop":
                    t = t.concat(["offset", "stop-color", "stop-opacity"])
            }
            return t
        },
        resolveNamespace: function(t) {
            if (!t) {
                return fabric;
            }
            var i, n = t.split("."), r = n.length, a = e || fabric.window;
            for (i = 0; r > i; ++i) {
                a = a[n[i]];
            }
            return a
        },
        loadImage: function(e, t, i, n) {
            if (!e) {
                return void (t && t.call(i, e));
            }
            var r = fabric.util.createImage(), a = function() {
                t && t.call(i, r), r = r.onload = r.onerror = null
            };
            r.onload = a, r.onerror = function() {
                fabric.log("Error loading " + r.src), t && t.call(i, null, !0), r = r.onload = r.onerror = null
            }, 0 !== e.indexOf("data") && n && (r.crossOrigin = n), "data:image/svg" === e.substring(0, 14) && (r.onload = null, fabric.util.loadImageInDom(r, a)), r.src = e
        },
        loadImageInDom: function(e, t) {
            var i = fabric.document.createElement("div");
            i.style.width = i.style.height = "1px", i.style.left = i.style.top = "-100%", i.style.position = "absolute", i.appendChild(e), fabric.document.querySelector("body").appendChild(i), e.onload = function() {
                t(), i.parentNode.removeChild(i), i = null
            }
        },
        enlivenObjects: function(e, t, i, n) {
            function r() {
                ++o === c && t && t(a)
            }

            e = e || [];
            var a = [], o = 0, c = e.length;
            return c ? void e.forEach(function(e, t) {
                if (!e || !e.type) {
                    return void r();
                }
                var o = fabric.util.getKlass(e.type, i);
                o.fromObject(e, function(i, o) {
                    o || (a[t] = i), n && n(e, i, o), r()
                })
            }) : void (t && t(a))
        },
        enlivenPatterns: function(e, t) {
            function i() {
                ++r === a && t && t(n)
            }

            e = e || [];
            var n = [], r = 0, a = e.length;
            return a ? void e.forEach(function(e, t) {
                e && e.source ? new fabric.Pattern(e, function(e) {
                    n[t] = e, i()
                }) : (n[t] = e, i())
            }) : void (t && t(n))
        },
        groupSVGElements: function(e, t, i) {
            var n;
            return e && 1 === e.length ? e[0] : (t && (t.width && t.height ? t.centerPoint = {
                x: t.width / 2,
                y: t.height / 2
            } : (delete t.width, delete t.height)), n = new fabric.Group(e, t), "undefined" != typeof i && (n.sourcePath = i), n)
        },
        populateWithProperties: function(e, t, i) {
            if (i && "[object Array]" === Object.prototype.toString.call(i)) {
                for (var n = 0, r = i.length; r > n; n++) {
                    i[n] in e && (t[i[n]] = e[i[n]])
                }
            }
        },
        drawDashedLine: function(e, n, r, a, o, c) {
            var s = a - n, f = o - r, u = t(s * s + f * f), l = i(f, s), d = c.length, h = 0, b = !0;
            for (e.save(), e.translate(n, r), e.moveTo(0, 0), e.rotate(l), n = 0; u > n;) {
                n += c[h++ % d], n > u && (n = u), e[b ? "lineTo" : "moveTo"](n, 0), b = !b;
            }
            e.restore()
        },
        createCanvasElement: function() {
            return fabric.document.createElement("canvas")
        },
        copyCanvasElement: function(e) {
            var t = fabric.document.createElement("canvas");
            return t.width = e.width, t.height = e.height, t.getContext("2d").drawImage(e, 0, 0), t
        },
        createImage: function() {
            return fabric.document.createElement("img")
        },
        clipContext: function(e, t) {
            t.save(), t.beginPath(), e.clipTo(t), t.clip()
        },
        multiplyTransformMatrices: function(e, t, i) {
            return [e[0] * t[0] + e[2] * t[1], e[1] * t[0] + e[3] * t[1], e[0] * t[2] + e[2] * t[3], e[1] * t[2] + e[3] * t[3], i ? 0 : e[0] * t[4] + e[2] * t[5] + e[4], i ? 0 : e[1] * t[4] + e[3] * t[5] + e[5]]
        },
        qrDecompose: function(e) {
            var r = i(e[1], e[0]), o = n(e[0], 2) + n(e[1], 2), c = t(o), s = (e[0] * e[3] - e[2] * e[1]) / c,
                f = i(e[0] * e[2] + e[1] * e[3], o);
            return {
                angle: r / a,
                scaleX: c,
                scaleY: s,
                skewX: f / a,
                skewY: 0,
                translateX: e[4],
                translateY: e[5]
            }
        },
        customTransformMatrix: function(e, t, i) {
            var n = [1, 0, r(Math.tan(i * a)), 1], o = [r(e), 0, 0, r(t)];
            return fabric.util.multiplyTransformMatrices(o, n, !0)
        },
        resetObjectTransform: function(e) {
            e.scaleX = 1, e.scaleY = 1, e.skewX = 0, e.skewY = 0, e.flipX = !1, e.flipY = !1, e.rotate(0)
        },
        saveObjectTransform: function(e) {
            return {
                scaleX: e.scaleX,
                scaleY: e.scaleY,
                skewX: e.skewX,
                skewY: e.skewY,
                angle: e.angle,
                left: e.left,
                flipX: e.flipX,
                flipY: e.flipY,
                top: e.top
            }
        },
        getFunctionBody: function(e) {
            return (String(e).match(/function[^{]*\{([\s\S]*)\}/) || {})[1]
        },
        isTransparent: function(e, t, i, n) {
            n > 0 && (t > n ? t -= n : t = 0, i > n ? i -= n : i = 0);
            var r, a, o = !0, c = e.getImageData(t, i, 2 * n || 1, 2 * n || 1), s = c.data.length;
            for (r = 3; s > r && (a = c.data[r], o = 0 >= a, o !== !1); r += 4) {
                ;
            }
            return c = null, o
        },
        parsePreserveAspectRatioAttribute: function(e) {
            var t, i = "meet", n = "Mid", r = "Mid", a = e.split(" ");
            return a && a.length && (i = a.pop(), "meet" !== i && "slice" !== i ? (t = i, i = "meet") : a.length && (t = a.pop())), n = "none" !== t ? t.slice(1, 4) : "none", r = "none" !== t ? t.slice(5, 8) : "none", {
                meetOrSlice: i,
                alignX: n,
                alignY: r
            }
        },
        clearFabricFontCache: function(e) {
            e = (e || "").toLowerCase(), e ? fabric.charWidthsCache[e] && delete fabric.charWidthsCache[e] : fabric.charWidthsCache = {}
        },
        limitDimsByArea: function(e, t) {
            var i = Math.sqrt(t * e), n = Math.floor(t / i);
            return {
                x: Math.floor(i),
                y: n
            }
        },
        capValue: function(e, t, i) {
            return Math.max(e, Math.min(t, i))
        },
        findScaleToFit: function(e, t) {
            return Math.min(t.width / e.width, t.height / e.height)
        },
        findScaleToCover: function(e, t) {
            return Math.max(t.width / e.width, t.height / e.height)
        }
    }
}("undefined" != typeof exports ? exports : this);
!function() {
    function e(e, i, a, o, c, s, f) {
        var u = n.call(arguments);
        if (fabric.arcToSegmentsCache[u]) {
            return fabric.arcToSegmentsCache[u];
        }
        var l = Math.PI, d = f * l / 180, h = fabric.util.sin(d), b = fabric.util.cos(d), p = 0, m = 0;
        a = Math.abs(a), o = Math.abs(o);
        var v = -b * e * .5 - h * i * .5, g = -b * i * .5 + h * e * .5, y = a * a, x = o * o, w = g * g, _ = v * v,
            C = y * x - y * w - x * _, M = 0;
        if (0 > C) {
            var O = Math.sqrt(1 - C / (y * x));
            a *= O, o *= O
        } else {
            M = (c === s ? -1 : 1) * Math.sqrt(C / (y * w + x * _));
        }
        var j = M * a * g / o, T = -M * o * v / a, P = b * j - h * T + .5 * e, S = h * j + b * T + .5 * i,
            F = r(1, 0, (v - j) / a, (g - T) / o), E = r((v - j) / a, (g - T) / o, (-v - j) / a, (-g - T) / o);
        0 === s && E > 0 ? E -= 2 * l : 1 === s && 0 > E && (E += 2 * l);
        for (var k = Math.ceil(Math.abs(E / l * 2)), I = [], A = E / k, L = 8 / 3 * Math.sin(A / 4) * Math.sin(A / 4) / Math.sin(A / 2), D = F + A, R = 0; k > R; R++) {
            I[R] = t(F, D, b, h, a, o, P, S, L, p, m), p = I[R][4], m = I[R][5], F = D, D += A;
        }
        return fabric.arcToSegmentsCache[u] = I, I
    }

    function t(e, t, r, i, n, a, o, c, s, f, u) {
        var l = fabric.util.cos(e), d = fabric.util.sin(e), h = fabric.util.cos(t), b = fabric.util.sin(t),
            p = r * n * h - i * a * b + o, m = i * n * h + r * a * b + c, v = f + s * (-r * n * d - i * a * l),
            g = u + s * (-i * n * d + r * a * l), y = p + s * (r * n * b + i * a * h),
            x = m + s * (i * n * b - r * a * h);
        return [v, g, y, x, p, m]
    }

    function r(e, t, r, i) {
        var n = Math.atan2(t, e), a = Math.atan2(i, r);
        return a >= n ? a - n : 2 * Math.PI - (n - a)
    }

    function i(e, t, r, i, a, o, c, s) {
        var f;
        if (fabric.cachesBoundsOfCurve && (f = n.call(arguments), fabric.boundsOfCurveCache[f])) {
            return fabric.boundsOfCurveCache[f];
        }
        var u, l, d, h, b, p, m, v, g = Math.sqrt, y = Math.min, x = Math.max, w = Math.abs, _ = [], C = [[], []];
        l = 6 * e - 12 * r + 6 * a, u = -3 * e + 9 * r - 9 * a + 3 * c, d = 3 * r - 3 * e;
        for (var M = 0; 2 > M; ++M) {
            if (M > 0 && (l = 6 * t - 12 * i + 6 * o, u = -3 * t + 9 * i - 9 * o + 3 * s, d = 3 * i - 3 * t), w(u) < 1e-12) {
                if (w(l) < 1e-12) {
                    continue;
                }
                h = -d / l, h > 0 && 1 > h && _.push(h)
            } else {
                m = l * l - 4 * d * u, 0 > m || (v = g(m), b = (-l + v) / (2 * u), b > 0 && 1 > b && _.push(b), p = (-l - v) / (2 * u), p > 0 && 1 > p && _.push(p));
            }
        }
        for (var O, j, T, P = _.length, S = P; P--;) {
            h = _[P], T = 1 - h, O = T * T * T * e + 3 * T * T * h * r + 3 * T * h * h * a + h * h * h * c, C[0][P] = O, j = T * T * T * t + 3 * T * T * h * i + 3 * T * h * h * o + h * h * h * s, C[1][P] = j;
        }
        C[0][S] = e, C[1][S] = t, C[0][S + 1] = c, C[1][S + 1] = s;
        var F = [{
            x: y.apply(null, C[0]),
            y: y.apply(null, C[1])
        }, {
            x: x.apply(null, C[0]),
            y: x.apply(null, C[1])
        }];
        return fabric.cachesBoundsOfCurve && (fabric.boundsOfCurveCache[f] = F), F
    }

    var n = Array.prototype.join;
    fabric.util.drawArc = function(t, r, i, n) {
        for (var a = n[0], o = n[1], c = n[2], s = n[3], f = n[4], u = n[5], l = n[6], d = [[], [], [], []], h = e(u - r, l - i, a, o, s, f, c), b = 0, p = h.length; p > b; b++) {
            d[b][0] = h[b][0] + r, d[b][1] = h[b][1] + i, d[b][2] = h[b][2] + r, d[b][3] = h[b][3] + i, d[b][4] = h[b][4] + r, d[b][5] = h[b][5] + i, t.bezierCurveTo.apply(t, d[b])
        }
    }, fabric.util.getBoundsOfArc = function(t, r, n, a, o, c, s, f, u) {
        for (var l, d = 0, h = 0, b = [], p = e(f - t, u - r, n, a, c, s, o), m = 0, v = p.length; v > m; m++) {
            l = i(d, h, p[m][0], p[m][1], p[m][2], p[m][3], p[m][4], p[m][5]), b.push({
                x: l[0].x + t,
                y: l[0].y + r
            }), b.push({
                x: l[1].x + t,
                y: l[1].y + r
            }), d = p[m][4], h = p[m][5];
        }
        return b
    }, fabric.util.getBoundsOfCurve = i
}();
!function() {
    function e(e, t) {
        for (var r = a.call(arguments, 2), n = [], i = 0, o = e.length; o > i; i++) {
            n[i] = r.length ? e[i][t].apply(e[i], r) : e[i][t].call(e[i]);
        }
        return n
    }

    function t(e, t) {
        return i(e, t, function(e, t) {
            return e >= t
        })
    }

    function r(e, t) {
        return i(e, t, function(e, t) {
            return t > e
        })
    }

    function n(e, t) {
        for (var r = e.length; r--;) {
            e[r] = t;
        }
        return e
    }

    function i(e, t, r) {
        if (e && 0 !== e.length) {
            var n = e.length - 1, i = t ? e[n][t] : e[n];
            if (t) {
                for (; n--;) {
                    r(e[n][t], i) && (i = e[n][t]);
                }
            } else {
                for (; n--;) {
                    r(e[n], i) && (i = e[n]);
                }
            }
            return i
        }
    }

    var a = Array.prototype.slice;
    fabric.util.array = {
        fill: n,
        invoke: e,
        min: r,
        max: t
    }
}();
!function() {
    function e(t, r, n) {
        if (n) {
            if (!fabric.isLikelyNode && r instanceof Element) {
                t = r;
            } else if (r instanceof Array) {
                t = [];
                for (var i = 0, a = r.length; a > i; i++) {
                    t[i] = e({}, r[i], n)
                }
            } else if (r && "object" == typeof r) {
                for (var o in r) {
                    r.hasOwnProperty(o) && (t[o] = e({}, r[o], n));
                }
            } else {
                t = r;
            }
        } else {
            for (var o in r) {
                t[o] = r[o];
            }
        }
        return t
    }

    function t(t, r) {
        return e({}, t, r)
    }

    fabric.util.object = {
        extend: e,
        clone: t
    }, fabric.util.object.extend(fabric.util, fabric.Observable)
}();
!function() {
    function e(e) {
        return e.replace(/-+(.)?/g, function(e, t) {
            return t ? t.toUpperCase() : ""
        })
    }

    function t(e, t) {
        return e.charAt(0).toUpperCase() + (t ? e.slice(1) : e.slice(1).toLowerCase())
    }

    function r(e) {
        return e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    }

    function n(e) {
        var t, r = 0, n = [];
        for (r = 0, t; r < e.length; r++) {
            (t = i(e, r)) !== !1 && n.push(t);
        }
        return n
    }

    function i(e, t) {
        var r = e.charCodeAt(t);
        if (isNaN(r)) {
            return "";
        }
        if (55296 > r || r > 57343) {
            return e.charAt(t);
        }
        if (r >= 55296 && 56319 >= r) {
            if (e.length <= t + 1) {
                throw"High surrogate without following low surrogate";
            }
            var n = e.charCodeAt(t + 1);
            if (56320 > n || n > 57343) {
                throw"High surrogate without following low surrogate";
            }
            return e.charAt(t) + e.charAt(t + 1)
        }
        if (0 === t) {
            throw"Low surrogate without preceding high surrogate";
        }
        var i = e.charCodeAt(t - 1);
        if (55296 > i || i > 56319) {
            throw"Low surrogate without preceding high surrogate";
        }
        return !1
    }

    fabric.util.string = {
        camelize: e,
        capitalize: t,
        escapeXml: r,
        graphemeSplit: n
    }
}();
!function() {
    function t() {
    }

    function e(t) {
        for (var e = null, r = this; r.constructor.superclass;) {
            var i = r.constructor.superclass.prototype[t];
            if (r[t] !== i) {
                e = i;
                break
            }
            r = r.constructor.superclass.prototype
        }
        return e ? arguments.length > 1 ? e.apply(this, n.call(arguments, 1)) : e.call(this) : console.log("tried to callSuper " + t + ", method not found in prototype chain", this)
    }

    function r() {
        function r() {
            this.initialize.apply(this, arguments)
        }

        var a = null, c = n.call(arguments, 0);
        "function" == typeof c[0] && (a = c.shift()), r.superclass = a, r.subclasses = [], a && (t.prototype = a.prototype, r.prototype = new t, a.subclasses.push(r));
        for (var s = 0, u = c.length; u > s; s++) {
            o(r, c[s], a);
        }
        return r.prototype.initialize || (r.prototype.initialize = i), r.prototype.constructor = r, r.prototype.callSuper = e, r
    }

    var n = Array.prototype.slice, i = function() {
    }, a = function() {
        for (var t in {toString: 1}) {
            if ("toString" === t) {
                return !1;
            }
        }
        return !0
    }(), o = function(t, e, r) {
        for (var n in e) {
            t.prototype[n] = n in t.prototype && "function" == typeof t.prototype[n] && (e[n] + "").indexOf("callSuper") > -1 ? function(t) {
                return function() {
                    var n = this.constructor.superclass;
                    this.constructor.superclass = r;
                    var i = e[t].apply(this, arguments);
                    return this.constructor.superclass = n, "initialize" !== t ? i : void 0
                }
            }(n) : e[n], a && (e.toString !== Object.prototype.toString && (t.prototype.toString = e.toString), e.valueOf !== Object.prototype.valueOf && (t.prototype.valueOf = e.valueOf))
        }
    };
    fabric.util.createClass = r
}();
!function() {
    function t(t) {
        var e, r, n = Array.prototype.slice.call(arguments, 1), i = n.length;
        for (r = 0; i > r; r++) {
            if (e = typeof t[n[r]], !/^(?:function|object|unknown)$/.test(e)) {
                return !1;
            }
        }
        return !0
    }

    function e(t, e) {
        return {
            handler: e,
            wrappedHandler: r(t, e)
        }
    }

    function r(t, e) {
        return function(r) {
            e.call(o(t), r || fabric.window.event)
        }
    }

    function n(t, e) {
        return function(r) {
            if (b[t] && b[t][e]) {
                for (var n = b[t][e], i = 0, a = n.length; a > i; i++) {
                    n[i].call(this, r || fabric.window.event)
                }
            }
        }
    }

    function i(t) {
        t || (t = fabric.window.event);
        var e = t.target || (typeof t.srcElement !== u ? t.srcElement : null), r = fabric.util.getScrollLeftTop(e);
        return {
            x: v(t) + r.left,
            y: g(t) + r.top
        }
    }

    function a(t, e, r) {
        var n, i = "touchend" === t.type ? "changedTouches" : "touches", a = t[i];
        return a && a[0] && (n = a[0][r]), "undefined" == typeof n && (n = t[r]), n
    }

    var o, c, u = "unknown", s = function() {
        var t = 0;
        return function(e) {
            return e.__uniqueID || (e.__uniqueID = "uniqueID__" + t++)
        }
    }();
    !function() {
        var t = {};
        o = function(e) {
            return t[e]
        }, c = function(e, r) {
            t[e] = r
        }
    }();
    var f, l,
        h = t(fabric.document.documentElement, "addEventListener", "removeEventListener") && t(fabric.window, "addEventListener", "removeEventListener"),
        d = t(fabric.document.documentElement, "attachEvent", "detachEvent") && t(fabric.window, "attachEvent", "detachEvent"),
        p = {}, b = {};
    h ? (f = function(t, e, r, n) {
        t && t.addEventListener(e, r, d ? !1 : n)
    }, l = function(t, e, r, n) {
        t && t.removeEventListener(e, r, d ? !1 : n)
    }) : d ? (f = function(t, r, n) {
        if (t) {
            var i = s(t);
            c(i, t), p[i] || (p[i] = {}), p[i][r] || (p[i][r] = []);
            var a = e(i, n);
            p[i][r].push(a), t.attachEvent("on" + r, a.wrappedHandler)
        }
    }, l = function(t, e, r) {
        if (t) {
            var n, i = s(t);
            if (p[i] && p[i][e]) {
                for (var a = 0, o = p[i][e].length; o > a; a++) {
                    n = p[i][e][a], n && n.handler === r && (t.detachEvent("on" + e, n.wrappedHandler), p[i][e][a] = null)
                }
            }
        }
    }) : (f = function(t, e, r) {
        if (t) {
            var i = s(t);
            if (b[i] || (b[i] = {}), !b[i][e]) {
                b[i][e] = [];
                var a = t["on" + e];
                a && b[i][e].push(a), t["on" + e] = n(i, e)
            }
            b[i][e].push(r)
        }
    }, l = function(t, e, r) {
        if (t) {
            var n = s(t);
            if (b[n] && b[n][e]) {
                for (var i = b[n][e], a = 0, o = i.length; o > a; a++) {
                    i[a] === r && i.splice(a, 1)
                }
            }
        }
    }), fabric.util.addListener = f, fabric.util.removeListener = l;
    var v = function(t) {
        return t.clientX
    }, g = function(t) {
        return t.clientY
    };
    fabric.isTouchSupported && (v = function(t) {
        return a(t, "pageX", "clientX")
    }, g = function(t) {
        return a(t, "pageY", "clientY")
    }), fabric.util.getPointer = i
}();
!function() {
    function t(t, e) {
        var r = t.style;
        if (!r) {
            return t;
        }
        if ("string" == typeof e) {
            return t.style.cssText += ";" + e, e.indexOf("opacity") > -1 ? a(t, e.match(/opacity:\s*(\d?\.?\d*)/)[1]) : t;
        }
        for (var n in e) {
            if ("opacity" === n) {
                a(t, e[n]);
            } else {
                var i = "float" === n || "cssFloat" === n ? "undefined" == typeof r.styleFloat ? "cssFloat" : "styleFloat" : n;
                r[i] = e[n]
            }
        }
        return t
    }

    var e = fabric.document.createElement("div"), r = "string" == typeof e.style.opacity,
        n = "string" == typeof e.style.filter, i = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/, a = function(t) {
            return t
        };
    r ? a = function(t, e) {
        return t.style.opacity = e, t
    } : n && (a = function(t, e) {
        var r = t.style;
        return t.currentStyle && !t.currentStyle.hasLayout && (r.zoom = 1), i.test(r.filter) ? (e = e >= .9999 ? "" : "alpha(opacity=" + 100 * e + ")", r.filter = r.filter.replace(i, e)) : r.filter += " alpha(opacity=" + 100 * e + ")", t
    }), fabric.util.setStyle = t
}();
!function() {
    function t(t) {
        return "string" == typeof t ? fabric.document.getElementById(t) : t
    }

    function e(t, e) {
        var r = fabric.document.createElement(t);
        for (var n in e) {
            "class" === n ? r.className = e[n] : "for" === n ? r.htmlFor = e[n] : r.setAttribute(n, e[n]);
        }
        return r
    }

    function r(t, e) {
        t && -1 === (" " + t.className + " ").indexOf(" " + e + " ") && (t.className += (t.className ? " " : "") + e)
    }

    function n(t, r, n) {
        return "string" == typeof r && (r = e(r, n)), t.parentNode && t.parentNode.replaceChild(r, t), r.appendChild(t), r
    }

    function i(t) {
        for (var e = 0, r = 0, n = fabric.document.documentElement, i = fabric.document.body || {
            scrollLeft: 0,
            scrollTop: 0
        }; t && (t.parentNode || t.host) && (t = t.parentNode || t.host, t === fabric.document ? (e = i.scrollLeft || n.scrollLeft || 0, r = i.scrollTop || n.scrollTop || 0) : (e += t.scrollLeft || 0, r += t.scrollTop || 0), 1 !== t.nodeType || "fixed" !== t.style.position);) {
            ;
        }
        return {
            left: e,
            top: r
        }
    }

    function a(t) {
        var e, r, n = t && t.ownerDocument, a = {
            left: 0,
            top: 0
        }, o = {
            left: 0,
            top: 0
        }, c = {
            borderLeftWidth: "left",
            borderTopWidth: "top",
            paddingLeft: "left",
            paddingTop: "top"
        };
        if (!n) {
            return o;
        }
        for (var u in c) {
            o[c[u]] += parseInt(d(t, u), 10) || 0;
        }
        return e = n.documentElement, "undefined" != typeof t.getBoundingClientRect && (a = t.getBoundingClientRect()), r = i(t), {
            left: a.left + r.left - (e.clientLeft || 0) + o.left,
            top: a.top + r.top - (e.clientTop || 0) + o.top
        }
    }

    function o(t) {
        var e = fabric.jsdomImplForWrapper(t);
        return e._canvas || e._image
    }

    function c(t) {
        if (fabric.isLikelyNode) {
            var e = fabric.jsdomImplForWrapper(t);
            e && (e._image = null, e._canvas = null, e._currentSrc = null, e._attributes = null, e._classList = null)
        }
    }

    var u, s = Array.prototype.slice, f = function(t) {
        return s.call(t, 0)
    };
    try {
        u = f(fabric.document.childNodes) instanceof Array
    } catch (l) {
    }
    u || (f = function(t) {
        for (var e = new Array(t.length), r = t.length; r--;) {
            e[r] = t[r];
        }
        return e
    });
    var d;
    d = fabric.document.defaultView && fabric.document.defaultView.getComputedStyle ? function(t, e) {
        var r = fabric.document.defaultView.getComputedStyle(t, null);
        return r ? r[e] : void 0
    } : function(t, e) {
        var r = t.style[e];
        return !r && t.currentStyle && (r = t.currentStyle[e]), r
    }, function() {
        function t(t) {
            return "undefined" != typeof t.onselectstart && (t.onselectstart = fabric.util.falseFunction), n ? t.style[n] = "none" : "string" == typeof t.unselectable && (t.unselectable = "on"), t
        }

        function e(t) {
            return "undefined" != typeof t.onselectstart && (t.onselectstart = null), n ? t.style[n] = "" : "string" == typeof t.unselectable && (t.unselectable = ""), t
        }

        var r = fabric.document.documentElement.style,
            n = "userSelect" in r ? "userSelect" : "MozUserSelect" in r ? "MozUserSelect" : "WebkitUserSelect" in r ? "WebkitUserSelect" : "KhtmlUserSelect" in r ? "KhtmlUserSelect" : "";
        fabric.util.makeElementUnselectable = t, fabric.util.makeElementSelectable = e
    }(), function() {
        function t(t, e) {
            var r = fabric.document.getElementsByTagName("head")[0], n = fabric.document.createElement("script"),
                i = !0;
            n.onload = n.onreadystatechange = function(t) {
                if (i) {
                    if ("string" == typeof this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState) {
                        return;
                    }
                    i = !1, e(t || fabric.window.event), n = n.onload = n.onreadystatechange = null
                }
            }, n.src = t, r.appendChild(n)
        }

        fabric.util.getScript = t
    }(), fabric.util.getById = t, fabric.util.toArray = f, fabric.util.makeElement = e, fabric.util.addClass = r, fabric.util.wrapElement = n, fabric.util.getScrollLeftTop = i, fabric.util.getElementOffset = a, fabric.util.getElementStyle = d, fabric.util.getNodeCanvas = o, fabric.util.cleanUpJsdomNode = c
}();
!function() {
    function t(t, e) {
        return t + (/\?/.test(t) ? "&" : "?") + e
    }

    function e() {
    }

    function r(r, n) {
        n || (n = {});
        var i = n.method ? n.method.toUpperCase() : "GET", a = n.onComplete || function() {
        }, o = new fabric.window.XMLHttpRequest, c = n.body || n.parameters;
        return o.onreadystatechange = function() {
            4 === o.readyState && (a(o), o.onreadystatechange = e)
        }, "GET" === i && (c = null, "string" == typeof n.parameters && (r = t(r, n.parameters))), o.open(i, r, !0), ("POST" === i || "PUT" === i) && o.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), o.send(c), o
    }

    fabric.util.request = r
}();
fabric.log = function() {
}, fabric.warn = function() {
}, "undefined" != typeof console && ["log", "warn"].forEach(function(t) {
    "undefined" != typeof console[t] && "function" == typeof console[t].apply && (fabric[t] = function() {
        return console[t].apply(console, arguments)
    })
});
!function() {
    function t() {
        return !1
    }

    function e(e) {
        n(function(r) {
            e || (e = {});
            var i, a = r || +new Date, o = e.duration || 500, c = a + o, u = e.onChange || t, f = e.abort || t,
                s = e.onComplete || t, l = e.easing || function(t, e, n, r) {
                    return -n * Math.cos(t / r * (Math.PI / 2)) + n + e
                }, d = "startValue" in e ? e.startValue : 0, p = "endValue" in e ? e.endValue : 100, h = e.byValue || p - d;
            e.onStart && e.onStart(), function b(t) {
                if (f()) {
                    return void s(p, 1, 1);
                }
                i = t || +new Date;
                var r = i > c ? o : i - a, m = r / o, v = l(r, d, h, o), g = Math.abs((v - d) / h);
                return u(v, g, m), i > c ? void (e.onComplete && e.onComplete()) : void n(b)
            }(a)
        })
    }

    function n() {
        return i.apply(fabric.window, arguments)
    }

    function r() {
        return a.apply(fabric.window, arguments)
    }

    var i = fabric.window.requestAnimationFrame || fabric.window.webkitRequestAnimationFrame || fabric.window.mozRequestAnimationFrame || fabric.window.oRequestAnimationFrame || fabric.window.msRequestAnimationFrame || function(t) {
        return fabric.window.setTimeout(t, 1e3 / 60)
    }, a = fabric.window.cancelAnimationFrame || fabric.window.clearTimeout;
    fabric.util.animate = e, fabric.util.requestAnimFrame = n, fabric.util.cancelAnimFrame = r
}();
!function() {
    function t(t, e, n) {
        var r = "rgba(" + parseInt(t[0] + n * (e[0] - t[0]), 10) + "," + parseInt(t[1] + n * (e[1] - t[1]), 10) + "," + parseInt(t[2] + n * (e[2] - t[2]), 10);
        return r += "," + (t && e ? parseFloat(t[3] + n * (e[3] - t[3])) : 1), r += ")"
    }

    function e(e, n, r, i) {
        var a = new fabric.Color(e).getSource(), o = new fabric.Color(n).getSource();
        i = i || {}, fabric.util.animate(fabric.util.object.extend(i, {
            duration: r || 500,
            startValue: a,
            endValue: o,
            byValue: o,
            easing: function(e, n, r, a) {
                var o = i.colorEasing ? i.colorEasing(e, a) : 1 - Math.cos(e / a * (Math.PI / 2));
                return t(n, r, o)
            }
        }))
    }

    fabric.util.animateColor = e
}();
!function() {
    function t(t, e, n, r) {
        return t < Math.abs(e) ? (t = e, r = n / 4) : r = 0 === e && 0 === t ? n / (2 * Math.PI) * Math.asin(1) : n / (2 * Math.PI) * Math.asin(e / t), {
            a: t,
            c: e,
            p: n,
            s: r
        }
    }

    function e(t, e, n) {
        return t.a * Math.pow(2, 10 * (e -= 1)) * Math.sin(2 * (e * n - t.s) * Math.PI / t.p)
    }

    function n(t, e, n, r) {
        return n * ((t = t / r - 1) * t * t + 1) + e
    }

    function r(t, e, n, r) {
        return t /= r / 2, 1 > t ? n / 2 * t * t * t + e : n / 2 * ((t -= 2) * t * t + 2) + e
    }

    function i(t, e, n, r) {
        return n * (t /= r) * t * t * t + e
    }

    function a(t, e, n, r) {
        return -n * ((t = t / r - 1) * t * t * t - 1) + e
    }

    function o(t, e, n, r) {
        return t /= r / 2, 1 > t ? n / 2 * t * t * t * t + e : -n / 2 * ((t -= 2) * t * t * t - 2) + e
    }

    function c(t, e, n, r) {
        return n * (t /= r) * t * t * t * t + e
    }

    function u(t, e, n, r) {
        return n * ((t = t / r - 1) * t * t * t * t + 1) + e
    }

    function s(t, e, n, r) {
        return t /= r / 2, 1 > t ? n / 2 * t * t * t * t * t + e : n / 2 * ((t -= 2) * t * t * t * t + 2) + e
    }

    function f(t, e, n, r) {
        return -n * Math.cos(t / r * (Math.PI / 2)) + n + e
    }

    function l(t, e, n, r) {
        return n * Math.sin(t / r * (Math.PI / 2)) + e
    }

    function d(t, e, n, r) {
        return -n / 2 * (Math.cos(Math.PI * t / r) - 1) + e
    }

    function p(t, e, n, r) {
        return 0 === t ? e : n * Math.pow(2, 10 * (t / r - 1)) + e
    }

    function h(t, e, n, r) {
        return t === r ? e + n : n * (-Math.pow(2, -10 * t / r) + 1) + e
    }

    function b(t, e, n, r) {
        return 0 === t ? e : t === r ? e + n : (t /= r / 2, 1 > t ? n / 2 * Math.pow(2, 10 * (t - 1)) + e : n / 2 * (-Math.pow(2, -10 * --t) + 2) + e)
    }

    function m(t, e, n, r) {
        return -n * (Math.sqrt(1 - (t /= r) * t) - 1) + e
    }

    function v(t, e, n, r) {
        return n * Math.sqrt(1 - (t = t / r - 1) * t) + e
    }

    function g(t, e, n, r) {
        return t /= r / 2, 1 > t ? -n / 2 * (Math.sqrt(1 - t * t) - 1) + e : n / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + e
    }

    function y(n, r, i, a) {
        var o = 1.70158, c = 0, u = i;
        if (0 === n) {
            return r;
        }
        if (n /= a, 1 === n) {
            return r + i;
        }
        c || (c = .3 * a);
        var s = t(u, i, c, o);
        return -e(s, n, a) + r
    }

    function w(e, n, r, i) {
        var a = 1.70158, o = 0, c = r;
        if (0 === e) {
            return n;
        }
        if (e /= i, 1 === e) {
            return n + r;
        }
        o || (o = .3 * i);
        var u = t(c, r, o, a);
        return u.a * Math.pow(2, -10 * e) * Math.sin(2 * (e * i - u.s) * Math.PI / u.p) + u.c + n
    }

    function C(n, r, i, a) {
        var o = 1.70158, c = 0, u = i;
        if (0 === n) {
            return r;
        }
        if (n /= a / 2, 2 === n) {
            return r + i;
        }
        c || (c = .3 * a * 1.5);
        var s = t(u, i, c, o);
        return 1 > n ? -.5 * e(s, n, a) + r : s.a * Math.pow(2, -10 * (n -= 1)) * Math.sin(2 * (n * a - s.s) * Math.PI / s.p) * .5 + s.c + r
    }

    function x(t, e, n, r, i) {
        return void 0 === i && (i = 1.70158), n * (t /= r) * t * ((i + 1) * t - i) + e
    }

    function M(t, e, n, r, i) {
        return void 0 === i && (i = 1.70158), n * ((t = t / r - 1) * t * ((i + 1) * t + i) + 1) + e
    }

    function O(t, e, n, r, i) {
        return void 0 === i && (i = 1.70158), t /= r / 2, 1 > t ? n / 2 * t * t * (((i *= 1.525) + 1) * t - i) + e : n / 2 * ((t -= 2) * t * (((i *= 1.525) + 1) * t + i) + 2) + e
    }

    function S(t, e, n, r) {
        return n - _(r - t, 0, n, r) + e
    }

    function _(t, e, n, r) {
        return (t /= r) < 1 / 2.75 ? 7.5625 * n * t * t + e : 2 / 2.75 > t ? n * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + e : 2.5 / 2.75 > t ? n * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + e : n * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + e
    }

    function E(t, e, n, r) {
        return r / 2 > t ? .5 * S(2 * t, 0, n, r) + e : .5 * _(2 * t - r, 0, n, r) + .5 * n + e
    }

    fabric.util.ease = {
        easeInQuad: function(t, e, n, r) {
            return n * (t /= r) * t + e
        },
        easeOutQuad: function(t, e, n, r) {
            return -n * (t /= r) * (t - 2) + e
        },
        easeInOutQuad: function(t, e, n, r) {
            return t /= r / 2, 1 > t ? n / 2 * t * t + e : -n / 2 * (--t * (t - 2) - 1) + e
        },
        easeInCubic: function(t, e, n, r) {
            return n * (t /= r) * t * t + e
        },
        easeOutCubic: n,
        easeInOutCubic: r,
        easeInQuart: i,
        easeOutQuart: a,
        easeInOutQuart: o,
        easeInQuint: c,
        easeOutQuint: u,
        easeInOutQuint: s,
        easeInSine: f,
        easeOutSine: l,
        easeInOutSine: d,
        easeInExpo: p,
        easeOutExpo: h,
        easeInOutExpo: b,
        easeInCirc: m,
        easeOutCirc: v,
        easeInOutCirc: g,
        easeInElastic: y,
        easeOutElastic: w,
        easeInOutElastic: C,
        easeInBack: x,
        easeOutBack: M,
        easeInOutBack: O,
        easeInBounce: S,
        easeOutBounce: _,
        easeInOutBounce: E
    }
}();
!function(e) {
    "use strict";

    function t(e) {
        return e in M ? M[e] : e
    }

    function n(e, t, n, r) {
        var i, a = "[object Array]" === Object.prototype.toString.call(t);
        if ("fill" !== e && "stroke" !== e || "none" !== t) {
            if ("strokeDashArray" === e) {
                t = "none" === t ? null : t.replace(/,/g, " ").split(/\s+/).map(function(e) {
                    return parseFloat(e)
                });
            } else if ("transformMatrix" === e) {
                t = n && n.transformMatrix ? x(n.transformMatrix, g.parseTransformAttribute(t)) : g.parseTransformAttribute(t);
            } else if ("visible" === e) {
                t = "none" !== t && "hidden" !== t, n && n.visible === !1 && (t = !1);
            } else if ("opacity" === e) {
                t = parseFloat(t), n && "undefined" != typeof n.opacity && (t *= n.opacity);
            } else if ("textAnchor" === e) {
                t = "start" === t ? "left" : "end" === t ? "right" : "center";
            } else if ("charSpacing" === e) {
                i = w(t, r) / r * 1e3;
            } else if ("paintFirst" === e) {
                var o = t.indexOf("fill"), c = t.indexOf("stroke"), t = "fill";
                o > -1 && c > -1 && o > c ? t = "stroke" : -1 === o && c > -1 && (t = "stroke")
            } else {
                i = a ? t.map(w) : w(t, r);
            }
        } else {
            t = "";
        }
        return !a && isNaN(i) ? t : i
    }

    function r(e) {
        return new RegExp("^(" + e.join("|") + ")\\b", "i")
    }

    function i(e) {
        for (var t in O) {
            if ("undefined" != typeof e[O[t]] && "" !== e[t]) {
                if ("undefined" == typeof e[t]) {
                    if (!g.Object.prototype[t]) {
                        continue;
                    }
                    e[t] = g.Object.prototype[t]
                }
                if (0 !== e[t].indexOf("url(")) {
                    var n = new g.Color(e[t]);
                    e[t] = n.setAlpha(y(n.getAlpha() * e[O[t]], 2)).toRgba()
                }
            }
        }
        return e
    }

    function a(e, t) {
        var n, r, i, a, o = [];
        for (i = 0, a = t.length; a > i; i++) {
            n = t[i], r = e.getElementsByTagName(n), o = o.concat(Array.prototype.slice.call(r));
        }
        return o
    }

    function o(e, t) {
        var n, r;
        e.replace(/;\s*$/, "").split(";").forEach(function(e) {
            var i = e.split(":");
            n = i[0].trim().toLowerCase(), r = i[1].trim(), t[n] = r
        })
    }

    function c(e, t) {
        var n, r;
        for (var i in e) {
            "undefined" != typeof e[i] && (n = i.toLowerCase(), r = e[i], t[n] = r)
        }
    }

    function s(e, t) {
        var n = {};
        for (var r in g.cssRules[t]) {
            if (u(e, r.split(" "))) {
                for (var i in g.cssRules[t][r]) {
                    n[i] = g.cssRules[t][r][i];
                }
            }
        }
        return n
    }

    function u(e, t) {
        var n, r = !0;
        return n = f(e, t.pop()), n && t.length && (r = l(e, t)), n && r && 0 === t.length
    }

    function l(e, t) {
        for (var n, r = !0; e.parentNode && 1 === e.parentNode.nodeType && t.length;) {
            r && (n = t.pop()), e = e.parentNode, r = f(e, n);
        }
        return 0 === t.length
    }

    function f(e, t) {
        var n, r, i = e.nodeName, a = e.getAttribute("class"), o = e.getAttribute("id");
        if (n = new RegExp("^" + i, "i"), t = t.replace(n, ""), o && t.length && (n = new RegExp("#" + o + "(?![a-zA-Z\\-]+)", "i"), t = t.replace(n, "")), a && t.length) {
            for (a = a.split(" "), r = a.length; r--;) {
                n = new RegExp("\\." + a[r] + "(?![a-zA-Z\\-]+)", "i"), t = t.replace(n, "");
            }
        }
        return 0 === t.length
    }

    function d(e, t) {
        var n;
        if (e.getElementById && (n = e.getElementById(t)), n) {
            return n;
        }
        var r, i, a, o = e.getElementsByTagName("*");
        for (i = 0, a = o.length; a > i; i++) {
            if (r = o[i], t === r.getAttribute("id")) {
                return r
            }
        }
    }

    function p(e) {
        for (var t = a(e, ["use", "svg:use"]), n = 0; t.length && n < t.length;) {
            var r, i, o, c, s, u = t[n], l = (u.getAttribute("xlink:href") || u.getAttribute("href")).substr(1),
                f = u.getAttribute("x") || 0, p = u.getAttribute("y") || 0, m = d(e, l).cloneNode(!0),
                g = (m.getAttribute("transform") || "") + " translate(" + f + ", " + p + ")", b = t.length;
            if (h(m), /^svg$/i.test(m.nodeName)) {
                var v = m.ownerDocument.createElement("g");
                for (o = 0, c = m.attributes, s = c.length; s > o; o++) {
                    i = c.item(o), v.setAttribute(i.nodeName, i.nodeValue);
                }
                for (; m.firstChild;) {
                    v.appendChild(m.firstChild);
                }
                m = v
            }
            for (o = 0, c = u.attributes, s = c.length; s > o; o++) {
                i = c.item(o), "x" !== i.nodeName && "y" !== i.nodeName && "xlink:href" !== i.nodeName && "href" !== i.nodeName && ("transform" === i.nodeName ? g = i.nodeValue + " " + g : m.setAttribute(i.nodeName, i.nodeValue));
            }
            m.setAttribute("transform", g), m.setAttribute("instantiated_by_use", "1"), m.removeAttribute("id"), r = u.parentNode, r.replaceChild(m, u), t.length === b && n++
        }
    }

    function h(e) {
        var t, n, r, i, a = e.getAttribute("viewBox"), o = 1, c = 1, s = 0, u = 0, l = e.getAttribute("width"),
            f = e.getAttribute("height"), d = e.getAttribute("x") || 0, p = e.getAttribute("y") || 0,
            h = e.getAttribute("preserveAspectRatio") || "",
            m = !a || !g.svgViewBoxElementsRegEx.test(e.nodeName) || !(a = a.match(T)),
            b = !l || !f || "100%" === l || "100%" === f, v = m && b, y = {}, x = "", E = 0, S = 0;
        if (y.width = 0, y.height = 0, y.toBeParsed = v, v) {
            return y;
        }
        if (m) {
            return y.width = w(l), y.height = w(f), y;
        }
        if (s = -parseFloat(a[1]), u = -parseFloat(a[2]), t = parseFloat(a[3]), n = parseFloat(a[4]), b ? (y.width = t, y.height = n) : (y.width = w(l), y.height = w(f), o = y.width / t, c = y.height / n), h = g.util.parsePreserveAspectRatioAttribute(h), "none" !== h.alignX && ("meet" === h.meetOrSlice && (c = o = o > c ? c : o), "slice" === h.meetOrSlice && (c = o = o > c ? o : c), E = y.width - t * o, S = y.height - n * o, "Mid" === h.alignX && (E /= 2), "Mid" === h.alignY && (S /= 2), "Min" === h.alignX && (E = 0), "Min" === h.alignY && (S = 0)), 1 === o && 1 === c && 0 === s && 0 === u && 0 === d && 0 === p) {
            return y;
        }
        if ((d || p) && (x = " translate(" + w(d) + " " + w(p) + ") "), r = x + " matrix(" + o + " 0 0 " + c + " " + (s * o + E) + " " + (u * c + S) + ") ", y.viewboxTransform = g.parseTransformAttribute(r), "svg" === e.nodeName) {
            for (i = e.ownerDocument.createElement("g"); e.firstChild;) {
                i.appendChild(e.firstChild);
            }
            e.appendChild(i)
        } else {
            i = e, r = i.getAttribute("transform") + r;
        }
        return i.setAttribute("transform", r), y
    }

    function m(e, t) {
        for (; e && (e = e.parentNode);) {
            if (e.nodeName && t.test(e.nodeName.replace("svg:", "")) && !e.getAttribute("instantiated_by_use")) {
                return !0;
            }
        }
        return !1
    }

    var g = e.fabric || (e.fabric = {}), b = g.util.object.extend, v = g.util.object.clone, y = g.util.toFixed,
        w = g.util.parseUnit, x = g.util.multiplyTransformMatrices,
        E = ["path", "circle", "polygon", "polyline", "ellipse", "rect", "line", "image", "text"],
        S = ["symbol", "image", "marker", "pattern", "view", "svg"],
        A = ["pattern", "defs", "symbol", "metadata", "clipPath", "mask", "desc"],
        C = ["symbol", "g", "a", "svg", "clipPath", "defs"], M = {
            cx: "left",
            x: "left",
            r: "radius",
            cy: "top",
            y: "top",
            display: "visible",
            visibility: "visible",
            transform: "transformMatrix",
            "fill-opacity": "fillOpacity",
            "fill-rule": "fillRule",
            "font-family": "fontFamily",
            "font-size": "fontSize",
            "font-style": "fontStyle",
            "font-weight": "fontWeight",
            "letter-spacing": "charSpacing",
            "paint-order": "paintFirst",
            "stroke-dasharray": "strokeDashArray",
            "stroke-linecap": "strokeLineCap",
            "stroke-linejoin": "strokeLineJoin",
            "stroke-miterlimit": "strokeMiterLimit",
            "stroke-opacity": "strokeOpacity",
            "stroke-width": "strokeWidth",
            "text-decoration": "textDecoration",
            "text-anchor": "textAnchor",
            opacity: "opacity",
            "clip-path": "clipPath",
            "clip-rule": "clipRule"
        }, O = {
            stroke: "strokeOpacity",
            fill: "fillOpacity"
        };
    g.svgValidTagNamesRegEx = r(E), g.svgViewBoxElementsRegEx = r(S), g.svgInvalidAncestorsRegEx = r(A), g.svgValidParentsRegEx = r(C), g.cssRules = {}, g.gradientDefs = {}, g.clipPaths = {}, g.parseTransformAttribute = function() {
        function e(e, t) {
            var n = g.util.cos(t[0]), r = g.util.sin(t[0]), i = 0, a = 0;
            3 === t.length && (i = t[1], a = t[2]), e[0] = n, e[1] = r, e[2] = -r, e[3] = n, e[4] = i - (n * i - r * a), e[5] = a - (r * i + n * a)
        }

        function t(e, t) {
            var n = t[0], r = 2 === t.length ? t[1] : t[0];
            e[0] = n, e[3] = r
        }

        function n(e, t, n) {
            e[n] = Math.tan(g.util.degreesToRadians(t[0]))
        }

        function r(e, t) {
            e[4] = t[0], 2 === t.length && (e[5] = t[1])
        }

        var i = [1, 0, 0, 1, 0, 0], a = g.reNum, o = "(?:\\s+,?\\s*|,\\s*)",
            c = "(?:(skewX)\\s*\\(\\s*(" + a + ")\\s*\\))", s = "(?:(skewY)\\s*\\(\\s*(" + a + ")\\s*\\))",
            u = "(?:(rotate)\\s*\\(\\s*(" + a + ")(?:" + o + "(" + a + ")" + o + "(" + a + "))?\\s*\\))",
            l = "(?:(scale)\\s*\\(\\s*(" + a + ")(?:" + o + "(" + a + "))?\\s*\\))",
            f = "(?:(translate)\\s*\\(\\s*(" + a + ")(?:" + o + "(" + a + "))?\\s*\\))",
            d = "(?:(matrix)\\s*\\(\\s*(" + a + ")" + o + "(" + a + ")" + o + "(" + a + ")" + o + "(" + a + ")" + o + "(" + a + ")" + o + "(" + a + ")\\s*\\))",
            p = "(?:" + d + "|" + f + "|" + l + "|" + u + "|" + c + "|" + s + ")",
            h = "(?:" + p + "(?:" + o + "*" + p + ")*)", m = "^\\s*(?:" + h + "?)\\s*$", b = new RegExp(m),
            v = new RegExp(p, "g");
        return function(a) {
            var o = i.concat(), c = [];
            if (!a || a && !b.test(a)) {
                return o;
            }
            a.replace(v, function(a) {
                var s = new RegExp(p).exec(a).filter(function(e) {
                    return !!e
                }), u = s[1], l = s.slice(2).map(parseFloat);
                switch (u) {
                    case"translate":
                        r(o, l);
                        break;
                    case"rotate":
                        l[0] = g.util.degreesToRadians(l[0]), e(o, l);
                        break;
                    case"scale":
                        t(o, l);
                        break;
                    case"skewX":
                        n(o, l, 2);
                        break;
                    case"skewY":
                        n(o, l, 1);
                        break;
                    case"matrix":
                        o = l
                }
                c.push(o.concat()), o = i.concat()
            });
            for (var s = c[0]; c.length > 1;) {
                c.shift(), s = g.util.multiplyTransformMatrices(s, c[0]);
            }
            return s
        }
    }();
    var T = new RegExp("^\\s*(" + g.reNum + "+)\\s*,?\\s*(" + g.reNum + "+)\\s*,?\\s*(" + g.reNum + "+)\\s*,?\\s*(" + g.reNum + "+)\\s*$");
    g.parseSVGDocument = function(e, t, n, r) {
        if (e) {
            p(e);
            var i, a, o = g.Object.__uid++, c = h(e), s = g.util.toArray(e.getElementsByTagName("*"));
            if (c.crossOrigin = r && r.crossOrigin, c.svgUid = o, 0 === s.length && g.isLikelyNode) {
                s = e.selectNodes('//*[name(.)!="svg"]');
                var u = [];
                for (i = 0, a = s.length; a > i; i++) {
                    u[i] = s[i];
                }
                s = u
            }
            var l = s.filter(function(e) {
                return h(e), g.svgValidTagNamesRegEx.test(e.nodeName.replace("svg:", "")) && !m(e, g.svgInvalidAncestorsRegEx)
            });
            if (!l || l && !l.length) {
                return void (t && t([], {}));
            }
            var f = {};
            s.filter(function(e) {
                return "clipPath" === e.nodeName.replace("svg:", "")
            }).forEach(function(e) {
                var t = e.getAttribute("id");
                f[t] = g.util.toArray(e.getElementsByTagName("*")).filter(function(e) {
                    return g.svgValidTagNamesRegEx.test(e.nodeName.replace("svg:", ""))
                })
            }), g.gradientDefs[o] = g.getGradientDefs(e), g.cssRules[o] = g.getCSSRules(e), g.clipPaths[o] = f, g.parseElements(l, function(e, n) {
                t && (t(e, c, n, s), delete g.gradientDefs[o], delete g.cssRules[o], delete g.clipPaths[o])
            }, v(c), n, r)
        }
    };
    var _ = new RegExp("(normal|italic)?\\s*(normal|small-caps)?\\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(" + g.reNum + "(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|" + g.reNum + "))?\\s+(.*)");
    b(g, {
        parseFontDeclaration: function(e, t) {
            var n = e.match(_);
            if (n) {
                var r = n[1], i = n[3], a = n[4], o = n[5], c = n[6];
                r && (t.fontStyle = r), i && (t.fontWeight = isNaN(parseFloat(i)) ? i : parseFloat(i)), a && (t.fontSize = w(a)), c && (t.fontFamily = c), o && (t.lineHeight = "normal" === o ? 1 : o)
            }
        },
        getGradientDefs: function(e) {
            var t, n, r, i = ["linearGradient", "radialGradient", "svg:linearGradient", "svg:radialGradient"],
                o = a(e, i), c = 0, s = {}, u = {};
            for (c = o.length; c--;) {
                t = o[c], r = t.getAttribute("xlink:href"), n = t.getAttribute("id"), r && (u[n] = r.substr(1)), s[n] = t;
            }
            for (n in u) {
                var l = s[u[n]].cloneNode(!0);
                for (t = s[n]; l.firstChild;) {
                    t.appendChild(l.firstChild)
                }
            }
            return s
        },
        parseAttributes: function(e, r, a) {
            if (e) {
                var o, c, u = {};
                "undefined" == typeof a && (a = e.getAttribute("svgUid")), e.parentNode && g.svgValidParentsRegEx.test(e.parentNode.nodeName) && (u = g.parseAttributes(e.parentNode, r, a));
                var l = r.reduce(function(t, n) {
                    return o = e.getAttribute(n), o && (t[n] = o), t
                }, {});
                l = b(l, b(s(e, a), g.parseStyleAttribute(e))), c = u && u.fontSize || l["font-size"] || g.Text.DEFAULT_SVG_FONT_SIZE;
                var f, d, p = {};
                for (var h in l) {
                    f = t(h), d = n(f, l[h], u, c), p[f] = d;
                }
                p && p.font && g.parseFontDeclaration(p.font, p);
                var m = b(u, p);
                return g.svgValidParentsRegEx.test(e.nodeName) ? m : i(m)
            }
        },
        parseElements: function(e, t, n, r, i) {
            new g.ElementsParser(e, t, n, r, i).parse()
        },
        parseStyleAttribute: function(e) {
            var t = {}, n = e.getAttribute("style");
            return n ? ("string" == typeof n ? o(n, t) : c(n, t), t) : t
        },
        parsePointsAttribute: function(e) {
            if (!e) {
                return null;
            }
            e = e.replace(/,/g, " ").trim(), e = e.split(/\s+/);
            var t, n, r = [];
            for (t = 0, n = e.length; n > t; t += 2) {
                r.push({
                    x: parseFloat(e[t]),
                    y: parseFloat(e[t + 1])
                });
            }
            return r
        },
        getCSSRules: function(e) {
            var t, n, r, i = e.getElementsByTagName("style"), a = {};
            for (t = 0, n = i.length; n > t; t++) {
                var o = i[t].textContent || i[t].text;
                o = o.replace(/\/\*[\s\S]*?\*\//g, ""), "" !== o.trim() && (r = o.match(/[^{]*\{[\s\S]*?\}/g), r = r.map(function(e) {
                    return e.trim()
                }), r.forEach(function(e) {
                    var r = e.match(/([\s\S]*?)\s*\{([^}]*)\}/), i = {}, o = r[2].trim(),
                        c = o.replace(/;$/, "").split(/\s*;\s*/);
                    for (t = 0, n = c.length; n > t; t++) {
                        var s = c[t].split(/\s*:\s*/), u = s[0], l = s[1];
                        i[u] = l
                    }
                    e = r[1], e.split(",").forEach(function(e) {
                        e = e.replace(/^svg/i, "").trim(), "" !== e && (a[e] ? g.util.object.extend(a[e], i) : a[e] = g.util.object.clone(i))
                    })
                }))
            }
            return a
        },
        loadSVGFromURL: function(e, t, n, r) {
            function i(e) {
                var i = e.responseXML;
                return i && !i.documentElement && g.window.ActiveXObject && e.responseText && (i = new ActiveXObject("Microsoft.XMLDOM"), i.async = "false", i.loadXML(e.responseText.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, ""))), i && i.documentElement ? void g.parseSVGDocument(i.documentElement, function(e, n, r, i) {
                    t && t(e, n, r, i)
                }, n, r) : (t && t(null), !1)
            }

            e = e.replace(/^\n\s*/, "").trim(), new g.util.request(e, {
                method: "get",
                onComplete: i
            })
        },
        loadSVGFromString: function(e, t, n, r) {
            e = e.trim();
            var i;
            if ("undefined" != typeof DOMParser) {
                var a = new DOMParser;
                a && a.parseFromString && (i = a.parseFromString(e, "text/xml"))
            } else {
                g.window.ActiveXObject && (i = new ActiveXObject("Microsoft.XMLDOM"), i.async = "false", i.loadXML(e.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, "")));
            }
            g.parseSVGDocument(i.documentElement, function(e, n, r, i) {
                t(e, n, r, i)
            }, n, r)
        }
    })
}("undefined" != typeof exports ? exports : this);
fabric.ElementsParser = function(e, t, r, n, i) {
    this.elements = e, this.callback = t, this.options = r, this.reviver = n, this.svgUid = r && r.svgUid || 0, this.parsingOptions = i, this.regexUrl = /^url\(['"]?#([^'"]+)['"]?\)/g
}, function(e) {
    e.parse = function() {
        this.instances = new Array(this.elements.length), this.numElements = this.elements.length, this.createObjects()
    }, e.createObjects = function() {
        var e = this;
        this.elements.forEach(function(t, r) {
            t.setAttribute("svgUid", e.svgUid), e.createObject(t, r)
        })
    }, e.findTag = function(e) {
        return fabric[fabric.util.string.capitalize(e.tagName.replace("svg:", ""))]
    }, e.createObject = function(e, t) {
        var r = this.findTag(e);
        if (r && r.fromElement) {
            try {
                r.fromElement(e, this.createCallback(t, e), this.options)
            } catch (n) {
                fabric.log(n)
            }
        } else {
            this.checkIfDone()
        }
    }, e.createCallback = function(e, t) {
        var r = this;
        return function(n) {
            var i;
            r.resolveGradient(n, "fill"), r.resolveGradient(n, "stroke"), n instanceof fabric.Image && (i = n.parsePreserveAspectRatioAttribute(t)), n._removeTransformMatrix(i), r.resolveClipPath(n), r.reviver && r.reviver(t, n), r.instances[e] = n, r.checkIfDone()
        }
    }, e.extractPropertyDefinition = function(e, t, r) {
        var n = e[t];
        if (/^url\(/.test(n)) {
            var i = this.regexUrl.exec(n)[1];
            return this.regexUrl.lastIndex = 0, fabric[r][this.svgUid][i]
        }
    }, e.resolveGradient = function(e, t) {
        var r = this.extractPropertyDefinition(e, t, "gradientDefs");
        r && e.set(t, fabric.Gradient.fromElement(r, e))
    }, e.createClipPathCallback = function(e, t) {
        return function(e) {
            e._removeTransformMatrix(), e.fillRule = e.clipRule, t.push(e)
        }
    }, e.resolveClipPath = function(e) {
        var t, r, n, i, a, o, c = this.extractPropertyDefinition(e, "clipPath", "clipPaths");
        if (c) {
            i = [], n = fabric.util.invertTransform(e.calcTransformMatrix());
            for (var s = 0; s < c.length; s++) {
                t = c[s], r = this.findTag(t), r.fromElement(t, this.createClipPathCallback(e, i), this.options);
            }
            c = 1 === i.length ? i[0] : new fabric.Group(i), a = fabric.util.multiplyTransformMatrices(n, c.calcTransformMatrix());
            var o = fabric.util.qrDecompose(a);
            c.flipX = !1, c.flipY = !1, c.set("scaleX", o.scaleX), c.set("scaleY", o.scaleY), c.angle = o.angle, c.skewX = o.skewX, c.skewY = 0, c.setPositionByOrigin({
                x: o.translateX,
                y: o.translateY
            }, "center", "center"), e.clipPath = c
        }
    }, e.checkIfDone = function() {
        0 === --this.numElements && (this.instances = this.instances.filter(function(e) {
            return null != e
        }), this.callback(this.instances, this.elements))
    }
}(fabric.ElementsParser.prototype);
!function(t) {
    "use strict";

    function e(t, e) {
        this.x = t, this.y = e
    }

    var n = t.fabric || (t.fabric = {});
    return n.Point ? void n.warn("fabric.Point is already defined") : (n.Point = e, void (e.prototype = {
        type: "point",
        constructor: e,
        add: function(t) {
            return new e(this.x + t.x, this.y + t.y)
        },
        addEquals: function(t) {
            return this.x += t.x, this.y += t.y, this
        },
        scalarAdd: function(t) {
            return new e(this.x + t, this.y + t)
        },
        scalarAddEquals: function(t) {
            return this.x += t, this.y += t, this
        },
        subtract: function(t) {
            return new e(this.x - t.x, this.y - t.y)
        },
        subtractEquals: function(t) {
            return this.x -= t.x, this.y -= t.y, this
        },
        scalarSubtract: function(t) {
            return new e(this.x - t, this.y - t)
        },
        scalarSubtractEquals: function(t) {
            return this.x -= t, this.y -= t, this
        },
        multiply: function(t) {
            return new e(this.x * t, this.y * t)
        },
        multiplyEquals: function(t) {
            return this.x *= t, this.y *= t, this
        },
        divide: function(t) {
            return new e(this.x / t, this.y / t)
        },
        divideEquals: function(t) {
            return this.x /= t, this.y /= t, this
        },
        eq: function(t) {
            return this.x === t.x && this.y === t.y
        },
        lt: function(t) {
            return this.x < t.x && this.y < t.y
        },
        lte: function(t) {
            return this.x <= t.x && this.y <= t.y
        },
        gt: function(t) {
            return this.x > t.x && this.y > t.y
        },
        gte: function(t) {
            return this.x >= t.x && this.y >= t.y
        },
        lerp: function(t, n) {
            return "undefined" == typeof n && (n = .5), n = Math.max(Math.min(1, n), 0), new e(this.x + (t.x - this.x) * n, this.y + (t.y - this.y) * n)
        },
        distanceFrom: function(t) {
            var e = this.x - t.x, n = this.y - t.y;
            return Math.sqrt(e * e + n * n)
        },
        midPointFrom: function(t) {
            return this.lerp(t)
        },
        min: function(t) {
            return new e(Math.min(this.x, t.x), Math.min(this.y, t.y))
        },
        max: function(t) {
            return new e(Math.max(this.x, t.x), Math.max(this.y, t.y))
        },
        toString: function() {
            return this.x + "," + this.y
        },
        setXY: function(t, e) {
            return this.x = t, this.y = e, this
        },
        setX: function(t) {
            return this.x = t, this
        },
        setY: function(t) {
            return this.y = t, this
        },
        setFromPoint: function(t) {
            return this.x = t.x, this.y = t.y, this
        },
        swap: function(t) {
            var e = this.x, n = this.y;
            this.x = t.x, this.y = t.y, t.x = e, t.y = n
        },
        clone: function() {
            return new e(this.x, this.y)
        }
    }))
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";

    function e(t) {
        this.status = t, this.points = []
    }

    var n = t.fabric || (t.fabric = {});
    return n.Intersection ? void n.warn("fabric.Intersection is already defined") : (n.Intersection = e, n.Intersection.prototype = {
        constructor: e,
        appendPoint: function(t) {
            return this.points.push(t), this
        },
        appendPoints: function(t) {
            return this.points = this.points.concat(t), this
        }
    }, n.Intersection.intersectLineLine = function(t, r, i, a) {
        var o, s = (a.x - i.x) * (t.y - i.y) - (a.y - i.y) * (t.x - i.x),
            c = (r.x - t.x) * (t.y - i.y) - (r.y - t.y) * (t.x - i.x),
            u = (a.y - i.y) * (r.x - t.x) - (a.x - i.x) * (r.y - t.y);
        if (0 !== u) {
            var l = s / u, f = c / u;
            l >= 0 && 1 >= l && f >= 0 && 1 >= f ? (o = new e("Intersection"), o.appendPoint(new n.Point(t.x + l * (r.x - t.x), t.y + l * (r.y - t.y)))) : o = new e
        } else {
            o = new e(0 === s || 0 === c ? "Coincident" : "Parallel");
        }
        return o
    }, n.Intersection.intersectLinePolygon = function(t, n, r) {
        var i, a, o, s, c = new e, u = r.length;
        for (s = 0; u > s; s++) {
            i = r[s], a = r[(s + 1) % u], o = e.intersectLineLine(t, n, i, a), c.appendPoints(o.points);
        }
        return c.points.length > 0 && (c.status = "Intersection"), c
    }, n.Intersection.intersectPolygonPolygon = function(t, n) {
        var r, i = new e, a = t.length;
        for (r = 0; a > r; r++) {
            var o = t[r], s = t[(r + 1) % a], c = e.intersectLinePolygon(o, s, n);
            i.appendPoints(c.points)
        }
        return i.points.length > 0 && (i.status = "Intersection"), i
    }, void (n.Intersection.intersectPolygonRectangle = function(t, r, i) {
        var a = r.min(i), o = r.max(i), s = new n.Point(o.x, a.y), c = new n.Point(a.x, o.y),
            u = e.intersectLinePolygon(a, s, t), l = e.intersectLinePolygon(s, o, t),
            f = e.intersectLinePolygon(o, c, t), p = e.intersectLinePolygon(c, a, t), h = new e;
        return h.appendPoints(u.points), h.appendPoints(l.points), h.appendPoints(f.points), h.appendPoints(p.points), h.points.length > 0 && (h.status = "Intersection"), h
    }))
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";

    function e(t) {
        t ? this._tryParsingColor(t) : this.setSource([0, 0, 0, 1])
    }

    function r(t, e, r) {
        return 0 > r && (r += 1), r > 1 && (r -= 1), 1 / 6 > r ? t + 6 * (e - t) * r : .5 > r ? e : 2 / 3 > r ? t + (e - t) * (2 / 3 - r) * 6 : t
    }

    var n = t.fabric || (t.fabric = {});
    return n.Color ? void n.warn("fabric.Color is already defined.") : (n.Color = e, n.Color.prototype = {
        _tryParsingColor: function(t) {
            var r;
            t in e.colorNameMap && (t = e.colorNameMap[t]), "transparent" === t && (r = [255, 255, 255, 0]), r || (r = e.sourceFromHex(t)), r || (r = e.sourceFromRgb(t)), r || (r = e.sourceFromHsl(t)), r || (r = [0, 0, 0, 1]), r && this.setSource(r)
        },
        _rgbToHsl: function(t, e, r) {
            t /= 255, e /= 255, r /= 255;
            var i, a, o, s = n.util.array.max([t, e, r]), c = n.util.array.min([t, e, r]);
            if (o = (s + c) / 2, s === c) {
                i = a = 0;
            } else {
                var u = s - c;
                switch (a = o > .5 ? u / (2 - s - c) : u / (s + c), s) {
                    case t:
                        i = (e - r) / u + (r > e ? 6 : 0);
                        break;
                    case e:
                        i = (r - t) / u + 2;
                        break;
                    case r:
                        i = (t - e) / u + 4
                }
                i /= 6
            }
            return [Math.round(360 * i), Math.round(100 * a), Math.round(100 * o)]
        },
        getSource: function() {
            return this._source
        },
        setSource: function(t) {
            this._source = t
        },
        toRgb: function() {
            var t = this.getSource();
            return "rgb(" + t[0] + "," + t[1] + "," + t[2] + ")"
        },
        toRgba: function() {
            var t = this.getSource();
            return "rgba(" + t[0] + "," + t[1] + "," + t[2] + "," + t[3] + ")"
        },
        toHsl: function() {
            var t = this.getSource(), e = this._rgbToHsl(t[0], t[1], t[2]);
            return "hsl(" + e[0] + "," + e[1] + "%," + e[2] + "%)"
        },
        toHsla: function() {
            var t = this.getSource(), e = this._rgbToHsl(t[0], t[1], t[2]);
            return "hsla(" + e[0] + "," + e[1] + "%," + e[2] + "%," + t[3] + ")"
        },
        toHex: function() {
            var t, e, r, n = this.getSource();
            return t = n[0].toString(16), t = 1 === t.length ? "0" + t : t, e = n[1].toString(16), e = 1 === e.length ? "0" + e : e, r = n[2].toString(16), r = 1 === r.length ? "0" + r : r, t.toUpperCase() + e.toUpperCase() + r.toUpperCase()
        },
        toHexa: function() {
            var t, e = this.getSource();
            return t = Math.round(255 * e[3]), t = t.toString(16), t = 1 === t.length ? "0" + t : t, this.toHex() + t.toUpperCase()
        },
        getAlpha: function() {
            return this.getSource()[3]
        },
        setAlpha: function(t) {
            var e = this.getSource();
            return e[3] = t, this.setSource(e), this
        },
        toGrayscale: function() {
            var t = this.getSource(), e = parseInt((.3 * t[0] + .59 * t[1] + .11 * t[2]).toFixed(0), 10), r = t[3];
            return this.setSource([e, e, e, r]), this
        },
        toBlackWhite: function(t) {
            var e = this.getSource(), r = (.3 * e[0] + .59 * e[1] + .11 * e[2]).toFixed(0), n = e[3];
            return t = t || 127, r = Number(r) < Number(t) ? 0 : 255, this.setSource([r, r, r, n]), this
        },
        overlayWith: function(t) {
            t instanceof e || (t = new e(t));
            var r, n = [], i = this.getAlpha(), a = .5, o = this.getSource(), s = t.getSource();
            for (r = 0; 3 > r; r++) {
                n.push(Math.round(o[r] * (1 - a) + s[r] * a));
            }
            return n[3] = i, this.setSource(n), this
        }
    }, n.Color.reRGBa = /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*((?:\d*\.?\d+)?)\s*)?\)$/i, n.Color.reHSLa = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/i, n.Color.reHex = /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i, n.Color.colorNameMap = {
        aliceblue: "#F0F8FF",
        antiquewhite: "#FAEBD7",
        aqua: "#00FFFF",
        aquamarine: "#7FFFD4",
        azure: "#F0FFFF",
        beige: "#F5F5DC",
        bisque: "#FFE4C4",
        black: "#000000",
        blanchedalmond: "#FFEBCD",
        blue: "#0000FF",
        blueviolet: "#8A2BE2",
        brown: "#A52A2A",
        burlywood: "#DEB887",
        cadetblue: "#5F9EA0",
        chartreuse: "#7FFF00",
        chocolate: "#D2691E",
        coral: "#FF7F50",
        cornflowerblue: "#6495ED",
        cornsilk: "#FFF8DC",
        crimson: "#DC143C",
        cyan: "#00FFFF",
        darkblue: "#00008B",
        darkcyan: "#008B8B",
        darkgoldenrod: "#B8860B",
        darkgray: "#A9A9A9",
        darkgrey: "#A9A9A9",
        darkgreen: "#006400",
        darkkhaki: "#BDB76B",
        darkmagenta: "#8B008B",
        darkolivegreen: "#556B2F",
        darkorange: "#FF8C00",
        darkorchid: "#9932CC",
        darkred: "#8B0000",
        darksalmon: "#E9967A",
        darkseagreen: "#8FBC8F",
        darkslateblue: "#483D8B",
        darkslategray: "#2F4F4F",
        darkslategrey: "#2F4F4F",
        darkturquoise: "#00CED1",
        darkviolet: "#9400D3",
        deeppink: "#FF1493",
        deepskyblue: "#00BFFF",
        dimgray: "#696969",
        dimgrey: "#696969",
        dodgerblue: "#1E90FF",
        firebrick: "#B22222",
        floralwhite: "#FFFAF0",
        forestgreen: "#228B22",
        fuchsia: "#FF00FF",
        gainsboro: "#DCDCDC",
        ghostwhite: "#F8F8FF",
        gold: "#FFD700",
        goldenrod: "#DAA520",
        gray: "#808080",
        grey: "#808080",
        green: "#008000",
        greenyellow: "#ADFF2F",
        honeydew: "#F0FFF0",
        hotpink: "#FF69B4",
        indianred: "#CD5C5C",
        indigo: "#4B0082",
        ivory: "#FFFFF0",
        khaki: "#F0E68C",
        lavender: "#E6E6FA",
        lavenderblush: "#FFF0F5",
        lawngreen: "#7CFC00",
        lemonchiffon: "#FFFACD",
        lightblue: "#ADD8E6",
        lightcoral: "#F08080",
        lightcyan: "#E0FFFF",
        lightgoldenrodyellow: "#FAFAD2",
        lightgray: "#D3D3D3",
        lightgrey: "#D3D3D3",
        lightgreen: "#90EE90",
        lightpink: "#FFB6C1",
        lightsalmon: "#FFA07A",
        lightseagreen: "#20B2AA",
        lightskyblue: "#87CEFA",
        lightslategray: "#778899",
        lightslategrey: "#778899",
        lightsteelblue: "#B0C4DE",
        lightyellow: "#FFFFE0",
        lime: "#00FF00",
        limegreen: "#32CD32",
        linen: "#FAF0E6",
        magenta: "#FF00FF",
        maroon: "#800000",
        mediumaquamarine: "#66CDAA",
        mediumblue: "#0000CD",
        mediumorchid: "#BA55D3",
        mediumpurple: "#9370DB",
        mediumseagreen: "#3CB371",
        mediumslateblue: "#7B68EE",
        mediumspringgreen: "#00FA9A",
        mediumturquoise: "#48D1CC",
        mediumvioletred: "#C71585",
        midnightblue: "#191970",
        mintcream: "#F5FFFA",
        mistyrose: "#FFE4E1",
        moccasin: "#FFE4B5",
        navajowhite: "#FFDEAD",
        navy: "#000080",
        oldlace: "#FDF5E6",
        olive: "#808000",
        olivedrab: "#6B8E23",
        orange: "#FFA500",
        orangered: "#FF4500",
        orchid: "#DA70D6",
        palegoldenrod: "#EEE8AA",
        palegreen: "#98FB98",
        paleturquoise: "#AFEEEE",
        palevioletred: "#DB7093",
        papayawhip: "#FFEFD5",
        peachpuff: "#FFDAB9",
        peru: "#CD853F",
        pink: "#FFC0CB",
        plum: "#DDA0DD",
        powderblue: "#B0E0E6",
        purple: "#800080",
        rebeccapurple: "#663399",
        red: "#FF0000",
        rosybrown: "#BC8F8F",
        royalblue: "#4169E1",
        saddlebrown: "#8B4513",
        salmon: "#FA8072",
        sandybrown: "#F4A460",
        seagreen: "#2E8B57",
        seashell: "#FFF5EE",
        sienna: "#A0522D",
        silver: "#C0C0C0",
        skyblue: "#87CEEB",
        slateblue: "#6A5ACD",
        slategray: "#708090",
        slategrey: "#708090",
        snow: "#FFFAFA",
        springgreen: "#00FF7F",
        steelblue: "#4682B4",
        tan: "#D2B48C",
        teal: "#008080",
        thistle: "#D8BFD8",
        tomato: "#FF6347",
        turquoise: "#40E0D0",
        violet: "#EE82EE",
        wheat: "#F5DEB3",
        white: "#FFFFFF",
        whitesmoke: "#F5F5F5",
        yellow: "#FFFF00",
        yellowgreen: "#9ACD32"
    }, n.Color.fromRgb = function(t) {
        return e.fromSource(e.sourceFromRgb(t))
    }, n.Color.sourceFromRgb = function(t) {
        var r = t.match(e.reRGBa);
        if (r) {
            var n = parseInt(r[1], 10) / (/%$/.test(r[1]) ? 100 : 1) * (/%$/.test(r[1]) ? 255 : 1),
                i = parseInt(r[2], 10) / (/%$/.test(r[2]) ? 100 : 1) * (/%$/.test(r[2]) ? 255 : 1),
                a = parseInt(r[3], 10) / (/%$/.test(r[3]) ? 100 : 1) * (/%$/.test(r[3]) ? 255 : 1);
            return [parseInt(n, 10), parseInt(i, 10), parseInt(a, 10), r[4] ? parseFloat(r[4]) : 1]
        }
    }, n.Color.fromRgba = e.fromRgb, n.Color.fromHsl = function(t) {
        return e.fromSource(e.sourceFromHsl(t))
    }, n.Color.sourceFromHsl = function(t) {
        var n = t.match(e.reHSLa);
        if (n) {
            var i, a, o, s = (parseFloat(n[1]) % 360 + 360) % 360 / 360,
                c = parseFloat(n[2]) / (/%$/.test(n[2]) ? 100 : 1), u = parseFloat(n[3]) / (/%$/.test(n[3]) ? 100 : 1);
            if (0 === c) {
                i = a = o = u;
            } else {
                var l = .5 >= u ? u * (c + 1) : u + c - u * c, f = 2 * u - l;
                i = r(f, l, s + 1 / 3), a = r(f, l, s), o = r(f, l, s - 1 / 3)
            }
            return [Math.round(255 * i), Math.round(255 * a), Math.round(255 * o), n[4] ? parseFloat(n[4]) : 1]
        }
    }, n.Color.fromHsla = e.fromHsl, n.Color.fromHex = function(t) {
        return e.fromSource(e.sourceFromHex(t))
    }, n.Color.sourceFromHex = function(t) {
        if (t.match(e.reHex)) {
            var r = t.slice(t.indexOf("#") + 1), n = 3 === r.length || 4 === r.length,
                i = 8 === r.length || 4 === r.length, a = n ? r.charAt(0) + r.charAt(0) : r.substring(0, 2),
                o = n ? r.charAt(1) + r.charAt(1) : r.substring(2, 4),
                s = n ? r.charAt(2) + r.charAt(2) : r.substring(4, 6),
                c = i ? n ? r.charAt(3) + r.charAt(3) : r.substring(6, 8) : "FF";
            return [parseInt(a, 16), parseInt(o, 16), parseInt(s, 16), parseFloat((parseInt(c, 16) / 255).toFixed(2))]
        }
    }, void (n.Color.fromSource = function(t) {
        var r = new e;
        return r.setSource(t), r
    }))
}("undefined" != typeof exports ? exports : this);
!function() {
    function t(t) {
        var e, r, n, i, a = t.getAttribute("style"), o = t.getAttribute("offset") || 0;
        if (o = parseFloat(o) / (/%$/.test(o) ? 100 : 1), o = 0 > o ? 0 : o > 1 ? 1 : o, a) {
            var s = a.split(/\s*;\s*/);
            for ("" === s[s.length - 1] && s.pop(), i = s.length; i--;) {
                var c = s[i].split(/\s*:\s*/), u = c[0].trim(), l = c[1].trim();
                "stop-color" === u ? e = l : "stop-opacity" === u && (n = l)
            }
        }
        return e || (e = t.getAttribute("stop-color") || "rgb(0,0,0)"), n || (n = t.getAttribute("stop-opacity")), e = new fabric.Color(e), r = e.getAlpha(), n = isNaN(parseFloat(n)) ? 1 : parseFloat(n), n *= r, {
            offset: o,
            color: e.toRgb(),
            opacity: n
        }
    }

    function e(t) {
        return {
            x1: t.getAttribute("x1") || 0,
            y1: t.getAttribute("y1") || 0,
            x2: t.getAttribute("x2") || "100%",
            y2: t.getAttribute("y2") || 0
        }
    }

    function r(t) {
        return {
            x1: t.getAttribute("fx") || t.getAttribute("cx") || "50%",
            y1: t.getAttribute("fy") || t.getAttribute("cy") || "50%",
            r1: 0,
            x2: t.getAttribute("cx") || "50%",
            y2: t.getAttribute("cy") || "50%",
            r2: t.getAttribute("r") || "50%"
        }
    }

    function n(t, e, r) {
        var n, i = 0, a = 1, o = "";
        for (var s in e) {
            "Infinity" === e[s] ? e[s] = 1 : "-Infinity" === e[s] && (e[s] = 0), n = parseFloat(e[s], 10), a = "string" == typeof e[s] && /^(\d+\.\d+)%|(\d+)%$/.test(e[s]) ? .01 : 1, "x1" === s || "x2" === s || "r2" === s ? (a *= "objectBoundingBox" === r ? t.width : 1, i = "objectBoundingBox" === r ? t.left || 0 : 0) : ("y1" === s || "y2" === s) && (a *= "objectBoundingBox" === r ? t.height : 1, i = "objectBoundingBox" === r ? t.top || 0 : 0), e[s] = n * a + i;
        }
        if ("ellipse" === t.type && null !== e.r2 && "objectBoundingBox" === r && t.rx !== t.ry) {
            var c = t.ry / t.rx;
            o = " scale(1, " + c + ")", e.y1 && (e.y1 /= c), e.y2 && (e.y2 /= c)
        }
        return o
    }

    var i = fabric.util.object.clone;
    fabric.Gradient = fabric.util.createClass({
        offsetX: 0,
        offsetY: 0,
        initialize: function(t) {
            t || (t = {});
            var e = {};
            this.id = fabric.Object.__uid++, this.type = t.type || "linear", e = {
                x1: t.coords.x1 || 0,
                y1: t.coords.y1 || 0,
                x2: t.coords.x2 || 0,
                y2: t.coords.y2 || 0
            }, "radial" === this.type && (e.r1 = t.coords.r1 || 0, e.r2 = t.coords.r2 || 0), this.coords = e, this.colorStops = t.colorStops.slice(), t.gradientTransform && (this.gradientTransform = t.gradientTransform), this.offsetX = t.offsetX || this.offsetX, this.offsetY = t.offsetY || this.offsetY
        },
        addColorStop: function(t) {
            for (var e in t) {
                var r = new fabric.Color(t[e]);
                this.colorStops.push({
                    offset: parseFloat(e),
                    color: r.toRgb(),
                    opacity: r.getAlpha()
                })
            }
            return this
        },
        toObject: function(t) {
            var e = {
                type: this.type,
                coords: this.coords,
                colorStops: this.colorStops,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                gradientTransform: this.gradientTransform ? this.gradientTransform.concat() : this.gradientTransform
            };
            return fabric.util.populateWithProperties(this, e, t), e
        },
        toSVG: function(t) {
            var e, r, n, a, o = i(this.coords, !0), s = i(this.colorStops, !0), c = o.r1 > o.r2, u = t.width / 2,
                l = t.height / 2;
            s.sort(function(t, e) {
                return t.offset - e.offset
            }), "path" === t.type && (u -= t.pathOffset.x, l -= t.pathOffset.y);
            for (var f in o) {
                "x1" === f || "x2" === f ? o[f] += this.offsetX - u : ("y1" === f || "y2" === f) && (o[f] += this.offsetY - l);
            }
            if (a = 'id="SVGID_' + this.id + '" gradientUnits="userSpaceOnUse"', this.gradientTransform && (a += ' gradientTransform="matrix(' + this.gradientTransform.join(" ") + ')" '), "linear" === this.type ? n = ["<linearGradient ", a, ' x1="', o.x1, '" y1="', o.y1, '" x2="', o.x2, '" y2="', o.y2, '">\n'] : "radial" === this.type && (n = ["<radialGradient ", a, ' cx="', c ? o.x1 : o.x2, '" cy="', c ? o.y1 : o.y2, '" r="', c ? o.r1 : o.r2, '" fx="', c ? o.x2 : o.x1, '" fy="', c ? o.y2 : o.y1, '">\n']), "radial" === this.type) {
                if (c) {
                    for (s = s.concat(), s.reverse(), e = 0, r = s.length; r > e; e++) {
                        s[e].offset = 1 - s[e].offset;
                    }
                }
                var h = Math.min(o.r1, o.r2);
                if (h > 0) {
                    var d = Math.max(o.r1, o.r2), p = h / d;
                    for (e = 0, r = s.length; r > e; e++) {
                        s[e].offset += p * (1 - s[e].offset)
                    }
                }
            }
            for (e = 0, r = s.length; r > e; e++) {
                var g = s[e];
                n.push("<stop ", 'offset="', 100 * g.offset + "%", '" style="stop-color:', g.color, "undefined" != typeof g.opacity ? ";stop-opacity: " + g.opacity : ";", '"/>\n')
            }
            return n.push("linear" === this.type ? "</linearGradient>\n" : "</radialGradient>\n"), n.join("")
        },
        toLive: function(t) {
            var e, r, n, i = fabric.util.object.clone(this.coords);
            if (this.type) {
                for ("linear" === this.type ? e = t.createLinearGradient(i.x1, i.y1, i.x2, i.y2) : "radial" === this.type && (e = t.createRadialGradient(i.x1, i.y1, i.r1, i.x2, i.y2, i.r2)), r = 0, n = this.colorStops.length; n > r; r++) {
                    var a = this.colorStops[r].color, o = this.colorStops[r].opacity, s = this.colorStops[r].offset;
                    "undefined" != typeof o && (a = new fabric.Color(a).setAlpha(o).toRgba()), e.addColorStop(s, a)
                }
                return e
            }
        }
    }), fabric.util.object.extend(fabric.Gradient, {
        fromElement: function(i, a) {
            var o, s, c, u, l = i.getElementsByTagName("stop"),
                f = i.getAttribute("gradientUnits") || "objectBoundingBox", h = i.getAttribute("gradientTransform"),
                d = [];
            for (o = "linearGradient" === i.nodeName || "LINEARGRADIENT" === i.nodeName ? "linear" : "radial", "linear" === o ? s = e(i) : "radial" === o && (s = r(i)), u = l.length; u--;) {
                d.push(t(l[u]));
            }
            c = n(a, s, f);
            var p = new fabric.Gradient({
                type: o,
                coords: s,
                colorStops: d,
                offsetX: -a.left,
                offsetY: -a.top
            });
            return (h || "" !== c) && (p.gradientTransform = fabric.parseTransformAttribute((h || "") + c)), p
        },
        forObject: function(t, e) {
            return e || (e = {}), n(t, e.coords, "userSpaceOnUse"), new fabric.Gradient(e)
        }
    })
}();
!function() {
    "use strict";
    var t = fabric.util.toFixed;
    fabric.Pattern = fabric.util.createClass({
        repeat: "repeat",
        offsetX: 0,
        offsetY: 0,
        crossOrigin: "",
        patternTransform: null,
        initialize: function(t, e) {
            if (t || (t = {}), this.id = fabric.Object.__uid++, this.setOptions(t), !t.source || t.source && "string" != typeof t.source) {
                return void (e && e(this));
            }
            if ("undefined" != typeof fabric.util.getFunctionBody(t.source)) {
                this.source = new Function(fabric.util.getFunctionBody(t.source)), e && e(this);
            } else {
                var r = this;
                this.source = fabric.util.createImage(), fabric.util.loadImage(t.source, function(t) {
                    r.source = t, e && e(r)
                }, null, this.crossOrigin)
            }
        },
        toObject: function(e) {
            var r, n, i = fabric.Object.NUM_FRACTION_DIGITS;
            return "function" == typeof this.source ? r = String(this.source) : "string" == typeof this.source.src ? r = this.source.src : "object" == typeof this.source && this.source.toDataURL && (r = this.source.toDataURL()), n = {
                type: "pattern",
                source: r,
                repeat: this.repeat,
                crossOrigin: this.crossOrigin,
                offsetX: t(this.offsetX, i),
                offsetY: t(this.offsetY, i),
                patternTransform: this.patternTransform ? this.patternTransform.concat() : null
            }, fabric.util.populateWithProperties(this, n, e), n
        },
        toSVG: function(t) {
            var e = "function" == typeof this.source ? this.source() : this.source, r = e.width / t.width,
                n = e.height / t.height, i = this.offsetX / t.width, a = this.offsetY / t.height, o = "";
            return ("repeat-x" === this.repeat || "no-repeat" === this.repeat) && (n = 1, a && (n += Math.abs(a))), ("repeat-y" === this.repeat || "no-repeat" === this.repeat) && (r = 1, i && (r += Math.abs(i))), e.src ? o = e.src : e.toDataURL && (o = e.toDataURL()), '<pattern id="SVGID_' + this.id + '" x="' + i + '" y="' + a + '" width="' + r + '" height="' + n + '">\n<image x="0" y="0" width="' + e.width + '" height="' + e.height + '" xlink:href="' + o + '"></image>\n</pattern>\n'
        },
        setOptions: function(t) {
            for (var e in t) {
                this[e] = t[e]
            }
        },
        toLive: function(t) {
            var e = "function" == typeof this.source ? this.source() : this.source;
            if (!e) {
                return "";
            }
            if ("undefined" != typeof e.src) {
                if (!e.complete) {
                    return "";
                }
                if (0 === e.naturalWidth || 0 === e.naturalHeight) {
                    return ""
                }
            }
            return t.createPattern(e, this.repeat)
        }
    })
}();
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), r = e.util.toFixed;
    return e.Shadow ? void e.warn("fabric.Shadow is already defined.") : (e.Shadow = e.util.createClass({
        color: "rgb(0,0,0)",
        blur: 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: !1,
        includeDefaultValues: !0,
        initialize: function(t) {
            "string" == typeof t && (t = this._parseShadow(t));
            for (var r in t) {
                this[r] = t[r];
            }
            this.id = e.Object.__uid++
        },
        _parseShadow: function(t) {
            var r = t.trim(), n = e.Shadow.reOffsetsAndBlur.exec(r) || [],
                i = r.replace(e.Shadow.reOffsetsAndBlur, "") || "rgb(0,0,0)";
            return {
                color: i.trim(),
                offsetX: parseInt(n[1], 10) || 0,
                offsetY: parseInt(n[2], 10) || 0,
                blur: parseInt(n[3], 10) || 0
            }
        },
        toString: function() {
            return [this.offsetX, this.offsetY, this.blur, this.color].join("px ")
        },
        toSVG: function(t) {
            var n = 40, i = 40, a = e.Object.NUM_FRACTION_DIGITS, o = e.util.rotateVector({
                x: this.offsetX,
                y: this.offsetY
            }, e.util.degreesToRadians(-t.angle)), s = 20, c = new e.Color(this.color);
            return t.width && t.height && (n = 100 * r((Math.abs(o.x) + this.blur) / t.width, a) + s, i = 100 * r((Math.abs(o.y) + this.blur) / t.height, a) + s), t.flipX && (o.x *= -1), t.flipY && (o.y *= -1), '<filter id="SVGID_' + this.id + '" y="-' + i + '%" height="' + (100 + 2 * i) + '%" x="-' + n + '%" width="' + (100 + 2 * n) + '%" >\n	<feGaussianBlur in="SourceAlpha" stdDeviation="' + r(this.blur ? this.blur / 2 : 0, a) + '"></feGaussianBlur>\n	<feOffset dx="' + r(o.x, a) + '" dy="' + r(o.y, a) + '" result="oBlur" ></feOffset>\n	<feFlood flood-color="' + c.toRgb() + '" flood-opacity="' + c.getAlpha() + '"/>\n	<feComposite in2="oBlur" operator="in" />\n	<feMerge>\n		<feMergeNode></feMergeNode>\n		<feMergeNode in="SourceGraphic"></feMergeNode>\n	</feMerge>\n</filter>\n'
        },
        toObject: function() {
            if (this.includeDefaultValues) {
                return {
                    color: this.color,
                    blur: this.blur,
                    offsetX: this.offsetX,
                    offsetY: this.offsetY,
                    affectStroke: this.affectStroke
                };
            }
            var t = {}, r = e.Shadow.prototype;
            return ["color", "blur", "offsetX", "offsetY", "affectStroke"].forEach(function(e) {
                this[e] !== r[e] && (t[e] = this[e])
            }, this), t
        }
    }), void (e.Shadow.reOffsetsAndBlur = /(?:\s|^)(-?\d+(?:px)?(?:\s?|$))?(-?\d+(?:px)?(?:\s?|$))?(\d+(?:px)?)?(?:\s?|$)(?:$|\s)/))
}("undefined" != typeof exports ? exports : this);
!function() {
    "use strict";
    if (fabric.StaticCanvas) {
        return void fabric.warn("fabric.StaticCanvas is already defined.");
    }
    var t = fabric.util.object.extend, e = fabric.util.getElementOffset, r = fabric.util.removeFromArray,
        i = fabric.util.toFixed, n = fabric.util.transformPoint, o = fabric.util.invertTransform,
        a = fabric.util.getNodeCanvas, s = fabric.util.createCanvasElement,
        c = new Error("Could not initialize `canvas` element");
    fabric.StaticCanvas = fabric.util.createClass(fabric.CommonMethods, {
        initialize: function(t, e) {
            e || (e = {}), this.renderAndResetBound = this.renderAndReset.bind(this), this.requestRenderAllBound = this.requestRenderAll.bind(this), this._initStatic(t, e)
        },
        backgroundColor: "",
        backgroundImage: null,
        overlayColor: "",
        overlayImage: null,
        includeDefaultValues: !0,
        stateful: !1,
        renderOnAddRemove: !0,
        clipTo: null,
        controlsAboveOverlay: !1,
        allowTouchScrolling: !1,
        imageSmoothingEnabled: !0,
        viewportTransform: fabric.iMatrix.concat(),
        backgroundVpt: !0,
        overlayVpt: !0,
        onBeforeScaleRotate: function() {
        },
        enableRetinaScaling: !0,
        vptCoords: {},
        skipOffscreen: !0,
        clipPath: void 0,
        _initStatic: function(t, e) {
            var r = this.requestRenderAllBound;
            this._objects = [], this._createLowerCanvas(t), this._initOptions(e), this._setImageSmoothing(), this.interactive || this._initRetinaScaling(), e.overlayImage && this.setOverlayImage(e.overlayImage, r), e.backgroundImage && this.setBackgroundImage(e.backgroundImage, r), e.backgroundColor && this.setBackgroundColor(e.backgroundColor, r), e.overlayColor && this.setOverlayColor(e.overlayColor, r), this.calcOffset()
        },
        _isRetinaScaling: function() {
            return 1 !== fabric.devicePixelRatio && this.enableRetinaScaling
        },
        getRetinaScaling: function() {
            return this._isRetinaScaling() ? fabric.devicePixelRatio : 1
        },
        _initRetinaScaling: function() {
            this._isRetinaScaling() && (this.lowerCanvasEl.setAttribute("width", this.width * fabric.devicePixelRatio), this.lowerCanvasEl.setAttribute("height", this.height * fabric.devicePixelRatio), this.contextContainer.scale(fabric.devicePixelRatio, fabric.devicePixelRatio))
        },
        calcOffset: function() {
            return this._offset = e(this.lowerCanvasEl), this
        },
        setOverlayImage: function(t, e, r) {
            return this.__setBgOverlayImage("overlayImage", t, e, r)
        },
        setBackgroundImage: function(t, e, r) {
            return this.__setBgOverlayImage("backgroundImage", t, e, r)
        },
        setOverlayColor: function(t, e) {
            return this.__setBgOverlayColor("overlayColor", t, e)
        },
        setBackgroundColor: function(t, e) {
            return this.__setBgOverlayColor("backgroundColor", t, e)
        },
        _setImageSmoothing: function() {
            var t = this.getContext();
            t.imageSmoothingEnabled = t.imageSmoothingEnabled || t.webkitImageSmoothingEnabled || t.mozImageSmoothingEnabled || t.msImageSmoothingEnabled || t.oImageSmoothingEnabled, t.imageSmoothingEnabled = this.imageSmoothingEnabled
        },
        __setBgOverlayImage: function(t, e, r, i) {
            return "string" == typeof e ? fabric.util.loadImage(e, function(e) {
                if (e) {
                    var n = new fabric.Image(e, i);
                    this[t] = n, n.canvas = this
                }
                r && r(e)
            }, this, i && i.crossOrigin) : (i && e.setOptions(i), this[t] = e, e && (e.canvas = this), r && r(e)), this
        },
        __setBgOverlayColor: function(t, e, r) {
            return this[t] = e, this._initGradient(e, t), this._initPattern(e, t, r), this
        },
        _createCanvasElement: function() {
            var t = s();
            if (!t) {
                throw c;
            }
            if (t.style || (t.style = {}), "undefined" == typeof t.getContext) {
                throw c;
            }
            return t
        },
        _initOptions: function(t) {
            var e = this.lowerCanvasEl;
            this._setOptions(t), this.width = this.width || parseInt(e.width, 10) || 0, this.height = this.height || parseInt(e.height, 10) || 0, this.lowerCanvasEl.style && (e.width = this.width, e.height = this.height, e.style.width = this.width + "px", e.style.height = this.height + "px", this.viewportTransform = this.viewportTransform.slice())
        },
        _createLowerCanvas: function(t) {
            this.lowerCanvasEl = t && t.getContext ? t : fabric.util.getById(t) || this._createCanvasElement(), fabric.util.addClass(this.lowerCanvasEl, "lower-canvas"), this.interactive && this._applyCanvasStyle(this.lowerCanvasEl), this.contextContainer = this.lowerCanvasEl.getContext("2d")
        },
        getWidth: function() {
            return this.width
        },
        getHeight: function() {
            return this.height
        },
        setWidth: function(t, e) {
            return this.setDimensions({width: t}, e)
        },
        setHeight: function(t, e) {
            return this.setDimensions({height: t}, e)
        },
        setDimensions: function(t, e) {
            var r;
            e = e || {};
            for (var i in t) {
                r = t[i], e.cssOnly || (this._setBackstoreDimension(i, t[i]), r += "px", this.hasLostContext = !0), e.backstoreOnly || this._setCssDimension(i, r);
            }
            return this._isCurrentlyDrawing && this.freeDrawingBrush && this.freeDrawingBrush._setBrushStyles(), this._initRetinaScaling(), this._setImageSmoothing(), this.calcOffset(), e.cssOnly || this.requestRenderAll(), this
        },
        _setBackstoreDimension: function(t, e) {
            return this.lowerCanvasEl[t] = e, this.upperCanvasEl && (this.upperCanvasEl[t] = e), this.cacheCanvasEl && (this.cacheCanvasEl[t] = e), this[t] = e, this
        },
        _setCssDimension: function(t, e) {
            return this.lowerCanvasEl.style[t] = e, this.upperCanvasEl && (this.upperCanvasEl.style[t] = e), this.wrapperEl && (this.wrapperEl.style[t] = e), this
        },
        getZoom: function() {
            return this.viewportTransform[0]
        },
        setViewportTransform: function(t) {
            var e, r, i, n = this._activeObject, o = !1, a = !0;
            for (this.viewportTransform = t, r = 0, i = this._objects.length; i > r; r++) {
                e = this._objects[r], e.group || e.setCoords(o, a);
            }
            return n && "activeSelection" === n.type && n.setCoords(o, a), this.calcViewportBoundaries(), this.renderOnAddRemove && this.requestRenderAll(), this
        },
        zoomToPoint: function(t, e) {
            var r = t, i = this.viewportTransform.slice(0);
            t = n(t, o(this.viewportTransform)), i[0] = e, i[3] = e;
            var a = n(t, i);
            return i[4] += r.x - a.x, i[5] += r.y - a.y, this.setViewportTransform(i)
        },
        setZoom: function(t) {
            return this.zoomToPoint(new fabric.Point(0, 0), t), this
        },
        absolutePan: function(t) {
            var e = this.viewportTransform.slice(0);
            return e[4] = -t.x, e[5] = -t.y, this.setViewportTransform(e)
        },
        relativePan: function(t) {
            return this.absolutePan(new fabric.Point(-t.x - this.viewportTransform[4], -t.y - this.viewportTransform[5]))
        },
        getElement: function() {
            return this.lowerCanvasEl
        },
        _onObjectAdded: function(t) {
            this.stateful && t.setupState(), t._set("canvas", this), t.setCoords(), this.fire("object:added", {target: t}), t.fire("added")
        },
        _onObjectRemoved: function(t) {
            this.fire("object:removed", {target: t}), t.fire("removed"), delete t.canvas
        },
        clearContext: function(t) {
            return t.clearRect(0, 0, this.width, this.height), this
        },
        getContext: function() {
            return this.contextContainer
        },
        clear: function() {
            return this._objects.length = 0, this.backgroundImage = null, this.overlayImage = null, this.backgroundColor = "", this.overlayColor = "", this._hasITextHandlers && (this.off("mouse:up", this._mouseUpITextHandler), this._iTextInstances = null, this._hasITextHandlers = !1), this.clearContext(this.contextContainer), this.fire("canvas:cleared"), this.renderOnAddRemove && this.requestRenderAll(), this
        },
        renderAll: function() {
            var t = this.contextContainer;
            return this.renderCanvas(t, this._objects), this
        },
        renderAndReset: function() {
            this.isRendering = 0, this.renderAll()
        },
        requestRenderAll: function() {
            return this.isRendering || (this.isRendering = fabric.util.requestAnimFrame(this.renderAndResetBound)), this
        },
        calcViewportBoundaries: function() {
            var t = {}, e = this.width, r = this.height, i = o(this.viewportTransform);
            return t.tl = n({
                x: 0,
                y: 0
            }, i), t.br = n({
                x: e,
                y: r
            }, i), t.tr = new fabric.Point(t.br.x, t.tl.y), t.bl = new fabric.Point(t.tl.x, t.br.y), this.vptCoords = t, t
        },
        cancelRequestedRender: function() {
            this.isRendering && (fabric.util.cancelAnimFrame(this.isRendering), this.isRendering = 0)
        },
        renderCanvas: function(t, e) {
            var r = this.viewportTransform, i = this.clipPath;
            this.cancelRequestedRender(), this.calcViewportBoundaries(), this.clearContext(t), this.fire("before:render", {ctx: t}), this.clipTo && fabric.util.clipContext(this, t), this._renderBackground(t), t.save(), t.transform(r[0], r[1], r[2], r[3], r[4], r[5]), this._renderObjects(t, e), t.restore(), !this.controlsAboveOverlay && this.interactive && this.drawControls(t), this.clipTo && t.restore(), i && (i.canvas = this, i.shouldCache(), i._transformDone = !0, i.renderCache({forClipping: !0}), this.drawClipPathOnCanvas(t)), this._renderOverlay(t), this.controlsAboveOverlay && this.interactive && this.drawControls(t), this.fire("after:render", {ctx: t})
        },
        drawClipPathOnCanvas: function(t) {
            var e = this.viewportTransform, r = this.clipPath;
            t.save(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5]), t.globalCompositeOperation = "destination-in", r.transform(t), t.scale(1 / r.zoomX, 1 / r.zoomY), t.drawImage(r._cacheCanvas, -r.cacheTranslationX, -r.cacheTranslationY), t.restore()
        },
        _renderObjects: function(t, e) {
            var r, i;
            for (r = 0, i = e.length; i > r; ++r) {
                e[r] && e[r].render(t)
            }
        },
        _renderBackgroundOrOverlay: function(t, e) {
            var r, i = this[e + "Color"];
            i && (t.fillStyle = i.toLive ? i.toLive(t, this) : i, t.fillRect(i.offsetX || 0, i.offsetY || 0, this.width, this.height)), i = this[e + "Image"], i && (this[e + "Vpt"] && (r = this.viewportTransform, t.save(), t.transform(r[0], r[1], r[2], r[3], r[4], r[5])), i.render(t), this[e + "Vpt"] && t.restore())
        },
        _renderBackground: function(t) {
            this._renderBackgroundOrOverlay(t, "background")
        },
        _renderOverlay: function(t) {
            this._renderBackgroundOrOverlay(t, "overlay")
        },
        getCenter: function() {
            return {
                top: this.height / 2,
                left: this.width / 2
            }
        },
        centerObjectH: function(t) {
            return this._centerObject(t, new fabric.Point(this.getCenter().left, t.getCenterPoint().y))
        },
        centerObjectV: function(t) {
            return this._centerObject(t, new fabric.Point(t.getCenterPoint().x, this.getCenter().top))
        },
        centerObject: function(t) {
            var e = this.getCenter();
            return this._centerObject(t, new fabric.Point(e.left, e.top))
        },
        viewportCenterObject: function(t) {
            var e = this.getVpCenter();
            return this._centerObject(t, e)
        },
        viewportCenterObjectH: function(t) {
            var e = this.getVpCenter();
            return this._centerObject(t, new fabric.Point(e.x, t.getCenterPoint().y)), this
        },
        viewportCenterObjectV: function(t) {
            var e = this.getVpCenter();
            return this._centerObject(t, new fabric.Point(t.getCenterPoint().x, e.y))
        },
        getVpCenter: function() {
            var t = this.getCenter(), e = o(this.viewportTransform);
            return n({
                x: t.left,
                y: t.top
            }, e)
        },
        _centerObject: function(t, e) {
            return t.setPositionByOrigin(e, "center", "center"), t.setCoords(), this.renderOnAddRemove && this.requestRenderAll(), this
        },
        toDatalessJSON: function(t) {
            return this.toDatalessObject(t)
        },
        toObject: function(t) {
            return this._toObjectMethod("toObject", t)
        },
        toDatalessObject: function(t) {
            return this._toObjectMethod("toDatalessObject", t)
        },
        _toObjectMethod: function(e, r) {
            var i = this.clipPath, n = {
                version: fabric.version,
                objects: this._toObjects(e, r)
            };
            return i && (i = i.toObject(r)), t(n, this.__serializeBgOverlay(e, r)), fabric.util.populateWithProperties(this, n, r), n
        },
        _toObjects: function(t, e) {
            return this._objects.filter(function(t) {
                return !t.excludeFromExport
            }).map(function(r) {
                return this._toObject(r, t, e)
            }, this)
        },
        _toObject: function(t, e, r) {
            var i;
            this.includeDefaultValues || (i = t.includeDefaultValues, t.includeDefaultValues = !1);
            var n = t[e](r);
            return this.includeDefaultValues || (t.includeDefaultValues = i), n
        },
        __serializeBgOverlay: function(t, e) {
            var r = {}, i = this.backgroundImage, n = this.overlayImage;
            return this.backgroundColor && (r.background = this.backgroundColor.toObject ? this.backgroundColor.toObject(e) : this.backgroundColor), this.overlayColor && (r.overlay = this.overlayColor.toObject ? this.overlayColor.toObject(e) : this.overlayColor), i && !i.excludeFromExport && (r.backgroundImage = this._toObject(i, t, e)), n && !n.excludeFromExport && (r.overlayImage = this._toObject(n, t, e)), r
        },
        svgViewportTransformation: !0,
        toSVG: function(t, e) {
            t || (t = {}), t.reviver = e;
            var r = [];
            return this._setSVGPreamble(r, t), this._setSVGHeader(r, t), this._setSVGBgOverlayColor(r, "backgroundColor"), this._setSVGBgOverlayImage(r, "backgroundImage", e), this.clipPath && r.push('<g clip-path="url(#' + this.clipPath.clipPathId + ')" >\n'), this._setSVGObjects(r, e), this.clipPath && r.push("</g>\n"), this._setSVGBgOverlayColor(r, "overlayColor"), this._setSVGBgOverlayImage(r, "overlayImage", e), r.push("</svg>"), r.join("")
        },
        _setSVGPreamble: function(t, e) {
            e.suppressPreamble || t.push('<?xml version="1.0" encoding="', e.encoding || "UTF-8", '" standalone="no" ?>\n', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ', '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n')
        },
        _setSVGHeader: function(t, e) {
            var r, n = e.width || this.width, o = e.height || this.height,
                a = 'viewBox="0 0 ' + this.width + " " + this.height + '" ', s = fabric.Object.NUM_FRACTION_DIGITS;
            e.viewBox ? a = 'viewBox="' + e.viewBox.x + " " + e.viewBox.y + " " + e.viewBox.width + " " + e.viewBox.height + '" ' : this.svgViewportTransformation && (r = this.viewportTransform, a = 'viewBox="' + i(-r[4] / r[0], s) + " " + i(-r[5] / r[3], s) + " " + i(this.width / r[0], s) + " " + i(this.height / r[3], s) + '" '), t.push("<svg ", 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', n, '" ', 'height="', o, '" ', a, 'xml:space="preserve">\n', "<desc>Created with Fabric.js ", fabric.version, "</desc>\n", "<defs>\n", this.createSVGFontFacesMarkup(), this.createSVGRefElementsMarkup(), this.createSVGClipPathMarkup(e), "</defs>\n")
        },
        createSVGClipPathMarkup: function(t) {
            var e = this.clipPath;
            return e ? (e.clipPathId = "CLIPPATH_" + fabric.Object.__uid++, '<clipPath id="' + e.clipPathId + '" >\n' + this.clipPath.toClipPathSVG(t.reviver) + "</clipPath>\n") : ""
        },
        createSVGRefElementsMarkup: function() {
            var t = this, e = ["backgroundColor", "overlayColor"].map(function(e) {
                var r = t[e];
                return r && r.toLive ? r.toSVG(t, !1) : void 0
            });
            return e.join("")
        },
        createSVGFontFacesMarkup: function() {
            var t, e, r, i, n, o, a, s, c, u = "", l = {}, f = fabric.fontPaths, h = this._objects;
            for (s = 0, c = h.length; c > s; s++) {
                if (t = h[s], e = t.fontFamily, -1 !== t.type.indexOf("text") && !l[e] && f[e] && (l[e] = !0, t.styles)) {
                    r = t.styles;
                    for (n in r) {
                        i = r[n];
                        for (a in i) {
                            o = i[a], e = o.fontFamily, !l[e] && f[e] && (l[e] = !0)
                        }
                    }
                }
            }
            for (var d in l) {
                u += ["		@font-face {\n", "			font-family: '", d, "';\n", "			src: url('", f[d], "');\n", "		}\n"].join("");
            }
            return u && (u = ['	<style type="text/css">', "<![CDATA[\n", u, "]]>", "</style>\n"].join("")), u
        },
        _setSVGObjects: function(t, e) {
            var r, i, n, o = this._objects;
            for (i = 0, n = o.length; n > i; i++) {
                r = o[i], r.excludeFromExport || this._setSVGObject(t, r, e)
            }
        },
        _setSVGObject: function(t, e, r) {
            t.push(e.toSVG(r))
        },
        _setSVGBgOverlayImage: function(t, e, r) {
            this[e] && !this[e].excludeFromExport && this[e].toSVG && t.push(this[e].toSVG(r))
        },
        _setSVGBgOverlayColor: function(t, e) {
            var r = this[e], i = this.viewportTransform, n = this.width / i[0], o = this.height / i[3];
            if (r) {
                if (r.toLive) {
                    var a = r.repeat;
                    t.push('<rect transform="translate(', n / 2, ",", o / 2, ')"', ' x="', r.offsetX - n / 2, '" y="', r.offsetY - o / 2, '" ', 'width="', "repeat-y" === a || "no-repeat" === a ? r.source.width : n, '" height="', "repeat-x" === a || "no-repeat" === a ? r.source.height : o, '" fill="url(#SVGID_' + r.id + ')"', "></rect>\n")
                } else {
                    t.push('<rect x="0" y="0" width="100%" height="100%" ', 'fill="', this[e], '"', "></rect>\n")
                }
            }
        },
        sendToBack: function(t) {
            if (!t) {
                return this;
            }
            var e, i, n, o = this._activeObject;
            if (t === o && "activeSelection" === t.type) {
                for (n = o._objects, e = n.length; e--;) {
                    i = n[e], r(this._objects, i), this._objects.unshift(i);
                }
            } else {
                r(this._objects, t), this._objects.unshift(t);
            }
            return this.renderOnAddRemove && this.requestRenderAll(), this
        },
        bringToFront: function(t) {
            if (!t) {
                return this;
            }
            var e, i, n, o = this._activeObject;
            if (t === o && "activeSelection" === t.type) {
                for (n = o._objects, e = 0; e < n.length; e++) {
                    i = n[e], r(this._objects, i), this._objects.push(i);
                }
            } else {
                r(this._objects, t), this._objects.push(t);
            }
            return this.renderOnAddRemove && this.requestRenderAll(), this
        },
        sendBackwards: function(t, e) {
            if (!t) {
                return this;
            }
            var i, n, o, a, s, c = this._activeObject, u = 0;
            if (t === c && "activeSelection" === t.type) {
                for (s = c._objects, i = 0; i < s.length; i++) {
                    n = s[i], o = this._objects.indexOf(n), o > 0 + u && (a = o - 1, r(this._objects, n), this._objects.splice(a, 0, n)), u++;
                }
            } else {
                o = this._objects.indexOf(t), 0 !== o && (a = this._findNewLowerIndex(t, o, e), r(this._objects, t), this._objects.splice(a, 0, t));
            }
            return this.renderOnAddRemove && this.requestRenderAll(), this
        },
        _findNewLowerIndex: function(t, e, r) {
            var i, n;
            if (r) {
                for (i = e, n = e - 1; n >= 0; --n) {
                    var o = t.intersectsWithObject(this._objects[n]) || t.isContainedWithinObject(this._objects[n]) || this._objects[n].isContainedWithinObject(t);
                    if (o) {
                        i = n;
                        break
                    }
                }
            } else {
                i = e - 1;
            }
            return i
        },
        bringForward: function(t, e) {
            if (!t) {
                return this;
            }
            var i, n, o, a, s, c = this._activeObject, u = 0;
            if (t === c && "activeSelection" === t.type) {
                for (s = c._objects, i = s.length; i--;) {
                    n = s[i], o = this._objects.indexOf(n), o < this._objects.length - 1 - u && (a = o + 1, r(this._objects, n), this._objects.splice(a, 0, n)), u++;
                }
            } else {
                o = this._objects.indexOf(t), o !== this._objects.length - 1 && (a = this._findNewUpperIndex(t, o, e), r(this._objects, t), this._objects.splice(a, 0, t));
            }
            return this.renderOnAddRemove && this.requestRenderAll(), this
        },
        _findNewUpperIndex: function(t, e, r) {
            var i, n, o;
            if (r) {
                for (i = e, n = e + 1, o = this._objects.length; o > n; ++n) {
                    var a = t.intersectsWithObject(this._objects[n]) || t.isContainedWithinObject(this._objects[n]) || this._objects[n].isContainedWithinObject(t);
                    if (a) {
                        i = n;
                        break
                    }
                }
            } else {
                i = e + 1;
            }
            return i
        },
        moveTo: function(t, e) {
            return r(this._objects, t), this._objects.splice(e, 0, t), this.renderOnAddRemove && this.requestRenderAll()
        },
        dispose: function() {
            return this.isRendering && (fabric.util.cancelAnimFrame(this.isRendering), this.isRendering = 0), this.forEachObject(function(t) {
                t.dispose && t.dispose()
            }), this._objects = [], this.backgroundImage && this.backgroundImage.dispose && this.backgroundImage.dispose(), this.backgroundImage = null, this.overlayImage && this.overlayImage.dispose && this.overlayImage.dispose(), this.overlayImage = null, this._iTextInstances = null, this.contextContainer = null, fabric.util.cleanUpJsdomNode(this.lowerCanvasEl), this.lowerCanvasEl = void 0, this
        },
        toString: function() {
            return "#<fabric.Canvas (" + this.complexity() + "): { objects: " + this._objects.length + " }>"
        }
    }), t(fabric.StaticCanvas.prototype, fabric.Observable), t(fabric.StaticCanvas.prototype, fabric.Collection), t(fabric.StaticCanvas.prototype, fabric.DataURLExporter), t(fabric.StaticCanvas, {
        EMPTY_JSON: '{"objects": [], "background": "white"}',
        supports: function(t) {
            var e = s();
            if (!e || !e.getContext) {
                return null;
            }
            var r = e.getContext("2d");
            if (!r) {
                return null;
            }
            switch (t) {
                case"getImageData":
                    return "undefined" != typeof r.getImageData;
                case"setLineDash":
                    return "undefined" != typeof r.setLineDash;
                case"toDataURL":
                    return "undefined" != typeof e.toDataURL;
                case"toDataURLWithQuality":
                    try {
                        return e.toDataURL("image/jpeg", 0), !0
                    } catch (i) {
                    }
                    return !1;
                default:
                    return null
            }
        }
    }), fabric.StaticCanvas.prototype.toJSON = fabric.StaticCanvas.prototype.toObject, fabric.isLikelyNode && (fabric.StaticCanvas.prototype.createPNGStream = function() {
        var t = a(this.lowerCanvasEl);
        return t && t.createPNGStream()
    }, fabric.StaticCanvas.prototype.createJPEGStream = function(t) {
        var e = a(this.lowerCanvasEl);
        return e && e.createJPEGStream(t)
    })
}();
fabric.BaseBrush = fabric.util.createClass({
    color: "rgb(0, 0, 0)",
    width: 1,
    shadow: null,
    strokeLineCap: "round",
    strokeLineJoin: "round",
    strokeMiterLimit: 10,
    strokeDashArray: null,
    setShadow: function(t) {
        return this.shadow = new fabric.Shadow(t), this
    },
    _setBrushStyles: function() {
        var t = this.canvas.contextTop;
        t.strokeStyle = this.color, t.lineWidth = this.width, t.lineCap = this.strokeLineCap, t.miterLimit = this.strokeMiterLimit, t.lineJoin = this.strokeLineJoin, fabric.StaticCanvas.supports("setLineDash") && t.setLineDash(this.strokeDashArray || [])
    },
    _saveAndTransform: function(t) {
        var e = this.canvas.viewportTransform;
        t.save(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5])
    },
    _setShadow: function() {
        if (this.shadow) {
            var t = this.canvas.contextTop, e = this.canvas.getZoom();
            t.shadowColor = this.shadow.color, t.shadowBlur = this.shadow.blur * e, t.shadowOffsetX = this.shadow.offsetX * e, t.shadowOffsetY = this.shadow.offsetY * e
        }
    },
    _resetShadow: function() {
        var t = this.canvas.contextTop;
        t.shadowColor = "", t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0
    }
});
!function() {
    fabric.PencilBrush = fabric.util.createClass(fabric.BaseBrush, {
        initialize: function(t) {
            this.canvas = t, this._points = []
        },
        _drawSegment: function(t, e, r) {
            var i = e.midPointFrom(r);
            return t.quadraticCurveTo(e.x, e.y, i.x, i.y), i
        },
        onMouseDown: function(t) {
            this._prepareForDrawing(t), this._captureDrawingPath(t), this._render()
        },
        onMouseMove: function(t) {
            if (this._captureDrawingPath(t) && this._points.length > 1) {
                if (this.needsFullRender) {
                    this.canvas.clearContext(this.canvas.contextTop), this._render();
                } else {
                    var e = this._points, r = e.length, i = this.canvas.contextTop;
                    this._saveAndTransform(i), this.oldEnd && (i.beginPath(), i.moveTo(this.oldEnd.x, this.oldEnd.y)), this.oldEnd = this._drawSegment(i, e[r - 2], e[r - 1], !0), i.stroke(), i.restore()
                }
            }
        },
        onMouseUp: function() {
            this.oldEnd = void 0, this._finalizeAndAddPath()
        },
        _prepareForDrawing: function(t) {
            var e = new fabric.Point(t.x, t.y);
            this._reset(), this._addPoint(e), this.canvas.contextTop.moveTo(e.x, e.y)
        },
        _addPoint: function(t) {
            return this._points.length > 1 && t.eq(this._points[this._points.length - 1]) ? !1 : (this._points.push(t), !0)
        },
        _reset: function() {
            this._points.length = 0, this._setBrushStyles();
            var t = new fabric.Color(this.color);
            this.needsFullRender = t.getAlpha() < 1, this._setShadow()
        },
        _captureDrawingPath: function(t) {
            var e = new fabric.Point(t.x, t.y);
            return this._addPoint(e)
        },
        _render: function() {
            var t, e, r = this.canvas.contextTop, i = this._points[0], n = this._points[1];
            if (this._saveAndTransform(r), r.beginPath(), 2 === this._points.length && i.x === n.x && i.y === n.y) {
                var o = this.width / 1e3;
                i = new fabric.Point(i.x, i.y), n = new fabric.Point(n.x, n.y), i.x -= o, n.x += o
            }
            for (r.moveTo(i.x, i.y), t = 1, e = this._points.length; e > t; t++) {
                this._drawSegment(r, i, n), i = this._points[t], n = this._points[t + 1];
            }
            r.lineTo(i.x, i.y), r.stroke(), r.restore()
        },
        convertPointsToSVGPath: function(t) {
            var e, r = [], i = this.width / 1e3, n = new fabric.Point(t[0].x, t[0].y),
                o = new fabric.Point(t[1].x, t[1].y), a = t.length, s = 1, c = 1, u = a > 2;
            for (u && (s = t[2].x < o.x ? -1 : t[2].x === o.x ? 0 : 1, c = t[2].y < o.y ? -1 : t[2].y === o.y ? 0 : 1), r.push("M ", n.x - s * i, " ", n.y - c * i, " "), e = 1; a > e; e++) {
                if (!n.eq(o)) {
                    var l = n.midPointFrom(o);
                    r.push("Q ", n.x, " ", n.y, " ", l.x, " ", l.y, " ")
                }
                n = t[e], e + 1 < t.length && (o = t[e + 1])
            }
            return u && (s = n.x > t[e - 2].x ? 1 : n.x === t[e - 2].x ? 0 : -1, c = n.y > t[e - 2].y ? 1 : n.y === t[e - 2].y ? 0 : -1), r.push("L ", n.x + s * i, " ", n.y + c * i), r
        },
        createPath: function(t) {
            var e = new fabric.Path(t, {
                fill: null,
                stroke: this.color,
                strokeWidth: this.width,
                strokeLineCap: this.strokeLineCap,
                strokeMiterLimit: this.strokeMiterLimit,
                strokeLineJoin: this.strokeLineJoin,
                strokeDashArray: this.strokeDashArray
            }), r = new fabric.Point(e.left + e.width / 2, e.top + e.height / 2);
            return r = e.translateToGivenOrigin(r, "center", "center", e.originX, e.originY), e.top = r.y, e.left = r.x, this.shadow && (this.shadow.affectStroke = !0, e.setShadow(this.shadow)), e
        },
        _finalizeAndAddPath: function() {
            var t = this.canvas.contextTop;
            t.closePath();
            var e = this.convertPointsToSVGPath(this._points).join("");
            if ("M 0 0 Q 0 0 0 0 L 0 0" === e) {
                return void this.canvas.requestRenderAll();
            }
            var r = this.createPath(e);
            this.canvas.clearContext(this.canvas.contextTop), this.canvas.add(r), this.canvas.renderAll(), r.setCoords(), this._resetShadow(), this.canvas.fire("path:created", {path: r})
        }
    })
}();
fabric.CircleBrush = fabric.util.createClass(fabric.BaseBrush, {
    width: 10,
    initialize: function(t) {
        this.canvas = t, this.points = []
    },
    drawDot: function(t) {
        var e = this.addPoint(t), r = this.canvas.contextTop;
        this._saveAndTransform(r), r.fillStyle = e.fill, r.beginPath(), r.arc(e.x, e.y, e.radius, 0, 2 * Math.PI, !1), r.closePath(), r.fill(), r.restore()
    },
    onMouseDown: function(t) {
        this.points.length = 0, this.canvas.clearContext(this.canvas.contextTop), this._setShadow(), this.drawDot(t)
    },
    _render: function() {
        var t, e, r, i = this.canvas.contextTop, n = this.points;
        for (this._saveAndTransform(i), t = 0, e = n.length; e > t; t++) {
            r = n[t], i.fillStyle = r.fill, i.beginPath(), i.arc(r.x, r.y, r.radius, 0, 2 * Math.PI, !1), i.closePath(), i.fill();
        }
        i.restore()
    },
    onMouseMove: function(t) {
        this.drawDot(t)
    },
    onMouseUp: function() {
        var t, e, r = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = !1;
        var i = [];
        for (t = 0, e = this.points.length; e > t; t++) {
            var n = this.points[t], o = new fabric.Circle({
                radius: n.radius,
                left: n.x,
                top: n.y,
                originX: "center",
                originY: "center",
                fill: n.fill
            });
            this.shadow && o.setShadow(this.shadow), i.push(o)
        }
        var a = new fabric.Group(i);
        a.canvas = this.canvas, this.canvas.add(a), this.canvas.fire("path:created", {path: a}), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderOnAddRemove = r, this.canvas.requestRenderAll()
    },
    addPoint: function(t) {
        var e = new fabric.Point(t.x, t.y),
            r = fabric.util.getRandomInt(Math.max(0, this.width - 20), this.width + 20) / 2,
            i = new fabric.Color(this.color).setAlpha(fabric.util.getRandomInt(0, 100) / 100).toRgba();
        return e.radius = r, e.fill = i, this.points.push(e), e
    }
});
fabric.SprayBrush = fabric.util.createClass(fabric.BaseBrush, {
    width: 10,
    density: 20,
    dotWidth: 1,
    dotWidthVariance: 1,
    randomOpacity: !1,
    optimizeOverlapping: !0,
    initialize: function(t) {
        this.canvas = t, this.sprayChunks = []
    },
    onMouseDown: function(t) {
        this.sprayChunks.length = 0, this.canvas.clearContext(this.canvas.contextTop), this._setShadow(), this.addSprayChunk(t), this.render(this.sprayChunkPoints)
    },
    onMouseMove: function(t) {
        this.addSprayChunk(t), this.render(this.sprayChunkPoints)
    },
    onMouseUp: function() {
        var t = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = !1;
        for (var e = [], r = 0, i = this.sprayChunks.length; i > r; r++) {
            for (var n = this.sprayChunks[r], a = 0, o = n.length; o > a; a++) {
                var s = new fabric.Rect({
                    width: n[a].width,
                    height: n[a].width,
                    left: n[a].x + 1,
                    top: n[a].y + 1,
                    originX: "center",
                    originY: "center",
                    fill: this.color
                });
                e.push(s)
            }
        }
        this.optimizeOverlapping && (e = this._getOptimizedRects(e));
        var c = new fabric.Group(e);
        this.shadow && c.setShadow(this.shadow), this.canvas.add(c), this.canvas.fire("path:created", {path: c}), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderOnAddRemove = t, this.canvas.requestRenderAll()
    },
    _getOptimizedRects: function(t) {
        var e, r, i, n = {};
        for (r = 0, i = t.length; i > r; r++) {
            e = t[r].left + "" + t[r].top, n[e] || (n[e] = t[r]);
        }
        var a = [];
        for (e in n) {
            a.push(n[e]);
        }
        return a
    },
    render: function(t) {
        var e, r, i = this.canvas.contextTop;
        for (i.fillStyle = this.color, this._saveAndTransform(i), e = 0, r = t.length; r > e; e++) {
            var n = t[e];
            "undefined" != typeof n.opacity && (i.globalAlpha = n.opacity), i.fillRect(n.x, n.y, n.width, n.width)
        }
        i.restore()
    },
    _render: function() {
        var t, e, r = this.canvas.contextTop;
        for (r.fillStyle = this.color, this._saveAndTransform(r), t = 0, e = this.sprayChunks.length; e > t; t++) {
            this.render(this.sprayChunks[t]);
        }
        r.restore()
    },
    addSprayChunk: function(t) {
        this.sprayChunkPoints = [];
        var e, r, i, n, a = this.width / 2;
        for (n = 0; n < this.density; n++) {
            e = fabric.util.getRandomInt(t.x - a, t.x + a), r = fabric.util.getRandomInt(t.y - a, t.y + a), i = this.dotWidthVariance ? fabric.util.getRandomInt(Math.max(1, this.dotWidth - this.dotWidthVariance), this.dotWidth + this.dotWidthVariance) : this.dotWidth;
            var o = new fabric.Point(e, r);
            o.width = i, this.randomOpacity && (o.opacity = fabric.util.getRandomInt(0, 100) / 100), this.sprayChunkPoints.push(o)
        }
        this.sprayChunks.push(this.sprayChunkPoints)
    }
});
fabric.PatternBrush = fabric.util.createClass(fabric.PencilBrush, {
    getPatternSrc: function() {
        var t = 20, e = 5, r = fabric.util.createCanvasElement(), i = r.getContext("2d");
        return r.width = r.height = t + e, i.fillStyle = this.color, i.beginPath(), i.arc(t / 2, t / 2, t / 2, 0, 2 * Math.PI, !1), i.closePath(), i.fill(), r
    },
    getPatternSrcFunction: function() {
        return String(this.getPatternSrc).replace("this.color", '"' + this.color + '"')
    },
    getPattern: function() {
        return this.canvas.contextTop.createPattern(this.source || this.getPatternSrc(), "repeat")
    },
    _setBrushStyles: function() {
        this.callSuper("_setBrushStyles"), this.canvas.contextTop.strokeStyle = this.getPattern()
    },
    createPath: function(t) {
        var e = this.callSuper("createPath", t), r = e._getLeftTopCoords().scalarAdd(e.strokeWidth / 2);
        return e.stroke = new fabric.Pattern({
            source: this.source || this.getPatternSrcFunction(),
            offsetX: -r.x,
            offsetY: -r.y
        }), e
    }
});
!function() {
    var t = fabric.util.getPointer, e = fabric.util.degreesToRadians, i = fabric.util.radiansToDegrees, r = Math.atan2,
        n = Math.abs, a = fabric.StaticCanvas.supports("setLineDash"), s = .5;
    fabric.Canvas = fabric.util.createClass(fabric.StaticCanvas, {
        initialize: function(t, e) {
            e || (e = {}), this.renderAndResetBound = this.renderAndReset.bind(this), this.requestRenderAllBound = this.requestRenderAll.bind(this), this._initStatic(t, e), this._initInteractive(), this._createCacheCanvas()
        },
        uniScaleTransform: !1,
        uniScaleKey: "shiftKey",
        centeredScaling: !1,
        centeredRotation: !1,
        centeredKey: "altKey",
        altActionKey: "shiftKey",
        interactive: !0,
        selection: !0,
        selectionKey: "shiftKey",
        altSelectionKey: null,
        selectionColor: "rgba(100, 100, 255, 0.3)",
        selectionDashArray: [],
        selectionBorderColor: "rgba(255, 255, 255, 0.3)",
        selectionLineWidth: 1,
        selectionFullyContained: !1,
        hoverCursor: "move",
        moveCursor: "move",
        defaultCursor: "default",
        freeDrawingCursor: "crosshair",
        rotationCursor: "crosshair",
        notAllowedCursor: "not-allowed",
        containerClass: "canvas-container",
        perPixelTargetFind: !1,
        targetFindTolerance: 0,
        skipTargetFind: !1,
        isDrawingMode: !1,
        preserveObjectStacking: !1,
        snapAngle: 0,
        snapThreshold: null,
        stopContextMenu: !1,
        fireRightClick: !1,
        fireMiddleClick: !1,
        _initInteractive: function() {
            this._currentTransform = null, this._groupSelector = null, this._initWrapperElement(), this._createUpperCanvas(), this._initEventListeners(), this._initRetinaScaling(), this.freeDrawingBrush = fabric.PencilBrush && new fabric.PencilBrush(this), this.calcOffset()
        },
        _chooseObjectsToRender: function() {
            var t, e, i, r = this.getActiveObjects();
            if (r.length > 0 && !this.preserveObjectStacking) {
                e = [], i = [];
                for (var n = 0, a = this._objects.length; a > n; n++) {
                    t = this._objects[n], -1 === r.indexOf(t) ? e.push(t) : i.push(t);
                }
                r.length > 1 && (this._activeObject._objects = i), e.push.apply(e, i)
            } else {
                e = this._objects;
            }
            return e
        },
        renderAll: function() {
            !this.contextTopDirty || this._groupSelector || this.isDrawingMode || (this.clearContext(this.contextTop), this.contextTopDirty = !1), this.hasLostContext && this.renderTopLayer(this.contextTop);
            var t = this.contextContainer;
            return this.renderCanvas(t, this._chooseObjectsToRender()), this
        },
        renderTopLayer: function(t) {
            this.isDrawingMode && this._isCurrentlyDrawing && (this.freeDrawingBrush && this.freeDrawingBrush._render(), this.contextTopDirty = !0), this.selection && this._groupSelector && (this._drawSelection(t), this.contextTopDirty = !0)
        },
        renderTop: function() {
            var t = this.contextTop;
            return this.clearContext(t), this.renderTopLayer(t), this.fire("after:render"), this
        },
        _resetCurrentTransform: function() {
            var t = this._currentTransform;
            t.target.set({
                scaleX: t.original.scaleX,
                scaleY: t.original.scaleY,
                skewX: t.original.skewX,
                skewY: t.original.skewY,
                left: t.original.left,
                top: t.original.top
            }), this._shouldCenterTransform(t.target) ? ("center" !== t.originX && (t.mouseXSign = "right" === t.originX ? -1 : 1), "center" !== t.originY && (t.mouseYSign = "bottom" === t.originY ? -1 : 1), t.originX = "center", t.originY = "center") : (t.originX = t.original.originX, t.originY = t.original.originY)
        },
        containsPoint: function(t, e, i) {
            var r, n = !0, a = i || this.getPointer(t, n);
            return r = e.group && e.group === this._activeObject && "activeSelection" === e.group.type ? this._normalizePointer(e.group, a) : {
                x: a.x,
                y: a.y
            }, e.containsPoint(r) || e._findTargetCorner(a)
        },
        _normalizePointer: function(t, e) {
            var i = t.calcTransformMatrix(), r = fabric.util.invertTransform(i), n = this.restorePointerVpt(e);
            return fabric.util.transformPoint(n, r)
        },
        isTargetTransparent: function(t, e, i) {
            if (t.shouldCache() && t._cacheCanvas) {
                var r = this._normalizePointer(t, {
                        x: e,
                        y: i
                    }), n = t.cacheTranslationX + r.x * t.zoomX, a = t.cacheTranslationY + r.y * t.zoomY,
                    s = fabric.util.isTransparent(t._cacheContext, n, a, this.targetFindTolerance);
                return s
            }
            var o = this.contextCache, c = t.selectionBackgroundColor, l = this.viewportTransform;
            t.selectionBackgroundColor = "", this.clearContext(o), o.save(), o.transform(l[0], l[1], l[2], l[3], l[4], l[5]), t.render(o), o.restore(), t === this._activeObject && t._renderControls(o, {
                hasBorders: !1,
                transparentCorners: !1
            }, {hasBorders: !1}), t.selectionBackgroundColor = c;
            var s = fabric.util.isTransparent(o, e, i, this.targetFindTolerance);
            return s
        },
        _isSelectionKeyPressed: function(t) {
            var e = !1;
            return e = "[object Array]" === Object.prototype.toString.call(this.selectionKey) ? !!this.selectionKey.find(function(e) {
                return t[e] === !0
            }) : t[this.selectionKey]
        },
        _shouldClearSelection: function(t, e) {
            var i = this.getActiveObjects(), r = this._activeObject;
            return !e || e && r && i.length > 1 && -1 === i.indexOf(e) && r !== e && !this._isSelectionKeyPressed(t) || e && !e.evented || e && !e.selectable && r && r !== e
        },
        _shouldCenterTransform: function(t) {
            if (t) {
                var e, i = this._currentTransform;
                return "scale" === i.action || "scaleX" === i.action || "scaleY" === i.action ? e = this.centeredScaling || t.centeredScaling : "rotate" === i.action && (e = this.centeredRotation || t.centeredRotation), e ? !i.altKey : i.altKey
            }
        },
        _getOriginFromCorner: function(t, e) {
            var i = {
                x: t.originX,
                y: t.originY
            };
            return "ml" === e || "tl" === e || "bl" === e ? i.x = "right" : ("mr" === e || "tr" === e || "br" === e) && (i.x = "left"), "tl" === e || "mt" === e || "tr" === e ? i.y = "bottom" : ("bl" === e || "mb" === e || "br" === e) && (i.y = "top"), i
        },
        _getActionFromCorner: function(t, e, i) {
            if (!e) {
                return "drag";
            }
            switch (e) {
                case"mtr":
                    return "rotate";
                case"ml":
                case"mr":
                    return i[this.altActionKey] ? "skewY" : "scaleX";
                case"mt":
                case"mb":
                    return i[this.altActionKey] ? "skewX" : "scaleY";
                default:
                    return "scale"
            }
        },
        _setupCurrentTransform: function(t, i) {
            if (i) {
                var r = this.getPointer(t), n = i._findTargetCorner(this.getPointer(t, !0)),
                    a = this._getActionFromCorner(i, n, t), s = this._getOriginFromCorner(i, n);
                this._currentTransform = {
                    target: i,
                    action: a,
                    corner: n,
                    scaleX: i.scaleX,
                    scaleY: i.scaleY,
                    skewX: i.skewX,
                    skewY: i.skewY,
                    offsetX: r.x - i.left,
                    offsetY: r.y - i.top,
                    originX: s.x,
                    originY: s.y,
                    ex: r.x,
                    ey: r.y,
                    lastX: r.x,
                    lastY: r.y,
                    theta: e(i.angle),
                    width: i.width * i.scaleX,
                    mouseXSign: 1,
                    mouseYSign: 1,
                    shiftKey: t.shiftKey,
                    altKey: t[this.centeredKey],
                    original: fabric.util.saveObjectTransform(i)
                }, this._currentTransform.original.originX = s.x, this._currentTransform.original.originY = s.y, this._resetCurrentTransform(), this._beforeTransform(t)
            }
        },
        _translateObject: function(t, e) {
            var i = this._currentTransform, r = i.target, n = t - i.offsetX, a = e - i.offsetY,
                s = !r.get("lockMovementX") && r.left !== n, o = !r.get("lockMovementY") && r.top !== a;
            return s && r.set("left", n), o && r.set("top", a), s || o
        },
        _changeSkewTransformOrigin: function(t, e, i) {
            var r = "originX", n = {0: "center"}, a = e.target.skewX, s = "left", o = "right",
                c = "mt" === e.corner || "ml" === e.corner ? 1 : -1, l = 1;
            t = t > 0 ? 1 : -1, "y" === i && (a = e.target.skewY, s = "top", o = "bottom", r = "originY"), n[-1] = s, n[1] = o, e.target.flipX && (l *= -1), e.target.flipY && (l *= -1), 0 === a ? (e.skewSign = -c * t * l, e[r] = n[-t]) : (a = a > 0 ? 1 : -1, e.skewSign = a, e[r] = n[a * c * l])
        },
        _skewObject: function(t, e, i) {
            var r = this._currentTransform, n = r.target, a = !1, s = n.get("lockSkewingX"), o = n.get("lockSkewingY");
            if (s && "x" === i || o && "y" === i) {
                return !1;
            }
            var c, l, u = n.getCenterPoint(), h = n.toLocalPoint(new fabric.Point(t, e), "center", "center")[i],
                f = n.toLocalPoint(new fabric.Point(r.lastX, r.lastY), "center", "center")[i],
                d = n._getTransformedDimensions();
            return this._changeSkewTransformOrigin(h - f, r, i), c = n.toLocalPoint(new fabric.Point(t, e), r.originX, r.originY)[i], l = n.translateToOriginPoint(u, r.originX, r.originY), a = this._setObjectSkew(c, r, i, d), r.lastX = t, r.lastY = e, n.setPositionByOrigin(l, r.originX, r.originY), a
        },
        _setObjectSkew: function(t, e, i, r) {
            var n, a, s, o, c, l, u, h, f, d = e.target, p = !1, g = e.skewSign;
            return "x" === i ? (o = "y", c = "Y", l = "X", h = 0, f = d.skewY) : (o = "x", c = "X", l = "Y", h = d.skewX, f = 0), s = d._getTransformedDimensions(h, f), u = 2 * Math.abs(t) - s[i], 2 >= u ? n = 0 : (n = g * Math.atan(u / d["scale" + l] / (s[o] / d["scale" + c])), n = fabric.util.radiansToDegrees(n)), p = d["skew" + l] !== n, d.set("skew" + l, n), 0 !== d["skew" + c] && (a = d._getTransformedDimensions(), n = r[o] / a[o] * d["scale" + c], d.set("scale" + c, n)), p
        },
        _scaleObject: function(t, e, i) {
            var r = this._currentTransform, n = r.target, a = n.lockScalingX, s = n.lockScalingY, o = n.lockScalingFlip;
            if (a && s) {
                return !1;
            }
            var c = n.translateToOriginPoint(n.getCenterPoint(), r.originX, r.originY),
                l = n.toLocalPoint(new fabric.Point(t, e), r.originX, r.originY), u = n._getTransformedDimensions(),
                h = !1;
            return this._setLocalMouse(l, r), h = this._setObjectScale(l, r, a, s, i, o, u), n.setPositionByOrigin(c, r.originX, r.originY), h
        },
        _setObjectScale: function(t, e, i, r, n, a, s) {
            var o, c, l, u, h = e.target, f = !1, d = !1, p = !1;
            return l = t.x * h.scaleX / s.x, u = t.y * h.scaleY / s.y, o = h.scaleX !== l, c = h.scaleY !== u, a && 0 >= l && l < h.scaleX && (f = !0, t.x = 0), a && 0 >= u && u < h.scaleY && (d = !0, t.y = 0), "equally" !== n || i || r ? n ? "x" !== n || h.get("lockUniScaling") ? "y" !== n || h.get("lockUniScaling") || d || r || h.set("scaleY", u) && (p = p || c) : f || i || h.set("scaleX", l) && (p = p || o) : (f || i || h.set("scaleX", l) && (p = p || o), d || r || h.set("scaleY", u) && (p = p || c)) : p = this._scaleObjectEqually(t, h, e, s), e.newScaleX = l, e.newScaleY = u, f || d || this._flipObject(e, n), p
        },
        _scaleObjectEqually: function(t, e, i, r) {
            var n, a = t.y + t.x, s = r.y * i.original.scaleY / e.scaleY + r.x * i.original.scaleX / e.scaleX,
                o = t.x < 0 ? -1 : 1, c = t.y < 0 ? -1 : 1;
            return i.newScaleX = o * Math.abs(i.original.scaleX * a / s), i.newScaleY = c * Math.abs(i.original.scaleY * a / s), n = i.newScaleX !== e.scaleX || i.newScaleY !== e.scaleY, e.set("scaleX", i.newScaleX), e.set("scaleY", i.newScaleY), n
        },
        _flipObject: function(t, e) {
            t.newScaleX < 0 && "y" !== e && ("left" === t.originX ? t.originX = "right" : "right" === t.originX && (t.originX = "left")), t.newScaleY < 0 && "x" !== e && ("top" === t.originY ? t.originY = "bottom" : "bottom" === t.originY && (t.originY = "top"))
        },
        _setLocalMouse: function(t, e) {
            var i = e.target, r = this.getZoom(), a = i.padding / r;
            "right" === e.originX ? t.x *= -1 : "center" === e.originX && (t.x *= 2 * e.mouseXSign, t.x < 0 && (e.mouseXSign = -e.mouseXSign)), "bottom" === e.originY ? t.y *= -1 : "center" === e.originY && (t.y *= 2 * e.mouseYSign, t.y < 0 && (e.mouseYSign = -e.mouseYSign)), n(t.x) > a ? t.x < 0 ? t.x += a : t.x -= a : t.x = 0, n(t.y) > a ? t.y < 0 ? t.y += a : t.y -= a : t.y = 0
        },
        _rotateObject: function(t, e) {
            var n, a = this._currentTransform, s = a.target,
                n = s.translateToOriginPoint(s.getCenterPoint(), a.originX, a.originY);
            if (s.lockRotation) {
                return !1;
            }
            var o = r(a.ey - n.y, a.ex - n.x), c = r(e - n.y, t - n.x), l = i(c - o + a.theta), u = !0;
            if (s.snapAngle > 0) {
                var h = s.snapAngle, f = s.snapThreshold || h, d = Math.ceil(l / h) * h, p = Math.floor(l / h) * h;
                Math.abs(l - p) < f ? l = p : Math.abs(l - d) < f && (l = d)
            }
            return 0 > l && (l = 360 + l), l %= 360, s.angle === l ? u = !1 : (s.angle = l, s.setPositionByOrigin(n, a.originX, a.originY)), u
        },
        setCursor: function(t) {
            this.upperCanvasEl.style.cursor = t
        },
        _drawSelection: function(t) {
            var e = this._groupSelector, i = e.left, r = e.top, o = n(i), c = n(r);
            if (this.selectionColor && (t.fillStyle = this.selectionColor, t.fillRect(e.ex - (i > 0 ? 0 : -i), e.ey - (r > 0 ? 0 : -r), o, c)), this.selectionLineWidth && this.selectionBorderColor) {
                if (t.lineWidth = this.selectionLineWidth, t.strokeStyle = this.selectionBorderColor, this.selectionDashArray.length > 1 && !a) {
                    var l = e.ex + s - (i > 0 ? 0 : o), u = e.ey + s - (r > 0 ? 0 : c);
                    t.beginPath(), fabric.util.drawDashedLine(t, l, u, l + o, u, this.selectionDashArray), fabric.util.drawDashedLine(t, l, u + c - 1, l + o, u + c - 1, this.selectionDashArray), fabric.util.drawDashedLine(t, l, u, l, u + c, this.selectionDashArray), fabric.util.drawDashedLine(t, l + o - 1, u, l + o - 1, u + c, this.selectionDashArray), t.closePath(), t.stroke()
                } else {
                    fabric.Object.prototype._setLineDash.call(this, t, this.selectionDashArray), t.strokeRect(e.ex + s - (i > 0 ? 0 : o), e.ey + s - (r > 0 ? 0 : c), o, c)
                }
            }
        },
        findTarget: function(t, e) {
            if (!this.skipTargetFind) {
                var i, r, n = !0, a = this.getPointer(t, n), s = this._activeObject, o = this.getActiveObjects();
                if (this.targets = [], o.length > 1 && !e && s === this._searchPossibleTargets([s], a)) {
                    return s;
                }
                if (1 === o.length && s._findTargetCorner(a)) {
                    return s;
                }
                if (1 === o.length && s === this._searchPossibleTargets([s], a)) {
                    if (!this.preserveObjectStacking) {
                        return s;
                    }
                    i = s, r = this.targets, this.targets = []
                }
                var c = this._searchPossibleTargets(this._objects, a);
                return t[this.altSelectionKey] && c && i && c !== i && (c = i, this.targets = r), c
            }
        },
        _checkTarget: function(t, e, i) {
            if (e && e.visible && e.evented && this.containsPoint(null, e, t)) {
                if (!this.perPixelTargetFind && !e.perPixelTargetFind || e.isEditing) {
                    return !0;
                }
                var r = this.isTargetTransparent(e, i.x, i.y);
                if (!r) {
                    return !0
                }
            }
        },
        _searchPossibleTargets: function(t, e) {
            for (var i, r, n = t.length; n--;) {
                var a = t[n];
                if (this._checkTarget(a.group && "activeSelection" !== a.group.type ? this._normalizePointer(a.group, e) : e, a, e)) {
                    i = t[n], i.subTargetCheck && i instanceof fabric.Group && (r = this._searchPossibleTargets(i._objects, e), r && this.targets.push(r));
                    break
                }
            }
            return i
        },
        restorePointerVpt: function(t) {
            return fabric.util.transformPoint(t, fabric.util.invertTransform(this.viewportTransform))
        },
        getPointer: function(e, i) {
            if (this._absolutePointer && !i) {
                return this._absolutePointer;
            }
            if (this._pointer && i) {
                return this._pointer;
            }
            var r, n = t(e), a = this.upperCanvasEl, s = a.getBoundingClientRect(), o = s.width || 0, c = s.height || 0;
            return o && c || ("top" in s && "bottom" in s && (c = Math.abs(s.top - s.bottom)), "right" in s && "left" in s && (o = Math.abs(s.right - s.left))), this.calcOffset(), n.x = n.x - this._offset.left, n.y = n.y - this._offset.top, i || (n = this.restorePointerVpt(n)), r = 0 === o || 0 === c ? {
                width: 1,
                height: 1
            } : {
                width: a.width / o,
                height: a.height / c
            }, {
                x: n.x * r.width,
                y: n.y * r.height
            }
        },
        _createUpperCanvas: function() {
            var t = this.lowerCanvasEl.className.replace(/\s*lower-canvas\s*/, "");
            this.upperCanvasEl ? this.upperCanvasEl.className = "" : this.upperCanvasEl = this._createCanvasElement(), fabric.util.addClass(this.upperCanvasEl, "upper-canvas " + t), this.wrapperEl.appendChild(this.upperCanvasEl), this._copyCanvasStyle(this.lowerCanvasEl, this.upperCanvasEl), this._applyCanvasStyle(this.upperCanvasEl), this.contextTop = this.upperCanvasEl.getContext("2d")
        },
        _createCacheCanvas: function() {
            this.cacheCanvasEl = this._createCanvasElement(), this.cacheCanvasEl.setAttribute("width", this.width), this.cacheCanvasEl.setAttribute("height", this.height), this.contextCache = this.cacheCanvasEl.getContext("2d")
        },
        _initWrapperElement: function() {
            this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, "div", {"class": this.containerClass}), fabric.util.setStyle(this.wrapperEl, {
                width: this.width + "px",
                height: this.height + "px",
                position: "relative"
            }), fabric.util.makeElementUnselectable(this.wrapperEl)
        },
        _applyCanvasStyle: function(t) {
            var e = this.width || t.width, i = this.height || t.height;
            fabric.util.setStyle(t, {
                position: "absolute",
                width: e + "px",
                height: i + "px",
                left: 0,
                top: 0,
                "touch-action": this.allowTouchScrolling ? "manipulation" : "none"
            }), t.width = e, t.height = i, fabric.util.makeElementUnselectable(t)
        },
        _copyCanvasStyle: function(t, e) {
            e.style.cssText = t.style.cssText
        },
        getSelectionContext: function() {
            return this.contextTop
        },
        getSelectionElement: function() {
            return this.upperCanvasEl
        },
        getActiveObject: function() {
            return this._activeObject
        },
        getActiveObjects: function() {
            var t = this._activeObject;
            return t ? "activeSelection" === t.type && t._objects ? t._objects.slice(0) : [t] : []
        },
        _onObjectRemoved: function(t) {
            t === this._activeObject && (this.fire("before:selection:cleared", {target: t}), this._discardActiveObject(), this.fire("selection:cleared", {target: t}), t.fire("deselected")), this._hoveredTarget === t && (this._hoveredTarget = null), this.callSuper("_onObjectRemoved", t)
        },
        _fireSelectionEvents: function(t, e) {
            var i = !1, r = this.getActiveObjects(), n = [], a = [], s = {e: e};
            t.forEach(function(t) {
                -1 === r.indexOf(t) && (i = !0, t.fire("deselected", s), a.push(t))
            }), r.forEach(function(e) {
                -1 === t.indexOf(e) && (i = !0, e.fire("selected", s), n.push(e))
            }), t.length > 0 && r.length > 0 ? (s.selected = n, s.deselected = a, s.updated = n[0] || a[0], s.target = this._activeObject, i && this.fire("selection:updated", s)) : r.length > 0 ? (1 === r.length && (s.target = n[0], this.fire("object:selected", s)), s.selected = n, s.target = this._activeObject, this.fire("selection:created", s)) : t.length > 0 && (s.deselected = a, this.fire("selection:cleared", s))
        },
        setActiveObject: function(t, e) {
            var i = this.getActiveObjects();
            return this._setActiveObject(t, e), this._fireSelectionEvents(i, e), this
        },
        _setActiveObject: function(t, e) {
            return this._activeObject === t ? !1 : this._discardActiveObject(e, t) ? t.onSelect({e: e}) ? !1 : (this._activeObject = t, !0) : !1
        },
        _discardActiveObject: function(t, e) {
            var i = this._activeObject;
            if (i) {
                if (i.onDeselect({
                    e: t,
                    object: e
                })) {
                    return !1;
                }
                this._activeObject = null
            }
            return !0
        },
        discardActiveObject: function(t) {
            var e = this.getActiveObjects();
            return e.length && this.fire("before:selection:cleared", {
                target: e[0],
                e: t
            }), this._discardActiveObject(t), this._fireSelectionEvents(e, t), this
        },
        dispose: function() {
            var t = this.wrapperEl;
            return this.removeListeners(), t.removeChild(this.upperCanvasEl), t.removeChild(this.lowerCanvasEl), this.contextCache = null, this.contextTop = null, ["upperCanvasEl", "cacheCanvasEl"].forEach(function(t) {
                fabric.util.cleanUpJsdomNode(this[t]), this[t] = void 0
            }.bind(this)), t.parentNode && t.parentNode.replaceChild(this.lowerCanvasEl, this.wrapperEl), delete this.wrapperEl, fabric.StaticCanvas.prototype.dispose.call(this), this
        },
        clear: function() {
            return this.discardActiveObject(), this.clearContext(this.contextTop), this.callSuper("clear")
        },
        drawControls: function(t) {
            var e = this._activeObject;
            e && e._renderControls(t)
        },
        _toObject: function(t, e, i) {
            var r = this._realizeGroupTransformOnObject(t), n = this.callSuper("_toObject", t, e, i);
            return this._unwindGroupTransformOnObject(t, r), n
        },
        _realizeGroupTransformOnObject: function(t) {
            if (t.group && "activeSelection" === t.group.type && this._activeObject === t.group) {
                var e = ["angle", "flipX", "flipY", "left", "scaleX", "scaleY", "skewX", "skewY", "top"], i = {};
                return e.forEach(function(e) {
                    i[e] = t[e]
                }), this._activeObject.realizeTransform(t), i
            }
            return null
        },
        _unwindGroupTransformOnObject: function(t, e) {
            e && t.set(e)
        },
        _setSVGObject: function(t, e, i) {
            var r = this._realizeGroupTransformOnObject(e);
            this.callSuper("_setSVGObject", t, e, i), this._unwindGroupTransformOnObject(e, r)
        },
        setViewportTransform: function(t) {
            this.renderOnAddRemove && this._activeObject && this._activeObject.isEditing && this._activeObject.clearContextTop(), fabric.StaticCanvas.prototype.setViewportTransform.call(this, t)
        }
    });
    for (var o in fabric.StaticCanvas) {
        "prototype" !== o && (fabric.Canvas[o] = fabric.StaticCanvas[o]);
    }
    fabric.isTouchSupported && (fabric.Canvas.prototype._setCursorFromEvent = function() {
    })
}();
!function() {
    function t(t, e) {
        return "which" in t ? t.which === e : t.button === e - 1
    }

    var e = {
        mt: 0,
        tr: 1,
        mr: 2,
        br: 3,
        mb: 4,
        bl: 5,
        ml: 6,
        tl: 7
    }, i = fabric.util.addListener, r = fabric.util.removeListener, n = 3, s = 2, o = 1, a = {passive: !1};
    fabric.util.object.extend(fabric.Canvas.prototype, {
        cursorMap: ["n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize", "nw-resize"],
        _initEventListeners: function() {
            this.removeListeners(), this._bindEvents(), this.addOrRemove(i, "add")
        },
        addOrRemove: function(t, e) {
            t(fabric.window, "resize", this._onResize), t(this.upperCanvasEl, "mousedown", this._onMouseDown), t(this.upperCanvasEl, "mousemove", this._onMouseMove, a), t(this.upperCanvasEl, "mouseout", this._onMouseOut), t(this.upperCanvasEl, "mouseenter", this._onMouseEnter), t(this.upperCanvasEl, "wheel", this._onMouseWheel), t(this.upperCanvasEl, "contextmenu", this._onContextMenu), t(this.upperCanvasEl, "dblclick", this._onDoubleClick), t(this.upperCanvasEl, "touchstart", this._onMouseDown, a), t(this.upperCanvasEl, "touchmove", this._onMouseMove, a), t(this.upperCanvasEl, "dragover", this._onDragOver), t(this.upperCanvasEl, "dragenter", this._onDragEnter), t(this.upperCanvasEl, "dragleave", this._onDragLeave), t(this.upperCanvasEl, "drop", this._onDrop), "undefined" != typeof eventjs && e in eventjs && (eventjs[e](this.upperCanvasEl, "gesture", this._onGesture), eventjs[e](this.upperCanvasEl, "drag", this._onDrag), eventjs[e](this.upperCanvasEl, "orientation", this._onOrientationChange), eventjs[e](this.upperCanvasEl, "shake", this._onShake), eventjs[e](this.upperCanvasEl, "longpress", this._onLongPress))
        },
        removeListeners: function() {
            this.addOrRemove(r, "remove"), r(fabric.document, "mouseup", this._onMouseUp), r(fabric.document, "touchend", this._onMouseUp, a), r(fabric.document, "mousemove", this._onMouseMove, a), r(fabric.document, "touchmove", this._onMouseMove, a)
        },
        _bindEvents: function() {
            this.eventsBound || (this._onMouseDown = this._onMouseDown.bind(this), this._onMouseMove = this._onMouseMove.bind(this), this._onMouseUp = this._onMouseUp.bind(this), this._onResize = this._onResize.bind(this), this._onGesture = this._onGesture.bind(this), this._onDrag = this._onDrag.bind(this), this._onShake = this._onShake.bind(this), this._onLongPress = this._onLongPress.bind(this), this._onOrientationChange = this._onOrientationChange.bind(this), this._onMouseWheel = this._onMouseWheel.bind(this), this._onMouseOut = this._onMouseOut.bind(this), this._onMouseEnter = this._onMouseEnter.bind(this), this._onContextMenu = this._onContextMenu.bind(this), this._onDoubleClick = this._onDoubleClick.bind(this), this._onDragOver = this._onDragOver.bind(this), this._onDragEnter = this._simpleEventHandler.bind(this, "dragenter"), this._onDragLeave = this._simpleEventHandler.bind(this, "dragleave"), this._onDrop = this._simpleEventHandler.bind(this, "drop"), this.eventsBound = !0)
        },
        _onGesture: function(t, e) {
            this.__onTransformGesture && this.__onTransformGesture(t, e)
        },
        _onDrag: function(t, e) {
            this.__onDrag && this.__onDrag(t, e)
        },
        _onMouseWheel: function(t) {
            this.__onMouseWheel(t)
        },
        _onMouseOut: function(t) {
            var e = this._hoveredTarget;
            this.fire("mouse:out", {
                target: e,
                e: t
            }), this._hoveredTarget = null, e && e.fire("mouseout", {e: t}), this._iTextInstances && this._iTextInstances.forEach(function(t) {
                t.isEditing && t.hiddenTextarea.focus()
            })
        },
        _onMouseEnter: function(t) {
            this.findTarget(t) || (this.fire("mouse:over", {
                target: null,
                e: t
            }), this._hoveredTarget = null)
        },
        _onOrientationChange: function(t, e) {
            this.__onOrientationChange && this.__onOrientationChange(t, e)
        },
        _onShake: function(t, e) {
            this.__onShake && this.__onShake(t, e)
        },
        _onLongPress: function(t, e) {
            this.__onLongPress && this.__onLongPress(t, e)
        },
        _onDragOver: function(t) {
            t.preventDefault();
            var e = this._simpleEventHandler("dragover", t);
            this._fireEnterLeaveEvents(e, t)
        },
        _onContextMenu: function(t) {
            return this.stopContextMenu && (t.stopPropagation(), t.preventDefault()), !1
        },
        _onDoubleClick: function(t) {
            this._cacheTransformEventData(t), this._handleEvent(t, "dblclick"), this._resetTransformEventData(t)
        },
        _onMouseDown: function(t) {
            this.__onMouseDown(t), this._resetTransformEventData(), i(fabric.document, "touchend", this._onMouseUp, a), i(fabric.document, "touchmove", this._onMouseMove, a), r(this.upperCanvasEl, "mousemove", this._onMouseMove, a), r(this.upperCanvasEl, "touchmove", this._onMouseMove, a), "touchstart" === t.type ? r(this.upperCanvasEl, "mousedown", this._onMouseDown) : (i(fabric.document, "mouseup", this._onMouseUp), i(fabric.document, "mousemove", this._onMouseMove, a))
        },
        _onMouseUp: function(t) {
            if (this.__onMouseUp(t), this._resetTransformEventData(), r(fabric.document, "mouseup", this._onMouseUp), r(fabric.document, "touchend", this._onMouseUp, a), r(fabric.document, "mousemove", this._onMouseMove, a), r(fabric.document, "touchmove", this._onMouseMove, a), i(this.upperCanvasEl, "mousemove", this._onMouseMove, a), i(this.upperCanvasEl, "touchmove", this._onMouseMove, a), "touchend" === t.type) {
                var e = this;
                setTimeout(function() {
                    i(e.upperCanvasEl, "mousedown", e._onMouseDown)
                }, 400)
            }
        },
        _onMouseMove: function(t) {
            !this.allowTouchScrolling && t.preventDefault && t.preventDefault(), this.__onMouseMove(t)
        },
        _onResize: function() {
            this.calcOffset()
        },
        _shouldRender: function(t) {
            var e = this._activeObject;
            return !!e != !!t || e && t && e !== t ? !0 : e && e.isEditing ? !1 : !1
        },
        __onMouseUp: function(e) {
            var i, r = this._currentTransform, a = this._groupSelector, c = !1, l = !a || 0 === a.left && 0 === a.top;
            return this._cacheTransformEventData(e), i = this._target, this._handleEvent(e, "up:before"), t(e, n) ? void (this.fireRightClick && this._handleEvent(e, "up", n, l)) : t(e, s) ? (this.fireMiddleClick && this._handleEvent(e, "up", s, l), void this._resetTransformEventData()) : this.isDrawingMode && this._isCurrentlyDrawing ? void this._onMouseUpInDrawingMode(e) : (r && (this._finalizeCurrentTransform(e), c = r.actionPerformed), l || (this._maybeGroupObjects(e), c || (c = this._shouldRender(i))), i && (i.isMoving = !1), this._setCursorFromEvent(e, i), this._handleEvent(e, "up", o, l), this._groupSelector = null, this._currentTransform = null, i && (i.__corner = 0), void (c ? this.requestRenderAll() : l || this.renderTop()))
        },
        _simpleEventHandler: function(t, e) {
            var i = this.findTarget(e), r = this.targets, n = {
                e: e,
                target: i,
                subTargets: r
            };
            if (this.fire(t, n), i && i.fire(t, n), !r) {
                return i;
            }
            for (var s = 0; s < r.length; s++) {
                r[s].fire(t, n);
            }
            return i
        },
        _handleEvent: function(t, e, i, r) {
            var n = this._target, s = this.targets || [], a = {
                e: t,
                target: n,
                subTargets: s,
                button: i || o,
                isClick: r || !1,
                pointer: this._pointer,
                absolutePointer: this._absolutePointer,
                transform: this._currentTransform
            };
            this.fire("mouse:" + e, a), n && n.fire("mouse" + e, a);
            for (var c = 0; c < s.length; c++) {
                s[c].fire("mouse" + e, a)
            }
        },
        _finalizeCurrentTransform: function(t) {
            var e, i = this._currentTransform, r = i.target, n = {
                e: t,
                target: r,
                transform: i
            };
            r._scaling && (r._scaling = !1), r.setCoords(), (i.actionPerformed || this.stateful && r.hasStateChanged()) && (i.actionPerformed && (e = this._addEventOptions(n, i), this._fire(e, n)), this._fire("modified", n))
        },
        _addEventOptions: function(t, e) {
            var i, r;
            switch (e.action) {
                case"scaleX":
                    i = "scaled", r = "x";
                    break;
                case"scaleY":
                    i = "scaled", r = "y";
                    break;
                case"skewX":
                    i = "skewed", r = "x";
                    break;
                case"skewY":
                    i = "skewed", r = "y";
                    break;
                case"scale":
                    i = "scaled", r = "equally";
                    break;
                case"rotate":
                    i = "rotated";
                    break;
                case"drag":
                    i = "moved"
            }
            return t.by = r, i
        },
        _onMouseDownInDrawingMode: function(t) {
            this._isCurrentlyDrawing = !0, this.getActiveObject() && this.discardActiveObject(t).requestRenderAll(), this.clipTo && fabric.util.clipContext(this, this.contextTop);
            var e = this.getPointer(t);
            this.freeDrawingBrush.onMouseDown(e), this._handleEvent(t, "down")
        },
        _onMouseMoveInDrawingMode: function(t) {
            if (this._isCurrentlyDrawing) {
                var e = this.getPointer(t);
                this.freeDrawingBrush.onMouseMove(e)
            }
            this.setCursor(this.freeDrawingCursor), this._handleEvent(t, "move")
        },
        _onMouseUpInDrawingMode: function(t) {
            this._isCurrentlyDrawing = !1, this.clipTo && this.contextTop.restore(), this.freeDrawingBrush.onMouseUp(), this._handleEvent(t, "up")
        },
        __onMouseDown: function(e) {
            this._cacheTransformEventData(e), this._handleEvent(e, "down:before");
            var i = this._target;
            if (t(e, n)) {
                return void (this.fireRightClick && this._handleEvent(e, "down", n));
            }
            if (t(e, s)) {
                return void (this.fireMiddleClick && this._handleEvent(e, "down", s));
            }
            if (this.isDrawingMode) {
                return void this._onMouseDownInDrawingMode(e);
            }
            if (!this._currentTransform) {
                var r = this._pointer;
                this._previousPointer = r;
                var o = this._shouldRender(i), a = this._shouldGroup(e, i);
                this._shouldClearSelection(e, i) ? this.discardActiveObject(e) : a && (this._handleGrouping(e, i), i = this._activeObject), !this.selection || i && (i.selectable || i.isEditing || i === this._activeObject) || (this._groupSelector = {
                    ex: r.x,
                    ey: r.y,
                    top: 0,
                    left: 0
                }), i && (i.selectable && this.setActiveObject(i, e), i !== this._activeObject || !i.__corner && a || this._setupCurrentTransform(e, i)), this._handleEvent(e, "down"), (o || a) && this.requestRenderAll()
            }
        },
        _resetTransformEventData: function() {
            this._target = null, this._pointer = null, this._absolutePointer = null
        },
        _cacheTransformEventData: function(t) {
            this._resetTransformEventData(), this._pointer = this.getPointer(t, !0), this._absolutePointer = this.restorePointerVpt(this._pointer), this._target = this._currentTransform ? this._currentTransform.target : this.findTarget(t) || null
        },
        _beforeTransform: function(t) {
            var e = this._currentTransform;
            this.stateful && e.target.saveState(), this.fire("before:transform", {
                e: t,
                transform: e
            }), e.corner && this.onBeforeScaleRotate(e.target)
        },
        __onMouseMove: function(t) {
            this._handleEvent(t, "move:before"), this._cacheTransformEventData(t);
            var e, i;
            if (this.isDrawingMode) {
                return void this._onMouseMoveInDrawingMode(t);
            }
            if (!("undefined" != typeof t.touches && t.touches.length > 1)) {
                var r = this._groupSelector;
                r ? (i = this._pointer, r.left = i.x - r.ex, r.top = i.y - r.ey, this.renderTop()) : this._currentTransform ? this._transformObject(t) : (e = this.findTarget(t) || null, this._setCursorFromEvent(t, e), this._fireOverOutEvents(e, t)), this._handleEvent(t, "move"), this._resetTransformEventData()
            }
        },
        _fireOverOutEvents: function(t, e) {
            this.fireSynteticInOutEvents(t, e, {
                targetName: "_hoveredTarget",
                canvasEvtOut: "mouse:out",
                evtOut: "mouseout",
                canvasEvtIn: "mouse:over",
                evtIn: "mouseover"
            })
        },
        _fireEnterLeaveEvents: function(t, e) {
            this.fireSynteticInOutEvents(t, e, {
                targetName: "_draggedoverTarget",
                evtOut: "dragleave",
                evtIn: "dragenter"
            })
        },
        fireSynteticInOutEvents: function(t, e, i) {
            var r, n, s, o, a = this[i.targetName], c = a !== t, l = i.canvasEvtIn, h = i.canvasEvtOut;
            c && (r = {
                e: e,
                target: t,
                previousTarget: a
            }, n = {
                e: e,
                target: a,
                nextTarget: t
            }, this[i.targetName] = t), o = t && c, s = a && c, s && (h && this.fire(h, n), a.fire(i.evtOut, n)), o && (l && this.fire(l, r), t.fire(i.evtIn, r))
        },
        __onMouseWheel: function(t) {
            this._cacheTransformEventData(t), this._handleEvent(t, "wheel"), this._resetTransformEventData()
        },
        _transformObject: function(t) {
            var e = this.getPointer(t), i = this._currentTransform;
            i.reset = !1, i.target.isMoving = !0, i.shiftKey = t.shiftKey, i.altKey = t[this.centeredKey], this._beforeScaleTransform(t, i), this._performTransformAction(t, i, e), i.actionPerformed && this.requestRenderAll()
        },
        _performTransformAction: function(t, e, i) {
            var r = i.x, n = i.y, s = e.action, o = !1, a = {
                target: e.target,
                e: t,
                transform: e,
                pointer: i
            };
            "rotate" === s ? (o = this._rotateObject(r, n)) && this._fire("rotating", a) : "scale" === s ? (o = this._onScale(t, e, r, n)) && this._fire("scaling", a) : "scaleX" === s ? (o = this._scaleObject(r, n, "x")) && this._fire("scaling", a) : "scaleY" === s ? (o = this._scaleObject(r, n, "y")) && this._fire("scaling", a) : "skewX" === s ? (o = this._skewObject(r, n, "x")) && this._fire("skewing", a) : "skewY" === s ? (o = this._skewObject(r, n, "y")) && this._fire("skewing", a) : (o = this._translateObject(r, n), o && (this._fire("moving", a), this.setCursor(a.target.moveCursor || this.moveCursor))), e.actionPerformed = e.actionPerformed || o
        },
        _fire: function(t, e) {
            this.fire("object:" + t, e), e.target.fire(t, e)
        },
        _beforeScaleTransform: function(t, e) {
            if ("scale" === e.action || "scaleX" === e.action || "scaleY" === e.action) {
                var i = this._shouldCenterTransform(e.target);
                (i && ("center" !== e.originX || "center" !== e.originY) || !i && "center" === e.originX && "center" === e.originY) && (this._resetCurrentTransform(), e.reset = !0)
            }
        },
        _onScale: function(t, e, i, r) {
            return this._isUniscalePossible(t, e.target) ? (e.currentAction = "scale", this._scaleObject(i, r)) : (e.reset || "scale" !== e.currentAction || this._resetCurrentTransform(), e.currentAction = "scaleEqually", this._scaleObject(i, r, "equally"))
        },
        _isUniscalePossible: function(t, e) {
            return (t[this.uniScaleKey] || this.uniScaleTransform) && !e.get("lockUniScaling")
        },
        _setCursorFromEvent: function(t, e) {
            if (!e) {
                return this.setCursor(this.defaultCursor), !1;
            }
            var i = e.hoverCursor || this.hoverCursor,
                r = this._activeObject && "activeSelection" === this._activeObject.type ? this._activeObject : null,
                n = (!r || !r.contains(e)) && e._findTargetCorner(this.getPointer(t, !0));
            this.setCursor(n ? this.getCornerCursor(n, e, t) : i)
        },
        getCornerCursor: function(t, i, r) {
            return this.actionIsDisabled(t, i, r) ? this.notAllowedCursor : t in e ? this._getRotatedCornerCursor(t, i, r) : "mtr" === t && i.hasRotatingPoint ? this.rotationCursor : this.defaultCursor
        },
        actionIsDisabled: function(t, e, i) {
            return "mt" === t || "mb" === t ? i[this.altActionKey] ? e.lockSkewingX : e.lockScalingY : "ml" === t || "mr" === t ? i[this.altActionKey] ? e.lockSkewingY : e.lockScalingX : "mtr" === t ? e.lockRotation : this._isUniscalePossible(i, e) ? e.lockScalingX && e.lockScalingY : e.lockScalingX || e.lockScalingY
        },
        _getRotatedCornerCursor: function(t, i, r) {
            var n = Math.round(i.angle % 360 / 45);
            return 0 > n && (n += 8), n += e[t], r[this.altActionKey] && e[t] % 2 === 0 && (n += 2), n %= 8, this.cursorMap[n]
        }
    })
}();
!function() {
    var t = Math.min, e = Math.max;
    fabric.util.object.extend(fabric.Canvas.prototype, {
        _shouldGroup: function(t, e) {
            var i = this._activeObject;
            return i && this._isSelectionKeyPressed(t) && e && e.selectable && this.selection && (i !== e || "activeSelection" === i.type)
        },
        _handleGrouping: function(t, e) {
            var i = this._activeObject;
            i.__corner || (e !== i || (e = this.findTarget(t, !0))) && (i && "activeSelection" === i.type ? this._updateActiveSelection(e, t) : this._createActiveSelection(e, t))
        },
        _updateActiveSelection: function(t, e) {
            var i = this._activeObject, r = i._objects.slice(0);
            i.contains(t) ? (i.removeWithUpdate(t), this._hoveredTarget = t, 1 === i.size() && this._setActiveObject(i.item(0), e)) : (i.addWithUpdate(t), this._hoveredTarget = i), this._fireSelectionEvents(r, e)
        },
        _createActiveSelection: function(t, e) {
            var i = this.getActiveObjects(), r = this._createGroup(t);
            this._hoveredTarget = r, this._setActiveObject(r, e), this._fireSelectionEvents(i, e)
        },
        _createGroup: function(t) {
            var e = this._objects, i = e.indexOf(this._activeObject) < e.indexOf(t),
                r = i ? [this._activeObject, t] : [t, this._activeObject];
            return this._activeObject.isEditing && this._activeObject.exitEditing(), new fabric.ActiveSelection(r, {canvas: this})
        },
        _groupSelectedObjects: function(t) {
            var e, i = this._collectObjects();
            1 === i.length ? this.setActiveObject(i[0], t) : i.length > 1 && (e = new fabric.ActiveSelection(i.reverse(), {canvas: this}), this.setActiveObject(e, t))
        },
        _collectObjects: function() {
            for (var i, r = [], n = this._groupSelector.ex, s = this._groupSelector.ey, o = n + this._groupSelector.left, a = s + this._groupSelector.top, c = new fabric.Point(t(n, o), t(s, a)), l = new fabric.Point(e(n, o), e(s, a)), h = !this.selectionFullyContained, u = n === o && s === a, f = this._objects.length; f-- && (i = this._objects[f], !(i && i.selectable && i.visible && (h && i.intersectsWithRect(c, l) || i.isContainedWithinRect(c, l) || h && i.containsPoint(c) || h && i.containsPoint(l)) && (r.push(i), u)));) {
                ;
            }
            return r
        },
        _maybeGroupObjects: function(t) {
            this.selection && this._groupSelector && this._groupSelectedObjects(t), this.setCursor(this.defaultCursor), this._groupSelector = null
        }
    })
}();
!function() {
    var t = fabric.StaticCanvas.supports("toDataURLWithQuality");
    fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        toDataURL: function(t) {
            t || (t = {});
            var e = t.format || "png", i = t.quality || 1,
                r = (t.multiplier || 1) * (t.enableRetinaScaling ? 1 : 1 / this.getRetinaScaling()), n = {
                    left: t.left || 0,
                    top: t.top || 0,
                    width: t.width || 0,
                    height: t.height || 0
                };
            return this.__toDataURLWithMultiplier(e, i, n, r)
        },
        __toDataURLWithMultiplier: function(t, e, i, r) {
            var n = this.width, s = this.height, o = (i.width || this.width) * r, a = (i.height || this.height) * r,
                c = this.getZoom(), l = c * r, h = this.viewportTransform, u = (h[4] - i.left) * r,
                f = (h[5] - i.top) * r, d = [l, 0, 0, l, u, f], p = this.interactive, g = this.skipOffscreen,
                v = n !== o || s !== a;
            this.viewportTransform = d, this.skipOffscreen = !1, this.interactive = !1, v && this.setDimensions({
                width: o,
                height: a
            }, {backstoreOnly: !0}), this.renderAll();
            var b = this.__toDataURL(t, e, i);
            return this.interactive = p, this.skipOffscreen = g, this.viewportTransform = h, v && this.setDimensions({
                width: n,
                height: s
            }, {backstoreOnly: !0}), this.renderAll(), b
        },
        __toDataURL: function(e, i) {
            var r = this.contextContainer.canvas, n = t ? r.toDataURL("image/" + e, i) : r.toDataURL("image/" + e);
            return n
        }
    })
}();
fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    loadFromDatalessJSON: function(t, e, i) {
        return this.loadFromJSON(t, e, i)
    },
    loadFromJSON: function(t, e, i) {
        if (t) {
            var r = "string" == typeof t ? JSON.parse(t) : fabric.util.object.clone(t), n = this,
                s = this.renderOnAddRemove;
            return this.renderOnAddRemove = !1, this._enlivenObjects(r.objects, function(t) {
                n.clear(), n._setBgOverlay(r, function() {
                    t.forEach(function(t, e) {
                        n.insertAt(t, e)
                    }), n.renderOnAddRemove = s, delete r.objects, delete r.backgroundImage, delete r.overlayImage, delete r.background, delete r.overlay, n._setOptions(r), n.renderAll(), e && e()
                })
            }, i), this
        }
    },
    _setBgOverlay: function(t, e) {
        var i = {
            backgroundColor: !1,
            overlayColor: !1,
            backgroundImage: !1,
            overlayImage: !1
        };
        if (!(t.backgroundImage || t.overlayImage || t.background || t.overlay)) {
            return void (e && e());
        }
        var r = function() {
            i.backgroundImage && i.overlayImage && i.backgroundColor && i.overlayColor && e && e()
        };
        this.__setBgOverlay("backgroundImage", t.backgroundImage, i, r), this.__setBgOverlay("overlayImage", t.overlayImage, i, r), this.__setBgOverlay("backgroundColor", t.background, i, r), this.__setBgOverlay("overlayColor", t.overlay, i, r)
    },
    __setBgOverlay: function(t, e, i, r) {
        var n = this;
        return e ? void ("backgroundImage" === t || "overlayImage" === t ? fabric.util.enlivenObjects([e], function(e) {
            n[t] = e[0], i[t] = !0, r && r()
        }) : this["set" + fabric.util.string.capitalize(t, !0)](e, function() {
            i[t] = !0, r && r()
        })) : (i[t] = !0, void (r && r()))
    },
    _enlivenObjects: function(t, e, i) {
        return t && 0 !== t.length ? void fabric.util.enlivenObjects(t, function(t) {
            e && e(t)
        }, null, i) : void (e && e([]))
    },
    _toDataURL: function(t, e) {
        this.clone(function(i) {
            e(i.toDataURL(t))
        })
    },
    _toDataURLWithMultiplier: function(t, e, i) {
        this.clone(function(r) {
            i(r.toDataURLWithMultiplier(t, e))
        })
    },
    clone: function(t, e) {
        var i = JSON.stringify(this.toJSON(e));
        this.cloneWithoutData(function(e) {
            e.loadFromJSON(i, function() {
                t && t(e)
            })
        })
    },
    cloneWithoutData: function(t) {
        var e = fabric.util.createCanvasElement();
        e.width = this.width, e.height = this.height;
        var i = new fabric.Canvas(e);
        i.clipTo = this.clipTo, this.backgroundImage ? (i.setBackgroundImage(this.backgroundImage.src, function() {
            i.renderAll(), t && t(i)
        }), i.backgroundImageOpacity = this.backgroundImageOpacity, i.backgroundImageStretch = this.backgroundImageStretch) : t && t(i)
    }
});
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.object.extend, r = e.util.object.clone, n = e.util.toFixed,
        s = e.util.string.capitalize, o = e.util.degreesToRadians, a = e.StaticCanvas.supports("setLineDash"),
        c = !e.isLikelyNode, h = 2;
    e.Object || (e.Object = e.util.createClass(e.CommonMethods, {
        type: "object",
        originX: "left",
        originY: "top",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        scaleX: 1,
        scaleY: 1,
        flipX: !1,
        flipY: !1,
        opacity: 1,
        angle: 0,
        skewX: 0,
        skewY: 0,
        cornerSize: 13,
        transparentCorners: !0,
        hoverCursor: null,
        moveCursor: null,
        padding: 0,
        borderColor: "rgba(102,153,255,0.75)",
        borderDashArray: null,
        cornerColor: "rgba(102,153,255,0.5)",
        cornerStrokeColor: null,
        cornerStyle: "rect",
        cornerDashArray: null,
        centeredScaling: !1,
        centeredRotation: !0,
        fill: "rgb(0,0,0)",
        fillRule: "nonzero",
        globalCompositeOperation: "source-over",
        backgroundColor: "",
        selectionBackgroundColor: "",
        stroke: null,
        strokeWidth: 1,
        strokeDashArray: null,
        strokeLineCap: "butt",
        strokeLineJoin: "miter",
        strokeMiterLimit: 4,
        shadow: null,
        borderOpacityWhenMoving: .4,
        borderScaleFactor: 1,
        transformMatrix: null,
        minScaleLimit: 0,
        selectable: !0,
        evented: !0,
        visible: !0,
        hasControls: !0,
        hasBorders: !0,
        hasRotatingPoint: !0,
        rotatingPointOffset: 40,
        perPixelTargetFind: !1,
        includeDefaultValues: !0,
        clipTo: null,
        lockMovementX: !1,
        lockMovementY: !1,
        lockRotation: !1,
        lockScalingX: !1,
        lockScalingY: !1,
        lockUniScaling: !1,
        lockSkewingX: !1,
        lockSkewingY: !1,
        lockScalingFlip: !1,
        excludeFromExport: !1,
        objectCaching: c,
        statefullCache: !1,
        noScaleCache: !0,
        dirty: !0,
        __corner: 0,
        paintFirst: "fill",
        stateProperties: "top left width height scaleX scaleY flipX flipY originX originY transformMatrix stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin strokeMiterLimit angle opacity fill globalCompositeOperation shadow clipTo visible backgroundColor skewX skewY fillRule paintFirst".split(" "),
        cacheProperties: "fill stroke strokeWidth strokeDashArray width height paintFirst strokeLineCap strokeLineJoin strokeMiterLimit backgroundColor".split(" "),
        clipPath: void 0,
        inverted: !1,
        absolutePositioned: !1,
        initialize: function(t) {
            t && this.setOptions(t)
        },
        _createCacheCanvas: function() {
            this._cacheProperties = {}, this._cacheCanvas = e.util.createCanvasElement(), this._cacheContext = this._cacheCanvas.getContext("2d"), this._updateCacheCanvas(), this.dirty = !0
        },
        _limitCacheSize: function(t) {
            var i = e.perfLimitSizeTotal, r = t.width, n = t.height, s = e.maxCacheSideLimit, o = e.minCacheSideLimit;
            if (s >= r && s >= n && i >= r * n) {
                return o > r && (t.width = o), o > n && (t.height = o), t;
            }
            var a = r / n, c = e.util.limitDimsByArea(a, i), h = e.util.capValue, l = h(o, c.x, s), u = h(o, c.y, s);
            return r > l && (t.zoomX /= r / l, t.width = l, t.capped = !0), n > u && (t.zoomY /= n / u, t.height = u, t.capped = !0), t
        },
        _getCacheCanvasDimensions: function() {
            var t = this.getTotalObjectScaling(), e = this._getNonTransformedDimensions(), i = t.scaleX, r = t.scaleY,
                n = e.x * i, s = e.y * r;
            return {
                width: n + h,
                height: s + h,
                zoomX: i,
                zoomY: r,
                x: e.x,
                y: e.y
            }
        },
        _updateCacheCanvas: function() {
            var t = this.canvas;
            if (this.noScaleCache && t && t._currentTransform) {
                var i = t._currentTransform.target, r = t._currentTransform.action;
                if (this === i && r.slice && "scale" === r.slice(0, 5)) {
                    return !1
                }
            }
            var n, s, o = this._cacheCanvas, a = this._limitCacheSize(this._getCacheCanvasDimensions()),
                c = e.minCacheSideLimit, h = a.width, l = a.height, u = a.zoomX, f = a.zoomY,
                d = h !== this.cacheWidth || l !== this.cacheHeight, p = this.zoomX !== u || this.zoomY !== f,
                g = d || p, v = 0, b = 0, m = !1;
            if (d) {
                var y = this._cacheCanvas.width, _ = this._cacheCanvas.height, w = h > y || l > _,
                    C = (.9 * y > h || .9 * _ > l) && y > c && _ > c;
                m = w || C, w && !a.capped && (h > c || l > c) && (v = .1 * h, b = .1 * l)
            }
            return g ? (m ? (o.width = Math.ceil(h + v), o.height = Math.ceil(l + b)) : (this._cacheContext.setTransform(1, 0, 0, 1, 0, 0), this._cacheContext.clearRect(0, 0, o.width, o.height)), n = a.x * u / 2, s = a.y * f / 2, this.cacheTranslationX = Math.round(o.width / 2 - n) + n, this.cacheTranslationY = Math.round(o.height / 2 - s) + s, this.cacheWidth = h, this.cacheHeight = l, this._cacheContext.translate(this.cacheTranslationX, this.cacheTranslationY), this._cacheContext.scale(u, f), this.zoomX = u, this.zoomY = f, !0) : !1
        },
        setOptions: function(t) {
            this._setOptions(t), this._initGradient(t.fill, "fill"), this._initGradient(t.stroke, "stroke"), this._initClipping(t), this._initPattern(t.fill, "fill"), this._initPattern(t.stroke, "stroke")
        },
        transform: function(t) {
            var e;
            e = this.group && !this.group._transformDone ? this.calcTransformMatrix() : this.calcOwnMatrix(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5])
        },
        toObject: function(t) {
            var i = e.Object.NUM_FRACTION_DIGITS, r = {
                type: this.type,
                version: e.version,
                originX: this.originX,
                originY: this.originY,
                left: n(this.left, i),
                top: n(this.top, i),
                width: n(this.width, i),
                height: n(this.height, i),
                fill: this.fill && this.fill.toObject ? this.fill.toObject() : this.fill,
                stroke: this.stroke && this.stroke.toObject ? this.stroke.toObject() : this.stroke,
                strokeWidth: n(this.strokeWidth, i),
                strokeDashArray: this.strokeDashArray ? this.strokeDashArray.concat() : this.strokeDashArray,
                strokeLineCap: this.strokeLineCap,
                strokeLineJoin: this.strokeLineJoin,
                strokeMiterLimit: n(this.strokeMiterLimit, i),
                scaleX: n(this.scaleX, i),
                scaleY: n(this.scaleY, i),
                angle: n(this.angle, i),
                flipX: this.flipX,
                flipY: this.flipY,
                opacity: n(this.opacity, i),
                shadow: this.shadow && this.shadow.toObject ? this.shadow.toObject() : this.shadow,
                visible: this.visible,
                clipTo: this.clipTo && String(this.clipTo),
                backgroundColor: this.backgroundColor,
                fillRule: this.fillRule,
                paintFirst: this.paintFirst,
                globalCompositeOperation: this.globalCompositeOperation,
                transformMatrix: this.transformMatrix ? this.transformMatrix.concat() : null,
                skewX: n(this.skewX, i),
                skewY: n(this.skewY, i)
            };
            return this.clipPath && (r.clipPath = this.clipPath.toObject(t), r.clipPath.inverted = this.clipPath.inverted, r.clipPath.absolutePositioned = this.clipPath.absolutePositioned), e.util.populateWithProperties(this, r, t), this.includeDefaultValues || (r = this._removeDefaultValues(r)), r
        },
        toDatalessObject: function(t) {
            return this.toObject(t)
        },
        _removeDefaultValues: function(t) {
            var i = e.util.getKlass(t.type).prototype, r = i.stateProperties;
            return r.forEach(function(e) {
                t[e] === i[e] && delete t[e];
                var r = "[object Array]" === Object.prototype.toString.call(t[e]) && "[object Array]" === Object.prototype.toString.call(i[e]);
                r && 0 === t[e].length && 0 === i[e].length && delete t[e]
            }), t
        },
        toString: function() {
            return "#<fabric." + s(this.type) + ">"
        },
        getObjectScaling: function() {
            var t = this.scaleX, e = this.scaleY;
            if (this.group) {
                var i = this.group.getObjectScaling();
                t *= i.scaleX, e *= i.scaleY
            }
            return {
                scaleX: t,
                scaleY: e
            }
        },
        getTotalObjectScaling: function() {
            var t = this.getObjectScaling(), e = t.scaleX, i = t.scaleY;
            if (this.canvas) {
                var r = this.canvas.getZoom(), n = this.canvas.getRetinaScaling();
                e *= r * n, i *= r * n
            }
            return {
                scaleX: e,
                scaleY: i
            }
        },
        getObjectOpacity: function() {
            var t = this.opacity;
            return this.group && (t *= this.group.getObjectOpacity()), t
        },
        _set: function(t, i) {
            var r = "scaleX" === t || "scaleY" === t, n = this[t] !== i, s = !1;
            return r && (i = this._constrainScale(i)), "scaleX" === t && 0 > i ? (this.flipX = !this.flipX, i *= -1) : "scaleY" === t && 0 > i ? (this.flipY = !this.flipY, i *= -1) : "shadow" !== t || !i || i instanceof e.Shadow ? "dirty" === t && this.group && this.group.set("dirty", i) : i = new e.Shadow(i), this[t] = i, n && (s = this.group && this.group.isOnACache(), this.cacheProperties.indexOf(t) > -1 ? (this.dirty = !0, s && this.group.set("dirty", !0)) : s && this.stateProperties.indexOf(t) > -1 && this.group.set("dirty", !0)), this
        },
        setOnGroup: function() {
        },
        getViewportTransform: function() {
            return this.canvas && this.canvas.viewportTransform ? this.canvas.viewportTransform : e.iMatrix.concat()
        },
        isNotVisible: function() {
            return 0 === this.opacity || 0 === this.width && 0 === this.height || !this.visible
        },
        render: function(t) {
            this.isNotVisible() || (!this.canvas || !this.canvas.skipOffscreen || this.group || this.isOnScreen()) && (t.save(), this._setupCompositeOperation(t), this.drawSelectionBackground(t), this.transform(t), this._setOpacity(t), this._setShadow(t, this), this.transformMatrix && t.transform.apply(t, this.transformMatrix), this.clipTo && e.util.clipContext(this, t), this.shouldCache() ? (this.renderCache(), this.drawCacheOnCanvas(t)) : (this._removeCacheCanvas(), this.dirty = !1, this.drawObject(t), this.objectCaching && this.statefullCache && this.saveState({propertySet: "cacheProperties"})), this.clipTo && t.restore(), t.restore())
        },
        renderCache: function(t) {
            t = t || {}, this._cacheCanvas || this._createCacheCanvas(), this.isCacheDirty() && (this.statefullCache && this.saveState({propertySet: "cacheProperties"}), this.drawObject(this._cacheContext, t.forClipping), this.dirty = !1)
        },
        _removeCacheCanvas: function() {
            this._cacheCanvas = null, this.cacheWidth = 0, this.cacheHeight = 0
        },
        needsItsOwnCache: function() {
            return "stroke" === this.paintFirst && "object" == typeof this.shadow ? !0 : this.clipPath ? !0 : !1
        },
        shouldCache: function() {
            return this.ownCaching = this.objectCaching && (!this.group || this.needsItsOwnCache() || !this.group.isOnACache()), this.ownCaching
        },
        willDrawShadow: function() {
            return !!this.shadow && (0 !== this.shadow.offsetX || 0 !== this.shadow.offsetY)
        },
        drawClipPathOnCache: function(t) {
            var i = this.clipPath;
            if (t.save(), t.globalCompositeOperation = i.inverted ? "destination-out" : "destination-in", i.absolutePositioned) {
                var r = e.util.invertTransform(this.calcTransformMatrix());
                t.transform(r[0], r[1], r[2], r[3], r[4], r[5])
            }
            i.transform(t), t.scale(1 / i.zoomX, 1 / i.zoomY), t.drawImage(i._cacheCanvas, -i.cacheTranslationX, -i.cacheTranslationY), t.restore()
        },
        drawObject: function(t, e) {
            e ? this._setClippingProperties(t) : (this._renderBackground(t), this._setStrokeStyles(t, this), this._setFillStyles(t, this)), this._render(t), this._drawClipPath(t)
        },
        _drawClipPath: function(t) {
            var e = this.clipPath;
            e && (e.canvas = this.canvas, e.shouldCache(), e._transformDone = !0, e.renderCache({forClipping: !0}), this.drawClipPathOnCache(t))
        },
        drawCacheOnCanvas: function(t) {
            t.scale(1 / this.zoomX, 1 / this.zoomY), t.drawImage(this._cacheCanvas, -this.cacheTranslationX, -this.cacheTranslationY)
        },
        isCacheDirty: function(t) {
            if (this.isNotVisible()) {
                return !1;
            }
            if (this._cacheCanvas && !t && this._updateCacheCanvas()) {
                return !0;
            }
            if (this.dirty || this.clipPath && this.clipPath.absolutePositioned || this.statefullCache && this.hasStateChanged("cacheProperties")) {
                if (this._cacheCanvas && !t) {
                    var e = this.cacheWidth / this.zoomX, i = this.cacheHeight / this.zoomY;
                    this._cacheContext.clearRect(-e / 2, -i / 2, e, i)
                }
                return !0
            }
            return !1
        },
        _renderBackground: function(t) {
            if (this.backgroundColor) {
                var e = this._getNonTransformedDimensions();
                t.fillStyle = this.backgroundColor, t.fillRect(-e.x / 2, -e.y / 2, e.x, e.y), this._removeShadow(t)
            }
        },
        _setOpacity: function(t) {
            this.group && !this.group._transformDone ? t.globalAlpha = this.getObjectOpacity() : t.globalAlpha *= this.opacity
        },
        _setStrokeStyles: function(t, e) {
            e.stroke && (t.lineWidth = e.strokeWidth, t.lineCap = e.strokeLineCap, t.lineJoin = e.strokeLineJoin, t.miterLimit = e.strokeMiterLimit, t.strokeStyle = e.stroke.toLive ? e.stroke.toLive(t, this) : e.stroke)
        },
        _setFillStyles: function(t, e) {
            e.fill && (t.fillStyle = e.fill.toLive ? e.fill.toLive(t, this) : e.fill)
        },
        _setClippingProperties: function(t) {
            t.globalAlpha = 1, t.strokeStyle = "transparent", t.fillStyle = "#000000"
        },
        _setLineDash: function(t, e, i) {
            e && (1 & e.length && e.push.apply(e, e), a ? t.setLineDash(e) : i && i(t))
        },
        _renderControls: function(t, i) {
            var r, n, s, a = this.getViewportTransform(), c = this.calcTransformMatrix();
            i = i || {}, n = "undefined" != typeof i.hasBorders ? i.hasBorders : this.hasBorders, s = "undefined" != typeof i.hasControls ? i.hasControls : this.hasControls, c = e.util.multiplyTransformMatrices(a, c), r = e.util.qrDecompose(c), t.save(), t.translate(r.translateX, r.translateY), t.lineWidth = 1 * this.borderScaleFactor, this.group || (t.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1), i.forActiveSelection ? (t.rotate(o(r.angle)), n && this.drawBordersInGroup(t, r, i)) : (t.rotate(o(this.angle)), n && this.drawBorders(t, i)), s && this.drawControls(t, i), t.restore()
        },
        _setShadow: function(t) {
            if (this.shadow) {
                var i = this.canvas && this.canvas.viewportTransform[0] || 1,
                    r = this.canvas && this.canvas.viewportTransform[3] || 1, n = this.getObjectScaling();
                this.canvas && this.canvas._isRetinaScaling() && (i *= e.devicePixelRatio, r *= e.devicePixelRatio), t.shadowColor = this.shadow.color, t.shadowBlur = this.shadow.blur * e.browserShadowBlurConstant * (i + r) * (n.scaleX + n.scaleY) / 4, t.shadowOffsetX = this.shadow.offsetX * i * n.scaleX, t.shadowOffsetY = this.shadow.offsetY * r * n.scaleY
            }
        },
        _removeShadow: function(t) {
            this.shadow && (t.shadowColor = "", t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0)
        },
        _applyPatternGradientTransform: function(t, e) {
            if (!e || !e.toLive) {
                return {
                    offsetX: 0,
                    offsetY: 0
                };
            }
            var i = e.gradientTransform || e.patternTransform, r = -this.width / 2 + e.offsetX || 0,
                n = -this.height / 2 + e.offsetY || 0;
            return t.translate(r, n), i && t.transform(i[0], i[1], i[2], i[3], i[4], i[5]), {
                offsetX: r,
                offsetY: n
            }
        },
        _renderPaintInOrder: function(t) {
            "stroke" === this.paintFirst ? (this._renderStroke(t), this._renderFill(t)) : (this._renderFill(t), this._renderStroke(t))
        },
        _renderFill: function(t) {
            this.fill && (t.save(), this._applyPatternGradientTransform(t, this.fill), "evenodd" === this.fillRule ? t.fill("evenodd") : t.fill(), t.restore())
        },
        _renderStroke: function(t) {
            this.stroke && 0 !== this.strokeWidth && (this.shadow && !this.shadow.affectStroke && this._removeShadow(t), t.save(), this._setLineDash(t, this.strokeDashArray, this._renderDashedStroke), this._applyPatternGradientTransform(t, this.stroke), t.stroke(), t.restore())
        },
        _findCenterFromElement: function() {
            return {
                x: this.left + this.width / 2,
                y: this.top + this.height / 2
            }
        },
        _assignTransformMatrixProps: function() {
            if (this.transformMatrix) {
                var t = e.util.qrDecompose(this.transformMatrix);
                this.flipX = !1, this.flipY = !1, this.set("scaleX", t.scaleX), this.set("scaleY", t.scaleY), this.angle = t.angle, this.skewX = t.skewX, this.skewY = 0
            }
        },
        _removeTransformMatrix: function(t) {
            var i = this._findCenterFromElement();
            this.transformMatrix && (this._assignTransformMatrixProps(), i = e.util.transformPoint(i, this.transformMatrix)), this.transformMatrix = null, t && (this.scaleX *= t.scaleX, this.scaleY *= t.scaleY, this.cropX = t.cropX, this.cropY = t.cropY, i.x += t.offsetLeft, i.y += t.offsetTop, this.width = t.width, this.height = t.height), this.setPositionByOrigin(i, "center", "center")
        },
        clone: function(t, i) {
            var r = this.toObject(i);
            this.constructor.fromObject ? this.constructor.fromObject(r, t) : e.Object._fromObject("Object", r, t)
        },
        cloneAsImage: function(t, i) {
            var r = this.toDataURL(i);
            return e.util.loadImage(r, function(i) {
                t && t(new e.Image(i))
            }), this
        },
        toDataURL: function(t) {
            t || (t = {});
            var i = e.util, r = i.saveObjectTransform(this), n = this.shadow, s = Math.abs;
            t.withoutTransform && i.resetObjectTransform(this), t.withoutShadow && (this.shadow = null);
            var o, a, c = e.util.createCanvasElement(), h = this.getBoundingRect(!0, !0), l = this.shadow, u = {
                x: 0,
                y: 0
            };
            l && (a = l.blur, o = this.getObjectScaling(), u.x = 2 * Math.round((s(l.offsetX) + a) * s(o.scaleX)), u.y = 2 * Math.round((s(l.offsetY) + a) * s(o.scaleY))), c.width = h.width + u.x, c.height = h.height + u.y, c.width += c.width % 2 ? 2 - c.width % 2 : 0, c.height += c.height % 2 ? 2 - c.height % 2 : 0;
            var f = new e.StaticCanvas(c, {
                enableRetinaScaling: t.enableRetinaScaling,
                renderOnAddRemove: !1,
                skipOffscreen: !1
            });
            "jpeg" === t.format && (f.backgroundColor = "#fff"), this.setPositionByOrigin(new e.Point(f.width / 2, f.height / 2), "center", "center");
            var d = this.canvas;
            f.add(this);
            var p = f.toDataURL(t);
            return this.shadow = n, this.set(r).setCoords(), this.canvas = d, f._objects = [], f.dispose(), f = null, p
        },
        isType: function(t) {
            return this.type === t
        },
        complexity: function() {
            return 1
        },
        toJSON: function(t) {
            return this.toObject(t)
        },
        setGradient: function(t, i) {
            i || (i = {});
            var r = {colorStops: []};
            return r.type = i.type || (i.r1 || i.r2 ? "radial" : "linear"), r.coords = {
                x1: i.x1,
                y1: i.y1,
                x2: i.x2,
                y2: i.y2
            }, (i.r1 || i.r2) && (r.coords.r1 = i.r1, r.coords.r2 = i.r2), r.gradientTransform = i.gradientTransform, e.Gradient.prototype.addColorStop.call(r, i.colorStops), this.set(t, e.Gradient.forObject(this, r))
        },
        setPatternFill: function(t, i) {
            return this.set("fill", new e.Pattern(t, i))
        },
        setShadow: function(t) {
            return this.set("shadow", t ? new e.Shadow(t) : null)
        },
        setColor: function(t) {
            return this.set("fill", t), this
        },
        rotate: function(t) {
            var e = ("center" !== this.originX || "center" !== this.originY) && this.centeredRotation;
            return e && this._setOriginToCenter(), this.set("angle", t), e && this._resetOrigin(), this
        },
        centerH: function() {
            return this.canvas && this.canvas.centerObjectH(this), this
        },
        viewportCenterH: function() {
            return this.canvas && this.canvas.viewportCenterObjectH(this), this
        },
        centerV: function() {
            return this.canvas && this.canvas.centerObjectV(this), this
        },
        viewportCenterV: function() {
            return this.canvas && this.canvas.viewportCenterObjectV(this), this
        },
        center: function() {
            return this.canvas && this.canvas.centerObject(this), this
        },
        viewportCenter: function() {
            return this.canvas && this.canvas.viewportCenterObject(this), this
        },
        getLocalPointer: function(t, i) {
            i = i || this.canvas.getPointer(t);
            var r = new e.Point(i.x, i.y), n = this._getLeftTopCoords();
            return this.angle && (r = e.util.rotatePoint(r, n, o(-this.angle))), {
                x: r.x - n.x,
                y: r.y - n.y
            }
        },
        _setupCompositeOperation: function(t) {
            this.globalCompositeOperation && (t.globalCompositeOperation = this.globalCompositeOperation)
        }
    }), e.util.createAccessors && e.util.createAccessors(e.Object), i(e.Object.prototype, e.Observable), e.Object.NUM_FRACTION_DIGITS = 2, e.Object._fromObject = function(t, i, n, s) {
        var o = e[t];
        i = r(i, !0), e.util.enlivenPatterns([i.fill, i.stroke], function(t) {
            "undefined" != typeof t[0] && (i.fill = t[0]), "undefined" != typeof t[1] && (i.stroke = t[1]), e.util.enlivenObjects([i.clipPath], function(t) {
                i.clipPath = t[0];
                var e = s ? new o(i[s], i) : new o(i);
                n && n(e)
            })
        })
    }, e.Object.__uid = 0)
}("undefined" != typeof exports ? exports : this);
!function() {
    var t = fabric.util.degreesToRadians, e = {
        left: -.5,
        center: 0,
        right: .5
    }, i = {
        top: -.5,
        center: 0,
        bottom: .5
    };
    fabric.util.object.extend(fabric.Object.prototype, {
        translateToGivenOrigin: function(t, r, n, s, o) {
            var a, c, h, l = t.x, u = t.y;
            return "string" == typeof r ? r = e[r] : r -= .5, "string" == typeof s ? s = e[s] : s -= .5, a = s - r, "string" == typeof n ? n = i[n] : n -= .5, "string" == typeof o ? o = i[o] : o -= .5, c = o - n, (a || c) && (h = this._getTransformedDimensions(), l = t.x + a * h.x, u = t.y + c * h.y), new fabric.Point(l, u)
        },
        translateToCenterPoint: function(e, i, r) {
            var n = this.translateToGivenOrigin(e, i, r, "center", "center");
            return this.angle ? fabric.util.rotatePoint(n, e, t(this.angle)) : n
        },
        translateToOriginPoint: function(e, i, r) {
            var n = this.translateToGivenOrigin(e, "center", "center", i, r);
            return this.angle ? fabric.util.rotatePoint(n, e, t(this.angle)) : n
        },
        getCenterPoint: function() {
            var t = new fabric.Point(this.left, this.top);
            return this.translateToCenterPoint(t, this.originX, this.originY)
        },
        getPointByOrigin: function(t, e) {
            var i = this.getCenterPoint();
            return this.translateToOriginPoint(i, t, e)
        },
        toLocalPoint: function(e, i, r) {
            var n, s, o = this.getCenterPoint();
            return n = "undefined" != typeof i && "undefined" != typeof r ? this.translateToGivenOrigin(o, "center", "center", i, r) : new fabric.Point(this.left, this.top), s = new fabric.Point(e.x, e.y), this.angle && (s = fabric.util.rotatePoint(s, o, -t(this.angle))), s.subtractEquals(n)
        },
        setPositionByOrigin: function(t, e, i) {
            var r = this.translateToCenterPoint(t, e, i),
                n = this.translateToOriginPoint(r, this.originX, this.originY);
            this.set("left", n.x), this.set("top", n.y)
        },
        adjustPosition: function(i) {
            var r, n, s = t(this.angle), o = this.getScaledWidth(), a = fabric.util.cos(s) * o,
                c = fabric.util.sin(s) * o;
            r = "string" == typeof this.originX ? e[this.originX] : this.originX - .5, n = "string" == typeof i ? e[i] : i - .5, this.left += a * (n - r), this.top += c * (n - r), this.setCoords(), this.originX = i
        },
        _setOriginToCenter: function() {
            this._originalOriginX = this.originX, this._originalOriginY = this.originY;
            var t = this.getCenterPoint();
            this.originX = "center", this.originY = "center", this.left = t.x, this.top = t.y
        },
        _resetOrigin: function() {
            var t = this.translateToOriginPoint(this.getCenterPoint(), this._originalOriginX, this._originalOriginY);
            this.originX = this._originalOriginX, this.originY = this._originalOriginY, this.left = t.x, this.top = t.y, this._originalOriginX = null, this._originalOriginY = null
        },
        _getLeftTopCoords: function() {
            return this.translateToOriginPoint(this.getCenterPoint(), "left", "top")
        }
    })
}();
!function() {
    function t(t) {
        return [new fabric.Point(t.tl.x, t.tl.y), new fabric.Point(t.tr.x, t.tr.y), new fabric.Point(t.br.x, t.br.y), new fabric.Point(t.bl.x, t.bl.y)]
    }

    var e = fabric.util.degreesToRadians, i = fabric.util.multiplyTransformMatrices, r = fabric.util.transformPoint;
    fabric.util.object.extend(fabric.Object.prototype, {
        oCoords: null,
        aCoords: null,
        ownMatrixCache: null,
        matrixCache: null,
        getCoords: function(e, i) {
            this.oCoords || this.setCoords();
            var r = e ? this.aCoords : this.oCoords;
            return t(i ? this.calcCoords(e) : r)
        },
        intersectsWithRect: function(t, e, i, r) {
            var n = this.getCoords(i, r), s = fabric.Intersection.intersectPolygonRectangle(n, t, e);
            return "Intersection" === s.status
        },
        intersectsWithObject: function(t, e, i) {
            var r = fabric.Intersection.intersectPolygonPolygon(this.getCoords(e, i), t.getCoords(e, i));
            return "Intersection" === r.status || t.isContainedWithinObject(this, e, i) || this.isContainedWithinObject(t, e, i)
        },
        isContainedWithinObject: function(t, e, i) {
            for (var r = this.getCoords(e, i), n = 0, s = t._getImageLines(i ? t.calcCoords(e) : e ? t.aCoords : t.oCoords); 4 > n; n++) {
                if (!t.containsPoint(r[n], s)) {
                    return !1;
                }
            }
            return !0
        },
        isContainedWithinRect: function(t, e, i, r) {
            var n = this.getBoundingRect(i, r);
            return n.left >= t.x && n.left + n.width <= e.x && n.top >= t.y && n.top + n.height <= e.y
        },
        containsPoint: function(t, e, i, r) {
            var e = e || this._getImageLines(r ? this.calcCoords(i) : i ? this.aCoords : this.oCoords),
                n = this._findCrossPoints(t, e);
            return 0 !== n && n % 2 === 1
        },
        isOnScreen: function(t) {
            if (!this.canvas) {
                return !1;
            }
            for (var e, i = this.canvas.vptCoords.tl, r = this.canvas.vptCoords.br, n = this.getCoords(!0, t), s = 0; 4 > s; s++) {
                if (e = n[s], e.x <= r.x && e.x >= i.x && e.y <= r.y && e.y >= i.y) {
                    return !0;
                }
            }
            return this.intersectsWithRect(i, r, !0, t) ? !0 : this._containsCenterOfCanvas(i, r, t)
        },
        _containsCenterOfCanvas: function(t, e, i) {
            var r = {
                x: (t.x + e.x) / 2,
                y: (t.y + e.y) / 2
            };
            return this.containsPoint(r, null, !0, i) ? !0 : !1
        },
        isPartiallyOnScreen: function(t) {
            if (!this.canvas) {
                return !1;
            }
            var e = this.canvas.vptCoords.tl, i = this.canvas.vptCoords.br;
            return this.intersectsWithRect(e, i, !0, t) ? !0 : this._containsCenterOfCanvas(e, i, t)
        },
        _getImageLines: function(t) {
            return {
                topline: {
                    o: t.tl,
                    d: t.tr
                },
                rightline: {
                    o: t.tr,
                    d: t.br
                },
                bottomline: {
                    o: t.br,
                    d: t.bl
                },
                leftline: {
                    o: t.bl,
                    d: t.tl
                }
            }
        },
        _findCrossPoints: function(t, e) {
            var i, r, n, s, o, a, c = 0;
            for (var h in e) {
                if (a = e[h], !(a.o.y < t.y && a.d.y < t.y || a.o.y >= t.y && a.d.y >= t.y || (a.o.x === a.d.x && a.o.x >= t.x ? o = a.o.x : (i = 0, r = (a.d.y - a.o.y) / (a.d.x - a.o.x), n = t.y - i * t.x, s = a.o.y - r * a.o.x, o = -(n - s) / (i - r)), o >= t.x && (c += 1), 2 !== c))) {
                    break;
                }
            }
            return c
        },
        getBoundingRect: function(t, e) {
            var i = this.getCoords(t, e);
            return fabric.util.makeBoundingBoxFromPoints(i)
        },
        getScaledWidth: function() {
            return this._getTransformedDimensions().x
        },
        getScaledHeight: function() {
            return this._getTransformedDimensions().y
        },
        _constrainScale: function(t) {
            return Math.abs(t) < this.minScaleLimit ? 0 > t ? -this.minScaleLimit : this.minScaleLimit : 0 === t ? 1e-4 : t
        },
        scale: function(t) {
            return this._set("scaleX", t), this._set("scaleY", t), this.setCoords()
        },
        scaleToWidth: function(t, e) {
            var i = this.getBoundingRect(e).width / this.getScaledWidth();
            return this.scale(t / this.width / i)
        },
        scaleToHeight: function(t, e) {
            var i = this.getBoundingRect(e).height / this.getScaledHeight();
            return this.scale(t / this.height / i)
        },
        calcCoords: function(t) {
            var n = this._calcRotateMatrix(), s = this._calcTranslateMatrix(), o = i(s, n),
                a = this.getViewportTransform(), c = t ? o : i(a, o), h = this._getTransformedDimensions(), l = h.x / 2,
                u = h.y / 2, f = r({
                    x: -l,
                    y: -u
                }, c), d = r({
                    x: l,
                    y: -u
                }, c), p = r({
                    x: -l,
                    y: u
                }, c), g = r({
                    x: l,
                    y: u
                }, c);
            if (!t) {
                var v = this.padding, b = e(this.angle), m = fabric.util.cos(b), y = fabric.util.sin(b), _ = m * v,
                    w = y * v, C = _ + w, x = _ - w;
                v && (f.x -= x, f.y -= C, d.x += C, d.y -= x, p.x -= C, p.y += x, g.x += x, g.y += C);
                var O = new fabric.Point((f.x + p.x) / 2, (f.y + p.y) / 2),
                    S = new fabric.Point((d.x + f.x) / 2, (d.y + f.y) / 2),
                    k = new fabric.Point((g.x + d.x) / 2, (g.y + d.y) / 2),
                    T = new fabric.Point((g.x + p.x) / 2, (g.y + p.y) / 2),
                    P = new fabric.Point(S.x + y * this.rotatingPointOffset, S.y - m * this.rotatingPointOffset)
            }
            var j = {
                tl: f,
                tr: d,
                br: g,
                bl: p
            };
            return t || (j.ml = O, j.mt = S, j.mr = k, j.mb = T, j.mtr = P), j
        },
        setCoords: function(t, e) {
            return this.oCoords = this.calcCoords(t), e || (this.aCoords = this.calcCoords(!0)), t || this._setCornerCoords && this._setCornerCoords(), this
        },
        _calcRotateMatrix: function() {
            if (this.angle) {
                var t = e(this.angle), i = fabric.util.cos(t), r = fabric.util.sin(t);
                return [i, r, -r, i, 0, 0]
            }
            return fabric.iMatrix.concat()
        },
        _calcTranslateMatrix: function() {
            var t = this.getCenterPoint();
            return [1, 0, 0, 1, t.x, t.y]
        },
        transformMatrixKey: function(t) {
            var e = "_", i = "";
            return !t && this.group && (i = this.group.transformMatrixKey(t) + e), i + this.top + e + this.left + e + this.scaleX + e + this.scaleY + e + this.skewX + e + this.skewY + e + this.angle + e + this.originX + e + this.originY + e + this.width + e + this.height + e + this.strokeWidth + this.flipX + this.flipY
        },
        calcTransformMatrix: function(t) {
            if (t) {
                return this.calcOwnMatrix();
            }
            var e = this.transformMatrixKey(), r = this.matrixCache || (this.matrixCache = {});
            if (r.key === e) {
                return r.value;
            }
            var n = this.calcOwnMatrix();
            return this.group && (n = i(this.group.calcTransformMatrix(), n)), r.key = e, r.value = n, n
        },
        calcOwnMatrix: function() {
            var t = this.transformMatrixKey(!0), e = this.ownMatrixCache || (this.ownMatrixCache = {});
            if (e.key === t) {
                return e.value;
            }
            var r, n = this._calcTranslateMatrix(), s = this._calcDimensionsTransformMatrix(this.skewX, this.skewY, !0);
            return this.angle && (r = this._calcRotateMatrix(), n = i(n, r)), n = i(n, s), e.key = t, e.value = n, n
        },
        _calcDimensionsTransformMatrix: function(t, r, n) {
            var s, o = this.scaleX * (n && this.flipX ? -1 : 1), a = this.scaleY * (n && this.flipY ? -1 : 1),
                c = [o, 0, 0, a, 0, 0];
            return t && (s = [1, 0, Math.tan(e(t)), 1], c = i(c, s, !0)), r && (s = [1, Math.tan(e(r)), 0, 1], c = i(c, s, !0)), c
        },
        _getNonTransformedDimensions: function() {
            var t = this.strokeWidth, e = this.width + t, i = this.height + t;
            return {
                x: e,
                y: i
            }
        },
        _getTransformedDimensions: function(t, e) {
            "undefined" == typeof t && (t = this.skewX), "undefined" == typeof e && (e = this.skewY);
            var i = this._getNonTransformedDimensions();
            if (0 === t && 0 === e) {
                return {
                    x: i.x * this.scaleX,
                    y: i.y * this.scaleY
                };
            }
            var r, n, s = i.x / 2, o = i.y / 2, a = [{
                x: -s,
                y: -o
            }, {
                x: s,
                y: -o
            }, {
                x: -s,
                y: o
            }, {
                x: s,
                y: o
            }], c = this._calcDimensionsTransformMatrix(t, e, !1);
            for (r = 0; r < a.length; r++) {
                a[r] = fabric.util.transformPoint(a[r], c);
            }
            return n = fabric.util.makeBoundingBoxFromPoints(a), {
                x: n.width,
                y: n.height
            }
        },
        _calculateCurrentDimensions: function() {
            var t = this.getViewportTransform(), e = this._getTransformedDimensions(),
                i = fabric.util.transformPoint(e, t, !0);
            return i.scalarAdd(2 * this.padding)
        }
    })
}();
fabric.util.object.extend(fabric.Object.prototype, {
    sendToBack: function() {
        return this.group ? fabric.StaticCanvas.prototype.sendToBack.call(this.group, this) : this.canvas.sendToBack(this), this
    },
    bringToFront: function() {
        return this.group ? fabric.StaticCanvas.prototype.bringToFront.call(this.group, this) : this.canvas.bringToFront(this), this
    },
    sendBackwards: function(t) {
        return this.group ? fabric.StaticCanvas.prototype.sendBackwards.call(this.group, this, t) : this.canvas.sendBackwards(this, t), this
    },
    bringForward: function(t) {
        return this.group ? fabric.StaticCanvas.prototype.bringForward.call(this.group, this, t) : this.canvas.bringForward(this, t), this
    },
    moveTo: function(t) {
        return this.group && "activeSelection" !== this.group.type ? fabric.StaticCanvas.prototype.moveTo.call(this.group, this, t) : this.canvas.moveTo(this, t), this
    }
});
!function() {
    function t(t, e) {
        if (e) {
            if (e.toLive) {
                return t + ": url(#SVGID_" + e.id + "); ";
            }
            var i = new fabric.Color(e), r = t + ": " + i.toRgb() + "; ", n = i.getAlpha();
            return 1 !== n && (r += t + "-opacity: " + n.toString() + "; "), r
        }
        return t + ": none; "
    }

    var e = fabric.util.toFixed;
    fabric.util.object.extend(fabric.Object.prototype, {
        getSvgStyles: function(e) {
            var i = this.fillRule ? this.fillRule : "nonzero", r = this.strokeWidth ? this.strokeWidth : "0",
                n = this.strokeDashArray ? this.strokeDashArray.join(" ") : "none",
                s = this.strokeLineCap ? this.strokeLineCap : "butt",
                o = this.strokeLineJoin ? this.strokeLineJoin : "miter",
                a = this.strokeMiterLimit ? this.strokeMiterLimit : "4",
                c = "undefined" != typeof this.opacity ? this.opacity : "1",
                h = this.visible ? "" : " visibility: hidden;", l = e ? "" : this.getSvgFilter(),
                u = t("fill", this.fill), f = t("stroke", this.stroke);
            return [f, "stroke-width: ", r, "; ", "stroke-dasharray: ", n, "; ", "stroke-linecap: ", s, "; ", "stroke-linejoin: ", o, "; ", "stroke-miterlimit: ", a, "; ", u, "fill-rule: ", i, "; ", "opacity: ", c, ";", l, h].join("")
        },
        getSvgSpanStyles: function(e, i) {
            var r = "; ",
                n = e.fontFamily ? "font-family: " + (-1 === e.fontFamily.indexOf("'") && -1 === e.fontFamily.indexOf('"') ? "'" + e.fontFamily + "'" : e.fontFamily) + r : "",
                s = e.strokeWidth ? "stroke-width: " + e.strokeWidth + r : "", n = n,
                o = e.fontSize ? "font-size: " + e.fontSize + "px" + r : "",
                a = e.fontStyle ? "font-style: " + e.fontStyle + r : "",
                c = e.fontWeight ? "font-weight: " + e.fontWeight + r : "", h = e.fill ? t("fill", e.fill) : "",
                l = e.stroke ? t("stroke", e.stroke) : "", u = this.getSvgTextDecoration(e),
                f = e.deltaY ? "baseline-shift: " + -e.deltaY + "; " : "";
            return u && (u = "text-decoration: " + u + r), [l, s, n, o, a, c, u, h, f, i ? "white-space: pre; " : ""].join("")
        },
        getSvgTextDecoration: function(t) {
            return "overline" in t || "underline" in t || "linethrough" in t ? (t.overline ? "overline " : "") + (t.underline ? "underline " : "") + (t.linethrough ? "line-through " : "") : ""
        },
        getSvgFilter: function() {
            return this.shadow ? "filter: url(#SVGID_" + this.shadow.id + ");" : ""
        },
        getSvgCommons: function() {
            return [this.id ? 'id="' + this.id + '" ' : "", this.clipPath ? 'clip-path="url(#' + this.clipPath.clipPathId + ')" ' : ""].join("")
        },
        getSvgTransform: function(t, i) {
            var r = t ? this.calcTransformMatrix() : this.calcOwnMatrix(), n = r.map(function(t) {
                return e(t, fabric.Object.NUM_FRACTION_DIGITS)
            }).join(" ");
            return 'transform="matrix(' + n + ")" + (i || "") + this.getSvgTransformMatrix() + '" '
        },
        getSvgTransformMatrix: function() {
            return this.transformMatrix ? " matrix(" + this.transformMatrix.join(" ") + ")" : ""
        },
        _setSVGBg: function(t) {
            if (this.backgroundColor) {
                var i = fabric.Object.NUM_FRACTION_DIGITS;
                t.push("		<rect ", this._getFillAttributes(this.backgroundColor), ' x="', e(-this.width / 2, i), '" y="', e(-this.height / 2, i), '" width="', e(this.width, i), '" height="', e(this.height, i), '"></rect>\n')
            }
        },
        toSVG: function(t) {
            return this._createBaseSVGMarkup(this._toSVG(), {reviver: t})
        },
        toClipPathSVG: function(t) {
            return "	" + this._createBaseClipPathSVGMarkup(this._toSVG(), {reviver: t})
        },
        _createBaseClipPathSVGMarkup: function(t, e) {
            e = e || {};
            var i = e.reviver, r = e.additionalTransform || "",
                n = [this.getSvgTransform(!0, r), this.getSvgCommons()].join(""), s = t.indexOf("COMMON_PARTS");
            return t[s] = n, i ? i(t.join("")) : t.join("")
        },
        _createBaseSVGMarkup: function(t, e) {
            e = e || {};
            var i, r, n = e.noStyle, s = e.withShadow, o = e.reviver,
                a = n ? "" : 'style="' + this.getSvgStyles() + '" ',
                c = s ? 'style="' + this.getSvgFilter() + '" ' : "", h = this.clipPath,
                l = this.clipPath && this.clipPath.absolutePositioned, u = [], f = t.indexOf("COMMON_PARTS");
            return h && (h.clipPathId = "CLIPPATH_" + fabric.Object.__uid++, r = '<clipPath id="' + h.clipPathId + '" >\n' + this.clipPath.toClipPathSVG(o) + "</clipPath>\n"), l && u.push("<g ", c, this.getSvgCommons(), " >\n"), u.push("<g ", this.getSvgTransform(!1), l ? "" : c + this.getSvgCommons(), " >\n"), i = [a, n ? "" : this.addPaintOrder(), " "].join(""), t[f] = i, this.fill && this.fill.toLive && u.push(this.fill.toSVG(this, !1)), this.stroke && this.stroke.toLive && u.push(this.stroke.toSVG(this, !1)), this.shadow && u.push(this.shadow.toSVG(this)), h && u.push(r), u.push(t.join("")), u.push("</g>\n"), l && u.push("</g>\n"), o ? o(u.join("")) : u.join("")
        },
        addPaintOrder: function() {
            return "fill" !== this.paintFirst ? ' paint-order="' + this.paintFirst + '" ' : ""
        }
    })
}();
!function() {
    function t(t, e, r) {
        var n = {}, s = !0;
        r.forEach(function(e) {
            n[e] = t[e]
        }), i(t[e], n, s)
    }

    function e(t, i, r) {
        if (t === i) {
            return !0;
        }
        if (Array.isArray(t)) {
            if (!Array.isArray(i) || t.length !== i.length) {
                return !1;
            }
            for (var n = 0, s = t.length; s > n; n++) {
                if (!e(t[n], i[n])) {
                    return !1;
                }
            }
            return !0
        }
        if (t && "object" == typeof t) {
            var o, a = Object.keys(t);
            if (!i || "object" != typeof i || !r && a.length !== Object.keys(i).length) {
                return !1;
            }
            for (var n = 0, s = a.length; s > n; n++) {
                if (o = a[n], !e(t[o], i[o])) {
                    return !1;
                }
            }
            return !0
        }
    }

    var i = fabric.util.object.extend, r = "stateProperties";
    fabric.util.object.extend(fabric.Object.prototype, {
        hasStateChanged: function(t) {
            t = t || r;
            var i = "_" + t;
            return Object.keys(this[i]).length < this[t].length ? !0 : !e(this[i], this, !0)
        },
        saveState: function(e) {
            var i = e && e.propertySet || r, n = "_" + i;
            return this[n] ? (t(this, n, this[i]), e && e.stateProperties && t(this, n, e.stateProperties), this) : this.setupState(e)
        },
        setupState: function(t) {
            t = t || {};
            var e = t.propertySet || r;
            return t.propertySet = e, this["_" + e] = {}, this.saveState(t), this
        }
    })
}();
!function() {
    var t = fabric.util.degreesToRadians;
    fabric.util.object.extend(fabric.Object.prototype, {
        _controlsVisibility: null,
        _findTargetCorner: function(t) {
            if (!this.hasControls || this.group || !this.canvas || this.canvas._activeObject !== this) {
                return !1;
            }
            var e, i, r = t.x, n = t.y;
            this.__corner = 0;
            for (var s in this.oCoords) {
                if (this.isControlVisible(s) && ("mtr" !== s || this.hasRotatingPoint) && (!this.get("lockUniScaling") || "mt" !== s && "mr" !== s && "mb" !== s && "ml" !== s) && (i = this._getImageLines(this.oCoords[s].corner), e = this._findCrossPoints({
                    x: r,
                    y: n
                }, i), 0 !== e && e % 2 === 1)) {
                    return this.__corner = s, s;
                }
            }
            return !1
        },
        _setCornerCoords: function() {
            var e, i, r = this.oCoords, n = t(45 - this.angle), s = .707106 * this.cornerSize,
                o = s * fabric.util.cos(n), a = s * fabric.util.sin(n);
            for (var c in r) {
                e = r[c].x, i = r[c].y, r[c].corner = {
                    tl: {
                        x: e - a,
                        y: i - o
                    },
                    tr: {
                        x: e + o,
                        y: i - a
                    },
                    bl: {
                        x: e - o,
                        y: i + a
                    },
                    br: {
                        x: e + a,
                        y: i + o
                    }
                }
            }
        },
        drawSelectionBackground: function(e) {
            if (!this.selectionBackgroundColor || this.canvas && !this.canvas.interactive || this.canvas && this.canvas._activeObject !== this) {
                return this;
            }
            e.save();
            var i = this.getCenterPoint(), r = this._calculateCurrentDimensions(), n = this.canvas.viewportTransform;
            return e.translate(i.x, i.y), e.scale(1 / n[0], 1 / n[3]), e.rotate(t(this.angle)), e.fillStyle = this.selectionBackgroundColor, e.fillRect(-r.x / 2, -r.y / 2, r.x, r.y), e.restore(), this
        },
        drawBorders: function(t, e) {
            e = e || {};
            var i = this._calculateCurrentDimensions(), r = 1 / this.borderScaleFactor, n = i.x + r, s = i.y + r,
                o = "undefined" != typeof e.hasRotatingPoint ? e.hasRotatingPoint : this.hasRotatingPoint,
                a = "undefined" != typeof e.hasControls ? e.hasControls : this.hasControls,
                c = "undefined" != typeof e.rotatingPointOffset ? e.rotatingPointOffset : this.rotatingPointOffset;
            if (t.save(), t.strokeStyle = e.borderColor || this.borderColor, this._setLineDash(t, e.borderDashArray || this.borderDashArray, null), t.strokeRect(-n / 2, -s / 2, n, s), o && this.isControlVisible("mtr") && a) {
                var h = -s / 2;
                t.beginPath(), t.moveTo(0, h), t.lineTo(0, h - c), t.stroke()
            }
            return t.restore(), this
        },
        drawBordersInGroup: function(t, e, i) {
            i = i || {};
            var r = this._getNonTransformedDimensions(),
                n = fabric.util.customTransformMatrix(e.scaleX, e.scaleY, e.skewX),
                s = fabric.util.transformPoint(r, n), o = 1 / this.borderScaleFactor, a = s.x + o, c = s.y + o;
            return t.save(), this._setLineDash(t, i.borderDashArray || this.borderDashArray, null), t.strokeStyle = i.borderColor || this.borderColor, t.strokeRect(-a / 2, -c / 2, a, c), t.restore(), this
        },
        drawControls: function(t, e) {
            e = e || {};
            var i = this._calculateCurrentDimensions(), r = i.x, n = i.y, s = e.cornerSize || this.cornerSize,
                o = -(r + s) / 2, a = -(n + s) / 2,
                c = "undefined" != typeof e.transparentCorners ? e.transparentCorners : this.transparentCorners,
                h = "undefined" != typeof e.hasRotatingPoint ? e.hasRotatingPoint : this.hasRotatingPoint,
                l = c ? "stroke" : "fill";
            return t.save(), t.strokeStyle = t.fillStyle = e.cornerColor || this.cornerColor, this.transparentCorners || (t.strokeStyle = e.cornerStrokeColor || this.cornerStrokeColor), this._setLineDash(t, e.cornerDashArray || this.cornerDashArray, null), this._drawControl("tl", t, l, o, a, e), this._drawControl("tr", t, l, o + r, a, e), this._drawControl("bl", t, l, o, a + n, e), this._drawControl("br", t, l, o + r, a + n, e), this.get("lockUniScaling") || (this._drawControl("mt", t, l, o + r / 2, a, e), this._drawControl("mb", t, l, o + r / 2, a + n, e), this._drawControl("mr", t, l, o + r, a + n / 2, e), this._drawControl("ml", t, l, o, a + n / 2, e)), h && this._drawControl("mtr", t, l, o + r / 2, a - this.rotatingPointOffset, e), t.restore(), this
        },
        _drawControl: function(t, e, i, r, n, s) {
            if (s = s || {}, this.isControlVisible(t)) {
                var o = this.cornerSize, a = !this.transparentCorners && this.cornerStrokeColor;
                switch (s.cornerStyle || this.cornerStyle) {
                    case"circle":
                        e.beginPath(), e.arc(r + o / 2, n + o / 2, o / 2, 0, 2 * Math.PI, !1), e[i](), a && e.stroke();
                        break;
                    default:
                        this.transparentCorners || e.clearRect(r, n, o, o), e[i + "Rect"](r, n, o, o), a && e.strokeRect(r, n, o, o)
                }
            }
        },
        isControlVisible: function(t) {
            return this._getControlsVisibility()[t]
        },
        setControlVisible: function(t, e) {
            return this._getControlsVisibility()[t] = e, this
        },
        setControlsVisibility: function(t) {
            t || (t = {});
            for (var e in t) {
                this.setControlVisible(e, t[e]);
            }
            return this
        },
        _getControlsVisibility: function() {
            return this._controlsVisibility || (this._controlsVisibility = {
                tl: !0,
                tr: !0,
                br: !0,
                bl: !0,
                ml: !0,
                mt: !0,
                mr: !0,
                mb: !0,
                mtr: !0
            }), this._controlsVisibility
        },
        onDeselect: function() {
        },
        onSelect: function() {
        }
    })
}();
fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    FX_DURATION: 500,
    fxCenterObjectH: function(t, e) {
        e = e || {};
        var i = function() {
        }, r = e.onComplete || i, n = e.onChange || i, s = this;
        return fabric.util.animate({
            startValue: t.left,
            endValue: this.getCenter().left,
            duration: this.FX_DURATION,
            onChange: function(e) {
                t.set("left", e), s.requestRenderAll(), n()
            },
            onComplete: function() {
                t.setCoords(), r()
            }
        }), this
    },
    fxCenterObjectV: function(t, e) {
        e = e || {};
        var i = function() {
        }, r = e.onComplete || i, n = e.onChange || i, s = this;
        return fabric.util.animate({
            startValue: t.top,
            endValue: this.getCenter().top,
            duration: this.FX_DURATION,
            onChange: function(e) {
                t.set("top", e), s.requestRenderAll(), n()
            },
            onComplete: function() {
                t.setCoords(), r()
            }
        }), this
    },
    fxRemove: function(t, e) {
        e = e || {};
        var i = function() {
        }, r = e.onComplete || i, n = e.onChange || i, s = this;
        return fabric.util.animate({
            startValue: t.opacity,
            endValue: 0,
            duration: this.FX_DURATION,
            onChange: function(e) {
                t.set("opacity", e), s.requestRenderAll(), n()
            },
            onComplete: function() {
                s.remove(t), r()
            }
        }), this
    }
}), fabric.util.object.extend(fabric.Object.prototype, {
    animate: function() {
        if (arguments[0] && "object" == typeof arguments[0]) {
            var t, e, i = [];
            for (t in arguments[0]) {
                i.push(t);
            }
            for (var r = 0, n = i.length; n > r; r++) {
                t = i[r], e = r !== n - 1, this._animate(t, arguments[0][t], arguments[1], e)
            }
        } else {
            this._animate.apply(this, arguments);
        }
        return this
    },
    _animate: function(t, e, i, r) {
        var n, s = this;
        e = e.toString(), i = i ? fabric.util.object.clone(i) : {}, ~t.indexOf(".") && (n = t.split("."));
        var o = n ? this.get(n[0])[n[1]] : this.get(t);
        "from" in i || (i.from = o), e = ~e.indexOf("=") ? o + parseFloat(e.replace("=", "")) : parseFloat(e), fabric.util.animate({
            startValue: i.from,
            endValue: e,
            byValue: i.by,
            easing: i.easing,
            duration: i.duration,
            abort: i.abort && function() {
                return i.abort.call(s)
            },
            onChange: function(e, o, a) {
                n ? s[n[0]][n[1]] = e : s.set(t, e), r || i.onChange && i.onChange(e, o, a)
            },
            onComplete: function(t, e, n) {
                r || (s.setCoords(), i.onComplete && i.onComplete(t, e, n))
            }
        })
    }
});
!function(t) {
    "use strict";

    function e(t, e) {
        var i = t.origin, r = t.axis1, n = t.axis2, s = t.dimension, o = e.nearest, a = e.center, c = e.farthest;
        return function() {
            switch (this.get(i)) {
                case o:
                    return Math.min(this.get(r), this.get(n));
                case a:
                    return Math.min(this.get(r), this.get(n)) + .5 * this.get(s);
                case c:
                    return Math.max(this.get(r), this.get(n))
            }
        }
    }

    var i = t.fabric || (t.fabric = {}), r = i.util.object.extend, n = i.util.object.clone, s = {
        x1: 1,
        x2: 1,
        y1: 1,
        y2: 1
    }, o = i.StaticCanvas.supports("setLineDash");
    return i.Line ? void i.warn("fabric.Line is already defined") : (i.Line = i.util.createClass(i.Object, {
        type: "line",
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        cacheProperties: i.Object.prototype.cacheProperties.concat("x1", "x2", "y1", "y2"),
        initialize: function(t, e) {
            t || (t = [0, 0, 0, 0]), this.callSuper("initialize", e), this.set("x1", t[0]), this.set("y1", t[1]), this.set("x2", t[2]), this.set("y2", t[3]), this._setWidthHeight(e)
        },
        _setWidthHeight: function(t) {
            t || (t = {}), this.width = Math.abs(this.x2 - this.x1), this.height = Math.abs(this.y2 - this.y1), this.left = "left" in t ? t.left : this._getLeftToOriginX(), this.top = "top" in t ? t.top : this._getTopToOriginY()
        },
        _set: function(t, e) {
            return this.callSuper("_set", t, e), "undefined" != typeof s[t] && this._setWidthHeight(), this
        },
        _getLeftToOriginX: e({
            origin: "originX",
            axis1: "x1",
            axis2: "x2",
            dimension: "width"
        }, {
            nearest: "left",
            center: "center",
            farthest: "right"
        }),
        _getTopToOriginY: e({
            origin: "originY",
            axis1: "y1",
            axis2: "y2",
            dimension: "height"
        }, {
            nearest: "top",
            center: "center",
            farthest: "bottom"
        }),
        _render: function(t) {
            if (t.beginPath(), !this.strokeDashArray || this.strokeDashArray && o) {
                var e = this.calcLinePoints();
                t.moveTo(e.x1, e.y1), t.lineTo(e.x2, e.y2)
            }
            t.lineWidth = this.strokeWidth;
            var i = t.strokeStyle;
            t.strokeStyle = this.stroke || t.fillStyle, this.stroke && this._renderStroke(t), t.strokeStyle = i
        },
        _renderDashedStroke: function(t) {
            var e = this.calcLinePoints();
            t.beginPath(), i.util.drawDashedLine(t, e.x1, e.y1, e.x2, e.y2, this.strokeDashArray), t.closePath()
        },
        _findCenterFromElement: function() {
            return {
                x: (this.x1 + this.x2) / 2,
                y: (this.y1 + this.y2) / 2
            }
        },
        toObject: function(t) {
            return r(this.callSuper("toObject", t), this.calcLinePoints())
        },
        _getNonTransformedDimensions: function() {
            var t = this.callSuper("_getNonTransformedDimensions");
            return "butt" === this.strokeLineCap && (0 === this.width && (t.y -= this.strokeWidth), 0 === this.height && (t.x -= this.strokeWidth)), t
        },
        calcLinePoints: function() {
            var t = this.x1 <= this.x2 ? -1 : 1, e = this.y1 <= this.y2 ? -1 : 1, i = t * this.width * .5,
                r = e * this.height * .5, n = t * this.width * -.5, s = e * this.height * -.5;
            return {
                x1: i,
                x2: n,
                y1: r,
                y2: s
            }
        },
        _toSVG: function() {
            var t = this.calcLinePoints();
            return ["<line ", "COMMON_PARTS", 'x1="', t.x1, '" y1="', t.y1, '" x2="', t.x2, '" y2="', t.y2, '" />\n']
        }
    }), i.Line.ATTRIBUTE_NAMES = i.SHARED_ATTRIBUTES.concat("x1 y1 x2 y2".split(" ")), i.Line.fromElement = function(t, e, n) {
        n = n || {};
        var s = i.parseAttributes(t, i.Line.ATTRIBUTE_NAMES), o = [s.x1 || 0, s.y1 || 0, s.x2 || 0, s.y2 || 0];
        e(new i.Line(o, r(s, n)))
    }, void (i.Line.fromObject = function(t, e) {
        function r(t) {
            delete t.points, e && e(t)
        }

        var s = n(t, !0);
        s.points = [t.x1, t.y1, t.x2, t.y2], i.Object._fromObject("Line", s, r, "points")
    }))
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";

    function e(t) {
        return "radius" in t && t.radius >= 0
    }

    var i = t.fabric || (t.fabric = {}), r = Math.PI;
    return i.Circle ? void i.warn("fabric.Circle is already defined.") : (i.Circle = i.util.createClass(i.Object, {
        type: "circle",
        radius: 0,
        startAngle: 0,
        endAngle: 2 * r,
        cacheProperties: i.Object.prototype.cacheProperties.concat("radius", "startAngle", "endAngle"),
        _set: function(t, e) {
            return this.callSuper("_set", t, e), "radius" === t && this.setRadius(e), this
        },
        toObject: function(t) {
            return this.callSuper("toObject", ["radius", "startAngle", "endAngle"].concat(t))
        },
        _toSVG: function() {
            var t, e = 0, n = 0, s = (this.endAngle - this.startAngle) % (2 * r);
            if (0 === s) {
                t = ["<circle ", "COMMON_PARTS", 'cx="' + e + '" cy="' + n + '" ', 'r="', this.radius, '" />\n'];
            } else {
                var o = i.util.cos(this.startAngle) * this.radius, a = i.util.sin(this.startAngle) * this.radius,
                    c = i.util.cos(this.endAngle) * this.radius, h = i.util.sin(this.endAngle) * this.radius,
                    l = s > r ? "1" : "0";
                t = ['<path d="M ' + o + " " + a, " A " + this.radius + " " + this.radius, " 0 ", +l + " 1", " " + c + " " + h, '"', "COMMON_PARTS", " />\n"]
            }
            return t
        },
        _render: function(t) {
            t.beginPath(), t.arc(0, 0, this.radius, this.startAngle, this.endAngle, !1), this._renderPaintInOrder(t)
        },
        getRadiusX: function() {
            return this.get("radius") * this.get("scaleX")
        },
        getRadiusY: function() {
            return this.get("radius") * this.get("scaleY")
        },
        setRadius: function(t) {
            return this.radius = t, this.set("width", 2 * t).set("height", 2 * t)
        }
    }), i.Circle.ATTRIBUTE_NAMES = i.SHARED_ATTRIBUTES.concat("cx cy r".split(" ")), i.Circle.fromElement = function(t, r) {
        var n = i.parseAttributes(t, i.Circle.ATTRIBUTE_NAMES);
        if (!e(n)) {
            throw new Error("value of `r` attribute is required and can not be negative");
        }
        n.left = (n.left || 0) - n.radius, n.top = (n.top || 0) - n.radius, r(new i.Circle(n))
    }, void (i.Circle.fromObject = function(t, e) {
        return i.Object._fromObject("Circle", t, e)
    }))
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {});
    return e.Triangle ? void e.warn("fabric.Triangle is already defined") : (e.Triangle = e.util.createClass(e.Object, {
        type: "triangle",
        width: 100,
        height: 100,
        _render: function(t) {
            var e = this.width / 2, i = this.height / 2;
            t.beginPath(), t.moveTo(-e, i), t.lineTo(0, -i), t.lineTo(e, i), t.closePath(), this._renderPaintInOrder(t)
        },
        _renderDashedStroke: function(t) {
            var i = this.width / 2, r = this.height / 2;
            t.beginPath(), e.util.drawDashedLine(t, -i, r, 0, -r, this.strokeDashArray), e.util.drawDashedLine(t, 0, -r, i, r, this.strokeDashArray), e.util.drawDashedLine(t, i, r, -i, r, this.strokeDashArray), t.closePath()
        },
        _toSVG: function() {
            var t = this.width / 2, e = this.height / 2, i = [-t + " " + e, "0 " + -e, t + " " + e].join(",");
            return ["<polygon ", "COMMON_PARTS", 'points="', i, '" />']
        }
    }), void (e.Triangle.fromObject = function(t, i) {
        return e.Object._fromObject("Triangle", t, i)
    }))
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = 2 * Math.PI;
    return e.Ellipse ? void e.warn("fabric.Ellipse is already defined.") : (e.Ellipse = e.util.createClass(e.Object, {
        type: "ellipse",
        rx: 0,
        ry: 0,
        cacheProperties: e.Object.prototype.cacheProperties.concat("rx", "ry"),
        initialize: function(t) {
            this.callSuper("initialize", t), this.set("rx", t && t.rx || 0), this.set("ry", t && t.ry || 0)
        },
        _set: function(t, e) {
            switch (this.callSuper("_set", t, e), t) {
                case"rx":
                    this.rx = e, this.set("width", 2 * e);
                    break;
                case"ry":
                    this.ry = e, this.set("height", 2 * e)
            }
            return this
        },
        getRx: function() {
            return this.get("rx") * this.get("scaleX")
        },
        getRy: function() {
            return this.get("ry") * this.get("scaleY")
        },
        toObject: function(t) {
            return this.callSuper("toObject", ["rx", "ry"].concat(t))
        },
        _toSVG: function() {
            return ["<ellipse ", "COMMON_PARTS", 'cx="0" cy="0" ', 'rx="', this.rx, '" ry="', this.ry, '" />\n']
        },
        _render: function(t) {
            t.beginPath(), t.save(), t.transform(1, 0, 0, this.ry / this.rx, 0, 0), t.arc(0, 0, this.rx, 0, i, !1), t.restore(), this._renderPaintInOrder(t)
        }
    }), e.Ellipse.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("cx cy rx ry".split(" ")), e.Ellipse.fromElement = function(t, i) {
        var r = e.parseAttributes(t, e.Ellipse.ATTRIBUTE_NAMES);
        r.left = (r.left || 0) - r.rx, r.top = (r.top || 0) - r.ry, i(new e.Ellipse(r))
    }, void (e.Ellipse.fromObject = function(t, i) {
        return e.Object._fromObject("Ellipse", t, i)
    }))
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.object.extend;
    return e.Rect ? void e.warn("fabric.Rect is already defined") : (e.Rect = e.util.createClass(e.Object, {
        stateProperties: e.Object.prototype.stateProperties.concat("rx", "ry"),
        type: "rect",
        rx: 0,
        ry: 0,
        cacheProperties: e.Object.prototype.cacheProperties.concat("rx", "ry"),
        initialize: function(t) {
            this.callSuper("initialize", t), this._initRxRy()
        },
        _initRxRy: function() {
            this.rx && !this.ry ? this.ry = this.rx : this.ry && !this.rx && (this.rx = this.ry)
        },
        _render: function(t) {
            if (1 === this.width && 1 === this.height) {
                return void t.fillRect(-.5, -.5, 1, 1);
            }
            var e = this.rx ? Math.min(this.rx, this.width / 2) : 0,
                i = this.ry ? Math.min(this.ry, this.height / 2) : 0, r = this.width, n = this.height,
                s = -this.width / 2, o = -this.height / 2, a = 0 !== e || 0 !== i, c = .4477152502;
            t.beginPath(), t.moveTo(s + e, o), t.lineTo(s + r - e, o), a && t.bezierCurveTo(s + r - c * e, o, s + r, o + c * i, s + r, o + i), t.lineTo(s + r, o + n - i), a && t.bezierCurveTo(s + r, o + n - c * i, s + r - c * e, o + n, s + r - e, o + n), t.lineTo(s + e, o + n), a && t.bezierCurveTo(s + c * e, o + n, s, o + n - c * i, s, o + n - i), t.lineTo(s, o + i), a && t.bezierCurveTo(s, o + c * i, s + c * e, o, s + e, o), t.closePath(), this._renderPaintInOrder(t)
        },
        _renderDashedStroke: function(t) {
            var i = -this.width / 2, r = -this.height / 2, n = this.width, s = this.height;
            t.beginPath(), e.util.drawDashedLine(t, i, r, i + n, r, this.strokeDashArray), e.util.drawDashedLine(t, i + n, r, i + n, r + s, this.strokeDashArray), e.util.drawDashedLine(t, i + n, r + s, i, r + s, this.strokeDashArray), e.util.drawDashedLine(t, i, r + s, i, r, this.strokeDashArray), t.closePath()
        },
        toObject: function(t) {
            return this.callSuper("toObject", ["rx", "ry"].concat(t))
        },
        _toSVG: function() {
            var t = -this.width / 2, e = -this.height / 2;
            return ["<rect ", "COMMON_PARTS", 'x="', t, '" y="', e, '" rx="', this.rx, '" ry="', this.ry, '" width="', this.width, '" height="', this.height, '" />\n']
        }
    }), e.Rect.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("x y rx ry width height".split(" ")), e.Rect.fromElement = function(t, r, n) {
        if (!t) {
            return r(null);
        }
        n = n || {};
        var s = e.parseAttributes(t, e.Rect.ATTRIBUTE_NAMES);
        s.left = s.left || 0, s.top = s.top || 0;
        var o = new e.Rect(i(n ? e.util.object.clone(n) : {}, s));
        o.visible = o.visible && o.width > 0 && o.height > 0, r(o)
    }, void (e.Rect.fromObject = function(t, i) {
        return e.Object._fromObject("Rect", t, i)
    }))
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.object.extend, r = e.util.array.min, n = e.util.array.max,
        s = e.util.toFixed;
    return e.Polyline ? void e.warn("fabric.Polyline is already defined") : (e.Polyline = e.util.createClass(e.Object, {
        type: "polyline",
        points: null,
        cacheProperties: e.Object.prototype.cacheProperties.concat("points"),
        initialize: function(t, e) {
            e = e || {}, this.points = t || [], this.callSuper("initialize", e);
            var i = this._calcDimensions();
            "undefined" == typeof e.left && (this.left = i.left), "undefined" == typeof e.top && (this.top = i.top), this.width = i.width, this.height = i.height, this.pathOffset = {
                x: i.left + this.width / 2,
                y: i.top + this.height / 2
            }
        },
        _calcDimensions: function() {
            var t = this.points, e = r(t, "x") || 0, i = r(t, "y") || 0, s = n(t, "x") || 0, o = n(t, "y") || 0,
                a = s - e, c = o - i;
            return {
                left: e,
                top: i,
                width: a,
                height: c
            }
        },
        toObject: function(t) {
            return i(this.callSuper("toObject", t), {points: this.points.concat()})
        },
        _toSVG: function() {
            for (var t = [], i = this.pathOffset.x, r = this.pathOffset.y, n = e.Object.NUM_FRACTION_DIGITS, o = 0, a = this.points.length; a > o; o++) {
                t.push(s(this.points[o].x - i, n), ",", s(this.points[o].y - r, n), " ");
            }
            return ["<" + this.type + " ", "COMMON_PARTS", 'points="', t.join(""), '" />\n']
        },
        commonRender: function(t) {
            var e, i = this.points.length, r = this.pathOffset.x, n = this.pathOffset.y;
            if (!i || isNaN(this.points[i - 1].y)) {
                return !1;
            }
            t.beginPath(), t.moveTo(this.points[0].x - r, this.points[0].y - n);
            for (var s = 0; i > s; s++) {
                e = this.points[s], t.lineTo(e.x - r, e.y - n);
            }
            return !0
        },
        _render: function(t) {
            this.commonRender(t) && this._renderPaintInOrder(t)
        },
        _renderDashedStroke: function(t) {
            var i, r;
            t.beginPath();
            for (var n = 0, s = this.points.length; s > n; n++) {
                i = this.points[n], r = this.points[n + 1] || i, e.util.drawDashedLine(t, i.x, i.y, r.x, r.y, this.strokeDashArray)
            }
        },
        complexity: function() {
            return this.get("points").length
        }
    }), e.Polyline.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(), e.Polyline.fromElement = function(t, i, r) {
        if (!t) {
            return i(null);
        }
        r || (r = {});
        var n = e.parsePointsAttribute(t.getAttribute("points")), s = e.parseAttributes(t, e.Polyline.ATTRIBUTE_NAMES);
        i(new e.Polyline(n, e.util.object.extend(s, r)))
    }, void (e.Polyline.fromObject = function(t, i) {
        return e.Object._fromObject("Polyline", t, i, "points")
    }))
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.object.extend;
    return e.Polygon ? void e.warn("fabric.Polygon is already defined") : (e.Polygon = e.util.createClass(e.Polyline, {
        type: "polygon",
        _render: function(t) {
            this.commonRender(t) && (t.closePath(), this._renderPaintInOrder(t))
        },
        _renderDashedStroke: function(t) {
            this.callSuper("_renderDashedStroke", t), t.closePath()
        }
    }), e.Polygon.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(), e.Polygon.fromElement = function(t, r, n) {
        if (!t) {
            return r(null);
        }
        n || (n = {});
        var s = e.parsePointsAttribute(t.getAttribute("points")), o = e.parseAttributes(t, e.Polygon.ATTRIBUTE_NAMES);
        r(new e.Polygon(s, i(o, n)))
    }, void (e.Polygon.fromObject = function(t, i) {
        return e.Object._fromObject("Polygon", t, i, "points")
    }))
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.array.min, r = e.util.array.max, n = e.util.object.extend,
        s = Object.prototype.toString, o = e.util.drawArc, a = e.util.toFixed, c = {
            m: 2,
            l: 2,
            h: 1,
            v: 1,
            c: 6,
            s: 4,
            q: 4,
            t: 2,
            a: 7
        }, h = {
            m: "l",
            M: "L"
        };
    return e.Path ? void e.warn("fabric.Path is already defined") : (e.Path = e.util.createClass(e.Object, {
        type: "path",
        path: null,
        cacheProperties: e.Object.prototype.cacheProperties.concat("path", "fillRule"),
        stateProperties: e.Object.prototype.stateProperties.concat("path"),
        initialize: function(t, e) {
            e = e || {}, this.callSuper("initialize", e), t || (t = []);
            var i = "[object Array]" === s.call(t);
            this.path = i ? t : t.match && t.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi), this.path && (i || (this.path = this._parsePath()), this._setPositionDimensions(e))
        },
        _setPositionDimensions: function(t) {
            var e = this._parseDimensions();
            this.width = e.width, this.height = e.height, "undefined" == typeof t.left && (this.left = e.left), "undefined" == typeof t.top && (this.top = e.top), this.pathOffset = this.pathOffset || {
                x: e.left + this.width / 2,
                y: e.top + this.height / 2
            }
        },
        _renderPathCommands: function(t) {
            var e, i, r, n = null, s = 0, a = 0, c = 0, h = 0, l = 0, u = 0, f = -this.pathOffset.x,
                d = -this.pathOffset.y;
            t.beginPath();
            for (var p = 0, g = this.path.length; g > p; ++p) {
                switch (e = this.path[p], e[0]) {
                    case"l":
                        c += e[1], h += e[2], t.lineTo(c + f, h + d);
                        break;
                    case"L":
                        c = e[1], h = e[2], t.lineTo(c + f, h + d);
                        break;
                    case"h":
                        c += e[1], t.lineTo(c + f, h + d);
                        break;
                    case"H":
                        c = e[1], t.lineTo(c + f, h + d);
                        break;
                    case"v":
                        h += e[1], t.lineTo(c + f, h + d);
                        break;
                    case"V":
                        h = e[1], t.lineTo(c + f, h + d);
                        break;
                    case"m":
                        c += e[1], h += e[2], s = c, a = h, t.moveTo(c + f, h + d);
                        break;
                    case"M":
                        c = e[1], h = e[2], s = c, a = h, t.moveTo(c + f, h + d);
                        break;
                    case"c":
                        i = c + e[5], r = h + e[6], l = c + e[3], u = h + e[4], t.bezierCurveTo(c + e[1] + f, h + e[2] + d, l + f, u + d, i + f, r + d), c = i, h = r;
                        break;
                    case"C":
                        c = e[5], h = e[6], l = e[3], u = e[4], t.bezierCurveTo(e[1] + f, e[2] + d, l + f, u + d, c + f, h + d);
                        break;
                    case"s":
                        i = c + e[3], r = h + e[4], null === n[0].match(/[CcSs]/) ? (l = c, u = h) : (l = 2 * c - l, u = 2 * h - u), t.bezierCurveTo(l + f, u + d, c + e[1] + f, h + e[2] + d, i + f, r + d), l = c + e[1], u = h + e[2], c = i, h = r;
                        break;
                    case"S":
                        i = e[3], r = e[4], null === n[0].match(/[CcSs]/) ? (l = c, u = h) : (l = 2 * c - l, u = 2 * h - u), t.bezierCurveTo(l + f, u + d, e[1] + f, e[2] + d, i + f, r + d), c = i, h = r, l = e[1], u = e[2];
                        break;
                    case"q":
                        i = c + e[3], r = h + e[4], l = c + e[1], u = h + e[2], t.quadraticCurveTo(l + f, u + d, i + f, r + d), c = i, h = r;
                        break;
                    case"Q":
                        i = e[3], r = e[4], t.quadraticCurveTo(e[1] + f, e[2] + d, i + f, r + d), c = i, h = r, l = e[1], u = e[2];
                        break;
                    case"t":
                        i = c + e[1], r = h + e[2], null === n[0].match(/[QqTt]/) ? (l = c, u = h) : (l = 2 * c - l, u = 2 * h - u), t.quadraticCurveTo(l + f, u + d, i + f, r + d), c = i, h = r;
                        break;
                    case"T":
                        i = e[1], r = e[2], null === n[0].match(/[QqTt]/) ? (l = c, u = h) : (l = 2 * c - l, u = 2 * h - u), t.quadraticCurveTo(l + f, u + d, i + f, r + d), c = i, h = r;
                        break;
                    case"a":
                        o(t, c + f, h + d, [e[1], e[2], e[3], e[4], e[5], e[6] + c + f, e[7] + h + d]), c += e[6], h += e[7];
                        break;
                    case"A":
                        o(t, c + f, h + d, [e[1], e[2], e[3], e[4], e[5], e[6] + f, e[7] + d]), c = e[6], h = e[7];
                        break;
                    case"z":
                    case"Z":
                        c = s, h = a, t.closePath()
                }
                n = e
            }
        },
        _render: function(t) {
            this._renderPathCommands(t), this._renderPaintInOrder(t)
        },
        toString: function() {
            return "#<fabric.Path (" + this.complexity() + '): { "top": ' + this.top + ', "left": ' + this.left + " }>"
        },
        toObject: function(t) {
            var e = n(this.callSuper("toObject", t), {
                path: this.path.map(function(t) {
                    return t.slice()
                }),
                top: this.top,
                left: this.left
            });
            return e
        },
        toDatalessObject: function(t) {
            var e = this.toObject(["sourcePath"].concat(t));
            return e.sourcePath && delete e.path, e
        },
        _toSVG: function() {
            var t = this._getOffsetTransform(), e = this.path.map(function(t) {
                return t.join(" ")
            }).join(" ");
            return ["<path ", "COMMON_PARTS", 'd="', e, '" stroke-linecap="round" ', 'transform="' + t + '" ', "/>\n"]
        },
        _getOffsetTransform: function() {
            var t = e.Object.NUM_FRACTION_DIGITS;
            return " translate(" + a(-this.pathOffset.x, t) + ", " + a(-this.pathOffset.y, t) + ")"
        },
        toClipPathSVG: function(t) {
            var e = this._getOffsetTransform();
            return "	" + this._createBaseClipPathSVGMarkup(this._toSVG(), {
                reviver: t,
                additionalTransform: e
            })
        },
        complexity: function() {
            return this.path.length
        },
        _parsePath: function() {
            for (var t, e, i, r, n, s = [], o = [], a = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi, l = 0, u = this.path.length; u > l; l++) {
                for (t = this.path[l], r = t.slice(1).trim(), o.length = 0; i = a.exec(r);) {
                    o.push(i[0]);
                }
                n = [t.charAt(0)];
                for (var f = 0, d = o.length; d > f; f++) {
                    e = parseFloat(o[f]), isNaN(e) || n.push(e);
                }
                var p = n[0], g = c[p.toLowerCase()], v = h[p] || p;
                if (n.length - 1 > g) {
                    for (var b = 1, m = n.length; m > b; b += g) {
                        s.push([p].concat(n.slice(b, b + g))), p = v;
                    }
                } else {
                    s.push(n)
                }
            }
            return s
        },
        _parseDimensions: function() {
            for (var t, n, s, o, a = [], c = [], h = null, l = 0, u = 0, f = 0, d = 0, p = 0, g = 0, v = 0, b = this.path.length; b > v; ++v) {
                switch (t = this.path[v], t[0]) {
                    case"l":
                        f += t[1], d += t[2], o = [];
                        break;
                    case"L":
                        f = t[1], d = t[2], o = [];
                        break;
                    case"h":
                        f += t[1], o = [];
                        break;
                    case"H":
                        f = t[1], o = [];
                        break;
                    case"v":
                        d += t[1], o = [];
                        break;
                    case"V":
                        d = t[1], o = [];
                        break;
                    case"m":
                        f += t[1], d += t[2], l = f, u = d, o = [];
                        break;
                    case"M":
                        f = t[1], d = t[2], l = f, u = d, o = [];
                        break;
                    case"c":
                        n = f + t[5], s = d + t[6], p = f + t[3], g = d + t[4], o = e.util.getBoundsOfCurve(f, d, f + t[1], d + t[2], p, g, n, s), f = n, d = s;
                        break;
                    case"C":
                        p = t[3], g = t[4], o = e.util.getBoundsOfCurve(f, d, t[1], t[2], p, g, t[5], t[6]), f = t[5], d = t[6];
                        break;
                    case"s":
                        n = f + t[3], s = d + t[4], null === h[0].match(/[CcSs]/) ? (p = f, g = d) : (p = 2 * f - p, g = 2 * d - g), o = e.util.getBoundsOfCurve(f, d, p, g, f + t[1], d + t[2], n, s), p = f + t[1], g = d + t[2], f = n, d = s;
                        break;
                    case"S":
                        n = t[3], s = t[4], null === h[0].match(/[CcSs]/) ? (p = f, g = d) : (p = 2 * f - p, g = 2 * d - g), o = e.util.getBoundsOfCurve(f, d, p, g, t[1], t[2], n, s), f = n, d = s, p = t[1], g = t[2];
                        break;
                    case"q":
                        n = f + t[3], s = d + t[4], p = f + t[1], g = d + t[2], o = e.util.getBoundsOfCurve(f, d, p, g, p, g, n, s), f = n, d = s;
                        break;
                    case"Q":
                        p = t[1], g = t[2], o = e.util.getBoundsOfCurve(f, d, p, g, p, g, t[3], t[4]), f = t[3], d = t[4];
                        break;
                    case"t":
                        n = f + t[1], s = d + t[2], null === h[0].match(/[QqTt]/) ? (p = f, g = d) : (p = 2 * f - p, g = 2 * d - g), o = e.util.getBoundsOfCurve(f, d, p, g, p, g, n, s), f = n, d = s;
                        break;
                    case"T":
                        n = t[1], s = t[2], null === h[0].match(/[QqTt]/) ? (p = f, g = d) : (p = 2 * f - p, g = 2 * d - g), o = e.util.getBoundsOfCurve(f, d, p, g, p, g, n, s), f = n, d = s;
                        break;
                    case"a":
                        o = e.util.getBoundsOfArc(f, d, t[1], t[2], t[3], t[4], t[5], t[6] + f, t[7] + d), f += t[6], d += t[7];
                        break;
                    case"A":
                        o = e.util.getBoundsOfArc(f, d, t[1], t[2], t[3], t[4], t[5], t[6], t[7]), f = t[6], d = t[7];
                        break;
                    case"z":
                    case"Z":
                        f = l, d = u
                }
                h = t, o.forEach(function(t) {
                    a.push(t.x), c.push(t.y)
                }), a.push(f), c.push(d)
            }
            var m = i(a) || 0, y = i(c) || 0, _ = r(a) || 0, C = r(c) || 0, w = _ - m, x = C - y, O = {
                left: m,
                top: y,
                width: w,
                height: x
            };
            return O
        }
    }), e.Path.fromObject = function(t, i) {
        if ("string" == typeof t.sourcePath) {
            var r = t.sourcePath;
            e.loadSVGFromURL(r, function(e) {
                var r = e[0];
                r.setOptions(t), i && i(r)
            })
        } else {
            e.Object._fromObject("Path", t, i, "path")
        }
    }, e.Path.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(["d"]), void (e.Path.fromElement = function(t, i, r) {
        var s = e.parseAttributes(t, e.Path.ATTRIBUTE_NAMES);
        i(new e.Path(s.d, n(s, r)))
    }))
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.array.min, r = e.util.array.max;
    e.Group || (e.Group = e.util.createClass(e.Object, e.Collection, {
        type: "group",
        strokeWidth: 0,
        subTargetCheck: !1,
        cacheProperties: [],
        useSetOnGroup: !1,
        initialize: function(t, e, i) {
            e = e || {}, this._objects = [], i && this.callSuper("initialize", e), this._objects = t || [];
            for (var r = this._objects.length; r--;) {
                this._objects[r].group = this;
            }
            if (i) {
                this._updateObjectsACoords();
            } else {
                var n = e && e.centerPoint;
                void 0 !== e.originX && (this.originX = e.originX), void 0 !== e.originY && (this.originY = e.originY), n || this._calcBounds(), this._updateObjectsCoords(n), delete e.centerPoint, this.callSuper("initialize", e)
            }
            this.setCoords()
        },
        _updateObjectsACoords: function() {
            for (var t = !0, e = !0, i = this._objects.length; i--;) {
                this._objects[i].setCoords(t, e)
            }
        },
        _updateObjectsCoords: function(t) {
            for (var t = t || this.getCenterPoint(), e = this._objects.length; e--;) {
                this._updateObjectCoords(this._objects[e], t)
            }
        },
        _updateObjectCoords: function(t, e) {
            var i = t.left, r = t.top, n = !0, s = !0;
            t.set({
                left: i - e.x,
                top: r - e.y
            }), t.group = this, t.setCoords(n, s)
        },
        toString: function() {
            return "#<fabric.Group: (" + this.complexity() + ")>"
        },
        addWithUpdate: function(t) {
            return this._restoreObjectsState(), e.util.resetObjectTransform(this), t && (this._objects.push(t), t.group = this, t._set("canvas", this.canvas)), this._calcBounds(), this._updateObjectsCoords(), this.setCoords(), this.dirty = !0, this
        },
        removeWithUpdate: function(t) {
            return this._restoreObjectsState(), e.util.resetObjectTransform(this), this.remove(t), this._calcBounds(), this._updateObjectsCoords(), this.setCoords(), this.dirty = !0, this
        },
        _onObjectAdded: function(t) {
            this.dirty = !0, t.group = this, t._set("canvas", this.canvas)
        },
        _onObjectRemoved: function(t) {
            this.dirty = !0, delete t.group
        },
        _set: function(t, i) {
            var r = this._objects.length;
            if (this.useSetOnGroup) {
                for (; r--;) {
                    this._objects[r].setOnGroup(t, i);
                }
            }
            if ("canvas" === t) {
                for (; r--;) {
                    this._objects[r]._set(t, i);
                }
            }
            e.Object.prototype._set.call(this, t, i)
        },
        toObject: function(t) {
            var i = this.includeDefaultValues, r = this._objects.map(function(e) {
                var r = e.includeDefaultValues;
                e.includeDefaultValues = i;
                var n = e.toObject(t);
                return e.includeDefaultValues = r, n
            }), n = e.Object.prototype.toObject.call(this, t);
            return n.objects = r, n
        },
        toDatalessObject: function(t) {
            var i, r = this.sourcePath;
            if (r) {
                i = r;
            } else {
                var n = this.includeDefaultValues;
                i = this._objects.map(function(e) {
                    var i = e.includeDefaultValues;
                    e.includeDefaultValues = n;
                    var r = e.toDatalessObject(t);
                    return e.includeDefaultValues = i, r
                })
            }
            var s = e.Object.prototype.toDatalessObject.call(this, t);
            return s.objects = i, s
        },
        render: function(t) {
            this._transformDone = !0, this.callSuper("render", t), this._transformDone = !1
        },
        shouldCache: function() {
            var t = this.objectCaching && (!this.group || this.needsItsOwnCache() || !this.group.isOnACache());
            if (this.ownCaching = t, t) {
                for (var e = 0, i = this._objects.length; i > e; e++) {
                    if (this._objects[e].willDrawShadow()) {
                        return this.ownCaching = !1, !1;
                    }
                }
            }
            return t
        },
        willDrawShadow: function() {
            if (this.shadow) {
                return e.Object.prototype.willDrawShadow.call(this);
            }
            for (var t = 0, i = this._objects.length; i > t; t++) {
                if (this._objects[t].willDrawShadow()) {
                    return !0;
                }
            }
            return !1
        },
        isOnACache: function() {
            return this.ownCaching || this.group && this.group.isOnACache()
        },
        drawObject: function(t) {
            for (var e = 0, i = this._objects.length; i > e; e++) {
                this._objects[e].render(t);
            }
            this._drawClipPath(t)
        },
        isCacheDirty: function(t) {
            if (this.callSuper("isCacheDirty", t)) {
                return !0;
            }
            if (!this.statefullCache) {
                return !1;
            }
            for (var e = 0, i = this._objects.length; i > e; e++) {
                if (this._objects[e].isCacheDirty(!0)) {
                    if (this._cacheCanvas) {
                        var r = this.cacheWidth / this.zoomX, n = this.cacheHeight / this.zoomY;
                        this._cacheContext.clearRect(-r / 2, -n / 2, r, n)
                    }
                    return !0
                }
            }
            return !1
        },
        _restoreObjectsState: function() {
            return this._objects.forEach(this._restoreObjectState, this), this
        },
        realizeTransform: function(t) {
            var i = t.calcTransformMatrix(), r = e.util.qrDecompose(i), n = new e.Point(r.translateX, r.translateY);
            return t.flipX = !1, t.flipY = !1, t.set("scaleX", r.scaleX), t.set("scaleY", r.scaleY), t.skewX = r.skewX, t.skewY = r.skewY, t.angle = r.angle, t.setPositionByOrigin(n, "center", "center"), t
        },
        _restoreObjectState: function(t) {
            return this.realizeTransform(t), t.setCoords(), delete t.group, this
        },
        destroy: function() {
            return this._objects.forEach(function(t) {
                t.set("dirty", !0)
            }), this._restoreObjectsState()
        },
        toActiveSelection: function() {
            if (this.canvas) {
                var t = this._objects, i = this.canvas;
                this._objects = [];
                var r = this.toObject();
                delete r.objects;
                var n = new e.ActiveSelection([]);
                return n.set(r), n.type = "activeSelection", i.remove(this), t.forEach(function(t) {
                    t.group = n, t.dirty = !0, i.add(t)
                }), n.canvas = i, n._objects = t, i._activeObject = n, n.setCoords(), n
            }
        },
        ungroupOnCanvas: function() {
            return this._restoreObjectsState()
        },
        setObjectsCoords: function() {
            var t = !0, e = !0;
            return this.forEachObject(function(i) {
                i.setCoords(t, e)
            }), this
        },
        _calcBounds: function(t) {
            for (var e, i, r, n = [], s = [], o = ["tr", "br", "bl", "tl"], a = 0, c = this._objects.length, h = o.length, l = !0; c > a; ++a) {
                for (e = this._objects[a], e.setCoords(l), r = 0; h > r; r++) {
                    i = o[r], n.push(e.oCoords[i].x), s.push(e.oCoords[i].y);
                }
            }
            this._getBounds(n, s, t)
        },
        _getBounds: function(t, n, s) {
            var o = new e.Point(i(t), i(n)), a = new e.Point(r(t), r(n)), c = o.y || 0, h = o.x || 0,
                l = a.x - o.x || 0, u = a.y - o.y || 0;
            this.width = l, this.height = u, s || this.setPositionByOrigin({
                x: h,
                y: c
            }, "left", "top")
        },
        toSVG: function(t) {
            for (var e = [], i = 0, r = this._objects.length; r > i; i++) {
                e.push("	", this._objects[i].toSVG(t));
            }
            return this._createBaseSVGMarkup(e, {
                reviver: t,
                noStyle: !0,
                withShadow: !0
            })
        },
        toClipPathSVG: function(t) {
            for (var e = [], i = 0, r = this._objects.length; r > i; i++) {
                e.push("	", this._objects[i].toClipPathSVG(t));
            }
            return this._createBaseClipPathSVGMarkup(e, {reviver: t})
        }
    }), e.Group.fromObject = function(t, i) {
        e.util.enlivenObjects(t.objects, function(r) {
            var n = e.util.object.clone(t, !0);
            delete n.objects, i && i(new e.Group(r, n, !0))
        })
    })
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {});
    e.ActiveSelection || (e.ActiveSelection = e.util.createClass(e.Group, {
        type: "activeSelection",
        initialize: function(t, i) {
            i = i || {}, this._objects = t || [];
            for (var r = this._objects.length; r--;) {
                this._objects[r].group = this;
            }
            i.originX && (this.originX = i.originX), i.originY && (this.originY = i.originY), this._calcBounds(), this._updateObjectsCoords(), e.Object.prototype.initialize.call(this, i), this.setCoords()
        },
        toGroup: function() {
            var t = this._objects.concat();
            this._objects = [];
            var i = e.Object.prototype.toObject.call(this), r = new e.Group([]);
            if (delete i.type, r.set(i), t.forEach(function(t) {
                t.canvas.remove(t), t.group = r
            }), r._objects = t, !this.canvas) {
                return r;
            }
            var n = this.canvas;
            return n.add(r), n._activeObject = r, r.setCoords(), r
        },
        onDeselect: function() {
            return this.destroy(), !1
        },
        toString: function() {
            return "#<fabric.ActiveSelection: (" + this.complexity() + ")>"
        },
        shouldCache: function() {
            return !1
        },
        isOnACache: function() {
            return !1
        },
        _renderControls: function(t, e, i) {
            t.save(), t.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1, this.callSuper("_renderControls", t, e), i = i || {}, "undefined" == typeof i.hasControls && (i.hasControls = !1), "undefined" == typeof i.hasRotatingPoint && (i.hasRotatingPoint = !1), i.forActiveSelection = !0;
            for (var r = 0, n = this._objects.length; n > r; r++) {
                this._objects[r]._renderControls(t, i);
            }
            t.restore()
        }
    }), e.ActiveSelection.fromObject = function(t, i) {
        e.util.enlivenObjects(t.objects, function(r) {
            delete t.objects, i && i(new e.ActiveSelection(r, t, !0))
        })
    })
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = fabric.util.object.extend;
    return t.fabric || (t.fabric = {}), t.fabric.Image ? void fabric.warn("fabric.Image is already defined.") : (fabric.Image = fabric.util.createClass(fabric.Object, {
        type: "image",
        crossOrigin: "",
        strokeWidth: 0,
        _lastScaleX: 1,
        _lastScaleY: 1,
        _filterScalingX: 1,
        _filterScalingY: 1,
        minimumScaleTrigger: .5,
        stateProperties: fabric.Object.prototype.stateProperties.concat("cropX", "cropY"),
        cacheKey: "",
        cropX: 0,
        cropY: 0,
        initialize: function(t, e) {
            e || (e = {}), this.filters = [], this.cacheKey = "texture" + fabric.Object.__uid++, this.callSuper("initialize", e), this._initElement(t, e)
        },
        getElement: function() {
            return this._element || {}
        },
        setElement: function(t, e) {
            return this.removeTexture(this.cacheKey), this.removeTexture(this.cacheKey + "_filtered"), this._element = t, this._originalElement = t, this._initConfig(e), this.resizeFilter && this.applyResizeFilters(), 0 !== this.filters.length && this.applyFilters(), this
        },
        removeTexture: function(t) {
            var e = fabric.filterBackend;
            e && e.evictCachesForKey && e.evictCachesForKey(t)
        },
        dispose: function() {
            this.removeTexture(this.cacheKey), this.removeTexture(this.cacheKey + "_filtered"), this._cacheContext = void 0, ["_originalElement", "_element", "_filteredEl", "_cacheCanvas"].forEach(function(t) {
                fabric.util.cleanUpJsdomNode(this[t]), this[t] = void 0
            }.bind(this))
        },
        setCrossOrigin: function(t) {
            return this.crossOrigin = t, this._element.crossOrigin = t, this
        },
        getOriginalSize: function() {
            var t = this.getElement();
            return {
                width: t.naturalWidth || t.width,
                height: t.naturalHeight || t.height
            }
        },
        _stroke: function(t) {
            if (this.stroke && 0 !== this.strokeWidth) {
                var e = this.width / 2, i = this.height / 2;
                t.beginPath(), t.moveTo(-e, -i), t.lineTo(e, -i), t.lineTo(e, i), t.lineTo(-e, i), t.lineTo(-e, -i), t.closePath()
            }
        },
        _renderDashedStroke: function(t) {
            var e = -this.width / 2, i = -this.height / 2, r = this.width, n = this.height;
            t.save(), this._setStrokeStyles(t, this), t.beginPath(), fabric.util.drawDashedLine(t, e, i, e + r, i, this.strokeDashArray), fabric.util.drawDashedLine(t, e + r, i, e + r, i + n, this.strokeDashArray), fabric.util.drawDashedLine(t, e + r, i + n, e, i + n, this.strokeDashArray), fabric.util.drawDashedLine(t, e, i + n, e, i, this.strokeDashArray), t.closePath(), t.restore()
        },
        toObject: function(t) {
            var i = [];
            this.filters.forEach(function(t) {
                t && i.push(t.toObject())
            });
            var r = e(this.callSuper("toObject", ["crossOrigin", "cropX", "cropY"].concat(t)), {
                src: this.getSrc(),
                filters: i
            });
            return this.resizeFilter && (r.resizeFilter = this.resizeFilter.toObject()), r
        },
        hasCrop: function() {
            return this.cropX || this.cropY || this.width < this._element.width || this.height < this._element.height
        },
        _toSVG: function() {
            var t, e = [], i = [], r = -this.width / 2, n = -this.height / 2, s = "";
            if (this.hasCrop()) {
                var o = fabric.Object.__uid++;
                e.push('<clipPath id="imageCrop_' + o + '">\n', '	<rect x="' + r + '" y="' + n + '" width="' + this.width + '" height="' + this.height + '" />\n', "</clipPath>\n"), s = ' clip-path="url(#imageCrop_' + o + ')" '
            }
            if (i.push("	<image ", "COMMON_PARTS", 'xlink:href="', this.getSvgSrc(!0), '" x="', r - this.cropX, '" y="', n - this.cropY, '" width="', this._element.width || this._element.naturalWidth, '" height="', this._element.height || this._element.height, '"', s, "></image>\n"), this.stroke || this.strokeDashArray) {
                var a = this.fill;
                this.fill = null, t = ["	<rect ", 'x="', r, '" y="', n, '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '"/>\n'], this.fill = a
            }
            return e = "fill" !== this.paintFirst ? e.concat(t, i) : e.concat(i, t)
        },
        getSrc: function(t) {
            var e = t ? this._element : this._originalElement;
            return e ? e.toDataURL ? e.toDataURL() : e.src : this.src || ""
        },
        setSrc: function(t, e, i) {
            return fabric.util.loadImage(t, function(t) {
                this.setElement(t, i), this._setWidthHeight(), e(this)
            }, this, i && i.crossOrigin), this
        },
        toString: function() {
            return '#<fabric.Image: { src: "' + this.getSrc() + '" }>'
        },
        applyResizeFilters: function() {
            var t = this.resizeFilter, e = this.minimumScaleTrigger, i = this.getTotalObjectScaling(), r = i.scaleX,
                n = i.scaleY, s = this._filteredEl || this._originalElement;
            if (this.group && this.set("dirty", !0), !t || r > e && n > e) {
                return this._element = s, this._filterScalingX = 1, this._filterScalingY = 1, this._lastScaleX = r, void (this._lastScaleY = n);
            }
            fabric.filterBackend || (fabric.filterBackend = fabric.initFilterBackend());
            var o = fabric.util.createCanvasElement(),
                a = this._filteredEl ? this.cacheKey + "_filtered" : this.cacheKey, c = s.width, h = s.height;
            o.width = c, o.height = h, this._element = o, this._lastScaleX = t.scaleX = r, this._lastScaleY = t.scaleY = n, fabric.filterBackend.applyFilters([t], s, c, h, this._element, a), this._filterScalingX = o.width / this._originalElement.width, this._filterScalingY = o.height / this._originalElement.height
        },
        applyFilters: function(t) {
            if (t = t || this.filters || [], t = t.filter(function(t) {
                return t && !t.isNeutralState()
            }), this.set("dirty", !0), this.removeTexture(this.cacheKey + "_filtered"), 0 === t.length) {
                return this._element = this._originalElement, this._filteredEl = null, this._filterScalingX = 1, this._filterScalingY = 1, this;
            }
            var e = this._originalElement, i = e.naturalWidth || e.width, r = e.naturalHeight || e.height;
            if (this._element === this._originalElement) {
                var n = fabric.util.createCanvasElement();
                n.width = i, n.height = r, this._element = n, this._filteredEl = n
            } else {
                this._element = this._filteredEl, this._filteredEl.getContext("2d").clearRect(0, 0, i, r), this._lastScaleX = 1, this._lastScaleY = 1;
            }
            return fabric.filterBackend || (fabric.filterBackend = fabric.initFilterBackend()), fabric.filterBackend.applyFilters(t, this._originalElement, i, r, this._element, this.cacheKey), (this._originalElement.width !== this._element.width || this._originalElement.height !== this._element.height) && (this._filterScalingX = this._element.width / this._originalElement.width, this._filterScalingY = this._element.height / this._originalElement.height), this
        },
        _render: function(t) {
            this.isMoving !== !0 && this.resizeFilter && this._needsResize() && this.applyResizeFilters(), this._stroke(t), this._renderPaintInOrder(t)
        },
        shouldCache: function() {
            return this.ownCaching = this.objectCaching && this.needsItsOwnCache(), this.ownCaching
        },
        _renderFill: function(t) {
            var e = this.width, i = this.height, r = e * this._filterScalingX, n = i * this._filterScalingY, s = -e / 2,
                o = -i / 2, a = this._element;
            a && t.drawImage(a, this.cropX * this._filterScalingX, this.cropY * this._filterScalingY, r, n, s, o, e, i)
        },
        _needsResize: function() {
            var t = this.getTotalObjectScaling();
            return t.scaleX !== this._lastScaleX || t.scaleY !== this._lastScaleY
        },
        _resetWidthHeight: function() {
            this.set(this.getOriginalSize())
        },
        _initElement: function(t, e) {
            this.setElement(fabric.util.getById(t), e), fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS)
        },
        _initConfig: function(t) {
            t || (t = {}), this.setOptions(t), this._setWidthHeight(t), this._element && this.crossOrigin && (this._element.crossOrigin = this.crossOrigin)
        },
        _initFilters: function(t, e) {
            t && t.length ? fabric.util.enlivenObjects(t, function(t) {
                e && e(t)
            }, "fabric.Image.filters") : e && e()
        },
        _setWidthHeight: function(t) {
            t || (t = {});
            var e = this.getElement();
            this.width = t.width || e.naturalWidth || e.width || 0, this.height = t.height || e.naturalHeight || e.height || 0
        },
        parsePreserveAspectRatioAttribute: function() {
            var t, e = fabric.util.parsePreserveAspectRatioAttribute(this.preserveAspectRatio || ""),
                i = this._element.width, r = this._element.height, n = 1, s = 1, o = 0, a = 0, c = 0, h = 0,
                l = this.width, u = this.height, f = {
                    width: l,
                    height: u
                };
            return !e || "none" === e.alignX && "none" === e.alignY ? (n = l / i, s = u / r) : ("meet" === e.meetOrSlice && (n = s = fabric.util.findScaleToFit(this._element, f), t = (l - i * n) / 2, "Min" === e.alignX && (o = -t), "Max" === e.alignX && (o = t), t = (u - r * s) / 2, "Min" === e.alignY && (a = -t), "Max" === e.alignY && (a = t)), "slice" === e.meetOrSlice && (n = s = fabric.util.findScaleToCover(this._element, f), t = i - l / n, "Mid" === e.alignX && (c = t / 2), "Max" === e.alignX && (c = t), t = r - u / s, "Mid" === e.alignY && (h = t / 2), "Max" === e.alignY && (h = t), i = l / n, r = u / s)), {
                width: i,
                height: r,
                scaleX: n,
                scaleY: s,
                offsetLeft: o,
                offsetTop: a,
                cropX: c,
                cropY: h
            }
        }
    }), fabric.Image.CSS_CANVAS = "canvas-img", fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc, fabric.Image.fromObject = function(t, e) {
        var i = fabric.util.object.clone(t);
        fabric.util.loadImage(i.src, function(t, r) {
            return r ? void (e && e(null, r)) : void fabric.Image.prototype._initFilters.call(i, i.filters, function(r) {
                i.filters = r || [], fabric.Image.prototype._initFilters.call(i, [i.resizeFilter], function(r) {
                    i.resizeFilter = r[0], fabric.util.enlivenObjects([i.clipPath], function(r) {
                        i.clipPath = r[0];
                        var n = new fabric.Image(t, i);
                        e(n)
                    })
                })
            })
        }, null, i.crossOrigin)
    }, fabric.Image.fromURL = function(t, e, i) {
        fabric.util.loadImage(t, function(t) {
            e && e(new fabric.Image(t, i))
        }, null, i && i.crossOrigin)
    }, fabric.Image.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x y width height preserveAspectRatio xlink:href crossOrigin".split(" ")), void (fabric.Image.fromElement = function(t, i, r) {
        var n = fabric.parseAttributes(t, fabric.Image.ATTRIBUTE_NAMES);
        fabric.Image.fromURL(n["xlink:href"], i, e(r ? fabric.util.object.clone(r) : {}, n))
    }))
}("undefined" != typeof exports ? exports : this);
fabric.util.object.extend(fabric.Object.prototype, {
    _getAngleValueForStraighten: function() {
        var t = this.angle % 360;
        return t > 0 ? 90 * Math.round((t - 1) / 90) : 90 * Math.round(t / 90)
    },
    straighten: function() {
        return this.rotate(this._getAngleValueForStraighten()), this
    },
    fxStraighten: function(t) {
        t = t || {};
        var e = function() {
        }, i = t.onComplete || e, r = t.onChange || e, n = this;
        return fabric.util.animate({
            startValue: this.get("angle"),
            endValue: this._getAngleValueForStraighten(),
            duration: this.FX_DURATION,
            onChange: function(t) {
                n.rotate(t), r()
            },
            onComplete: function() {
                n.setCoords(), i()
            }
        }), this
    }
}), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    straightenObject: function(t) {
        return t.straighten(), this.requestRenderAll(), this
    },
    fxStraightenObject: function(t) {
        return t.fxStraighten({onChange: this.requestRenderAllBound}), this
    }
});

function resizeCanvasIfNeeded(t) {
    var e = t.targetCanvas, i = e.width, r = e.height, n = t.destinationWidth, s = t.destinationHeight;
    (i !== n || r !== s) && (e.width = n, e.height = s)
}

function copyGLTo2DDrawImage(t, e) {
    var i = t.canvas, r = e.targetCanvas, n = r.getContext("2d");
    n.translate(0, r.height), n.scale(1, -1);
    var s = i.height - r.height;
    n.drawImage(i, 0, s, r.width, r.height, 0, 0, r.width, r.height)
}

function copyGLTo2DPutImageData(t, e) {
    var i = e.targetCanvas, r = i.getContext("2d"), n = e.destinationWidth, s = e.destinationHeight, o = n * s * 4,
        a = new Uint8Array(this.imageBuffer, 0, o), c = new Uint8ClampedArray(this.imageBuffer, 0, o);
    t.readPixels(0, 0, n, s, t.RGBA, t.UNSIGNED_BYTE, a);
    var h = new ImageData(c, n, s);
    r.putImageData(h, 0, 0)
}

!function() {
    "use strict";

    function t(t, e) {
        var i = "precision " + e + " float;\nvoid main(){}", r = t.createShader(t.FRAGMENT_SHADER);
        return t.shaderSource(r, i), t.compileShader(r), t.getShaderParameter(r, t.COMPILE_STATUS) ? !0 : !1
    }

    function e(t) {
        t && t.tileSize && (this.tileSize = t.tileSize), this.setupGLContext(this.tileSize, this.tileSize), this.captureGPUInfo()
    }

    fabric.isWebglSupported = function(e) {
        if (fabric.isLikelyNode) {
            return !1;
        }
        e = e || fabric.WebglFilterBackend.prototype.tileSize;
        var i = document.createElement("canvas"), r = i.getContext("webgl") || i.getContext("experimental-webgl"),
            n = !1;
        if (r) {
            fabric.maxTextureSize = r.getParameter(r.MAX_TEXTURE_SIZE), n = fabric.maxTextureSize >= e;
            for (var s = ["highp", "mediump", "lowp"], o = 0; 3 > o; o++) {
                if (t(r, s[o])) {
                    fabric.webGlPrecision = s[o];
                    break
                }
            }
        }
        return this.isSupported = n, n
    }, fabric.WebglFilterBackend = e, e.prototype = {
        tileSize: 2048,
        resources: {},
        setupGLContext: function(t, e) {
            this.dispose(), this.createWebGLCanvas(t, e), this.aPosition = new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]), this.chooseFastestCopyGLTo2DMethod(t, e)
        },
        chooseFastestCopyGLTo2DMethod: function(t, e) {
            var i, r = "undefined" != typeof window.performance;
            try {
                new ImageData(1, 1), i = !0
            } catch (n) {
                i = !1
            }
            var s = "undefined" != typeof ArrayBuffer, o = "undefined" != typeof Uint8ClampedArray;
            if (r && i && s && o) {
                var a, c, h, l = fabric.util.createCanvasElement(), u = new ArrayBuffer(t * e * 4), f = {
                    imageBuffer: u,
                    destinationWidth: t,
                    destinationHeight: e,
                    targetCanvas: l
                };
                l.width = t, l.height = e, a = window.performance.now(), copyGLTo2DDrawImage.call(f, this.gl, f), c = window.performance.now() - a, a = window.performance.now(), copyGLTo2DPutImageData.call(f, this.gl, f), h = window.performance.now() - a, c > h ? (this.imageBuffer = u, this.copyGLTo2D = copyGLTo2DPutImageData) : this.copyGLTo2D = copyGLTo2DDrawImage
            }
        },
        createWebGLCanvas: function(t, e) {
            var i = fabric.util.createCanvasElement();
            i.width = t, i.height = e;
            var r = {
                alpha: !0,
                premultipliedAlpha: !1,
                depth: !1,
                stencil: !1,
                antialias: !1
            }, n = i.getContext("webgl", r);
            n || (n = i.getContext("experimental-webgl", r)), n && (n.clearColor(0, 0, 0, 0), this.canvas = i, this.gl = n)
        },
        applyFilters: function(t, e, i, r, n, s) {
            var o, a = this.gl;
            s && (o = this.getCachedTexture(s, e));
            var c = {
                originalWidth: e.width || e.originalWidth,
                originalHeight: e.height || e.originalHeight,
                sourceWidth: i,
                sourceHeight: r,
                destinationWidth: i,
                destinationHeight: r,
                context: a,
                sourceTexture: this.createTexture(a, i, r, !o && e),
                targetTexture: this.createTexture(a, i, r),
                originalTexture: o || this.createTexture(a, i, r, !o && e),
                passes: t.length,
                webgl: !0,
                aPosition: this.aPosition,
                programCache: this.programCache,
                pass: 0,
                filterBackend: this,
                targetCanvas: n
            }, h = a.createFramebuffer();
            return a.bindFramebuffer(a.FRAMEBUFFER, h), t.forEach(function(t) {
                t && t.applyTo(c)
            }), resizeCanvasIfNeeded(c), this.copyGLTo2D(a, c), a.bindTexture(a.TEXTURE_2D, null), a.deleteTexture(c.sourceTexture), a.deleteTexture(c.targetTexture), a.deleteFramebuffer(h), n.getContext("2d").setTransform(1, 0, 0, 1, 0, 0), c
        },
        applyFiltersDebug: function(t, e, i, r, n, s) {
            var o = this.gl, a = this.applyFilters(t, e, i, r, n, s), c = o.getError();
            if (c !== o.NO_ERROR) {
                var h = this.glErrorToString(o, c), l = new Error("WebGL Error " + h);
                throw l.glErrorCode = c, l
            }
            return a
        },
        glErrorToString: function(t, e) {
            if (!t) {
                return "Context undefined for error code: " + e;
            }
            if ("number" != typeof e) {
                return "Error code is not a number";
            }
            switch (e) {
                case t.NO_ERROR:
                    return "NO_ERROR";
                case t.INVALID_ENUM:
                    return "INVALID_ENUM";
                case t.INVALID_VALUE:
                    return "INVALID_VALUE";
                case t.INVALID_OPERATION:
                    return "INVALID_OPERATION";
                case t.INVALID_FRAMEBUFFER_OPERATION:
                    return "INVALID_FRAMEBUFFER_OPERATION";
                case t.OUT_OF_MEMORY:
                    return "OUT_OF_MEMORY";
                case t.CONTEXT_LOST_WEBGL:
                    return "CONTEXT_LOST_WEBGL";
                default:
                    return "UNKNOWN_ERROR"
            }
        },
        dispose: function() {
            this.canvas && (this.canvas = null, this.gl = null), this.clearWebGLCaches()
        },
        clearWebGLCaches: function() {
            this.programCache = {}, this.textureCache = {}
        },
        createTexture: function(t, e, i, r) {
            var n = t.createTexture();
            return t.bindTexture(t.TEXTURE_2D, n), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.NEAREST), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.NEAREST), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), r ? t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, r) : t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, e, i, 0, t.RGBA, t.UNSIGNED_BYTE, null), n
        },
        getCachedTexture: function(t, e) {
            if (this.textureCache[t]) {
                return this.textureCache[t];
            }
            var i = this.createTexture(this.gl, e.width, e.height, e);
            return this.textureCache[t] = i, i
        },
        evictCachesForKey: function(t) {
            this.textureCache[t] && (this.gl.deleteTexture(this.textureCache[t]), delete this.textureCache[t])
        },
        copyGLTo2D: copyGLTo2DDrawImage,
        captureGPUInfo: function() {
            if (this.gpuInfo) {
                return this.gpuInfo;
            }
            var t = this.gl, e = t.getExtension("WEBGL_debug_renderer_info"), i = {
                renderer: "",
                vendor: ""
            };
            if (e) {
                var r = t.getParameter(e.UNMASKED_RENDERER_WEBGL), n = t.getParameter(e.UNMASKED_VENDOR_WEBGL);
                r && (i.renderer = r.toLowerCase()), n && (i.vendor = n.toLowerCase())
            }
            return this.gpuInfo = i, i
        }
    }
}();
!function() {
    "use strict";

    function t() {
    }

    var e = function() {
    };
    fabric.Canvas2dFilterBackend = t, t.prototype = {
        evictCachesForKey: e,
        dispose: e,
        clearWebGLCaches: e,
        resources: {},
        applyFilters: function(t, e, i, r, n) {
            var s = n.getContext("2d");
            s.drawImage(e, 0, 0, i, r);
            var o = s.getImageData(0, 0, i, r), a = s.getImageData(0, 0, i, r), c = {
                sourceWidth: i,
                sourceHeight: r,
                imageData: o,
                originalEl: e,
                originalImageData: a,
                canvasEl: n,
                ctx: s,
                filterBackend: this
            };
            return t.forEach(function(t) {
                t.applyTo(c)
            }), (c.imageData.width !== i || c.imageData.height !== r) && (n.width = c.imageData.width, n.height = c.imageData.height), s.putImageData(c.imageData, 0, 0), c
        }
    }
}();
fabric.Image = fabric.Image || {}, fabric.Image.filters = fabric.Image.filters || {}, fabric.Image.filters.BaseFilter = fabric.util.createClass({
    type: "BaseFilter",
    vertexSource: "attribute vec2 aPosition;\nvarying vec2 vTexCoord;\nvoid main() {\nvTexCoord = aPosition;\ngl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n}",
    fragmentSource: "precision highp float;\nvarying vec2 vTexCoord;\nuniform sampler2D uTexture;\nvoid main() {\ngl_FragColor = texture2D(uTexture, vTexCoord);\n}",
    initialize: function(t) {
        t && this.setOptions(t)
    },
    setOptions: function(t) {
        for (var e in t) {
            this[e] = t[e]
        }
    },
    createProgram: function(t, e, i) {
        e = e || this.fragmentSource, i = i || this.vertexSource, "highp" !== fabric.webGlPrecision && (e = e.replace(/precision highp float/g, "precision " + fabric.webGlPrecision + " float"));
        var r = t.createShader(t.VERTEX_SHADER);
        if (t.shaderSource(r, i), t.compileShader(r), !t.getShaderParameter(r, t.COMPILE_STATUS)) {
            throw new Error("Vertex shader compile error for " + this.type + ": " + t.getShaderInfoLog(r));
        }
        var n = t.createShader(t.FRAGMENT_SHADER);
        if (t.shaderSource(n, e), t.compileShader(n), !t.getShaderParameter(n, t.COMPILE_STATUS)) {
            throw new Error("Fragment shader compile error for " + this.type + ": " + t.getShaderInfoLog(n));
        }
        var s = t.createProgram();
        if (t.attachShader(s, r), t.attachShader(s, n), t.linkProgram(s), !t.getProgramParameter(s, t.LINK_STATUS)) {
            throw new Error('Shader link error for "${this.type}" ' + t.getProgramInfoLog(s));
        }
        var o = this.getAttributeLocations(t, s), a = this.getUniformLocations(t, s) || {};
        return a.uStepW = t.getUniformLocation(s, "uStepW"), a.uStepH = t.getUniformLocation(s, "uStepH"), {
            program: s,
            attributeLocations: o,
            uniformLocations: a
        }
    },
    getAttributeLocations: function(t, e) {
        return {aPosition: t.getAttribLocation(e, "aPosition")}
    },
    getUniformLocations: function() {
        return {}
    },
    sendAttributeData: function(t, e, i) {
        var r = e.aPosition, n = t.createBuffer();
        t.bindBuffer(t.ARRAY_BUFFER, n), t.enableVertexAttribArray(r), t.vertexAttribPointer(r, 2, t.FLOAT, !1, 0, 0), t.bufferData(t.ARRAY_BUFFER, i, t.STATIC_DRAW)
    },
    _setupFrameBuffer: function(t) {
        var e, i, r = t.context;
        t.passes > 1 ? (e = t.destinationWidth, i = t.destinationHeight, (t.sourceWidth !== e || t.sourceHeight !== i) && (r.deleteTexture(t.targetTexture), t.targetTexture = t.filterBackend.createTexture(r, e, i)), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, t.targetTexture, 0)) : (r.bindFramebuffer(r.FRAMEBUFFER, null), r.finish())
    },
    _swapTextures: function(t) {
        t.passes--, t.pass++;
        var e = t.targetTexture;
        t.targetTexture = t.sourceTexture, t.sourceTexture = e
    },
    isNeutralState: function() {
        var t = this.mainParameter, e = fabric.Image.filters[this.type].prototype;
        if (t) {
            if (Array.isArray(e[t])) {
                for (var i = e[t].length; i--;) {
                    if (this[t][i] !== e[t][i]) {
                        return !1;
                    }
                }
                return !0
            }
            return e[t] === this[t]
        }
        return !1
    },
    applyTo: function(t) {
        t.webgl ? (this._setupFrameBuffer(t), this.applyToWebGL(t), this._swapTextures(t)) : this.applyTo2d(t)
    },
    retrieveShader: function(t) {
        return t.programCache.hasOwnProperty(this.type) || (t.programCache[this.type] = this.createProgram(t.context)), t.programCache[this.type]
    },
    applyToWebGL: function(t) {
        var e = t.context, i = this.retrieveShader(t);
        0 === t.pass && t.originalTexture ? e.bindTexture(e.TEXTURE_2D, t.originalTexture) : e.bindTexture(e.TEXTURE_2D, t.sourceTexture), e.useProgram(i.program), this.sendAttributeData(e, i.attributeLocations, t.aPosition), e.uniform1f(i.uniformLocations.uStepW, 1 / t.sourceWidth), e.uniform1f(i.uniformLocations.uStepH, 1 / t.sourceHeight), this.sendUniformData(e, i.uniformLocations), e.viewport(0, 0, t.destinationWidth, t.destinationHeight), e.drawArrays(e.TRIANGLE_STRIP, 0, 4)
    },
    bindAdditionalTexture: function(t, e, i) {
        t.activeTexture(i), t.bindTexture(t.TEXTURE_2D, e), t.activeTexture(t.TEXTURE0)
    },
    unbindAdditionalTexture: function(t, e) {
        t.activeTexture(e), t.bindTexture(t.TEXTURE_2D, null), t.activeTexture(t.TEXTURE0)
    },
    getMainParameter: function() {
        return this[this.mainParameter]
    },
    setMainParameter: function(t) {
        this[this.mainParameter] = t
    },
    sendUniformData: function() {
    },
    createHelpLayer: function(t) {
        if (!t.helpLayer) {
            var e = document.createElement("canvas");
            e.width = t.sourceWidth, e.height = t.sourceHeight, t.helpLayer = e
        }
    },
    toObject: function() {
        var t = {type: this.type}, e = this.mainParameter;
        return e && (t[e] = this[e]), t
    },
    toJSON: function() {
        return this.toObject()
    }
}), fabric.Image.filters.BaseFilter.fromObject = function(t, e) {
    var i = new fabric.Image.filters[t.type](t);
    return e && e(i), i
};
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, r = e.util.createClass;
    i.ColorMatrix = r(i.BaseFilter, {
        type: "ColorMatrix",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nvarying vec2 vTexCoord;\nuniform mat4 uColorMatrix;\nuniform vec4 uConstants;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor *= uColorMatrix;\ncolor += uConstants;\ngl_FragColor = color;\n}",
        matrix: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
        mainParameter: "matrix",
        colorsOnly: !0,
        initialize: function(t) {
            this.callSuper("initialize", t), this.matrix = this.matrix.slice(0)
        },
        applyTo2d: function(t) {
            var e, i, r, n, s, o = t.imageData, a = o.data, c = a.length, h = this.matrix, l = this.colorsOnly;
            for (s = 0; c > s; s += 4) {
                e = a[s], i = a[s + 1], r = a[s + 2], l ? (a[s] = e * h[0] + i * h[1] + r * h[2] + 255 * h[4], a[s + 1] = e * h[5] + i * h[6] + r * h[7] + 255 * h[9], a[s + 2] = e * h[10] + i * h[11] + r * h[12] + 255 * h[14]) : (n = a[s + 3], a[s] = e * h[0] + i * h[1] + r * h[2] + n * h[3] + 255 * h[4], a[s + 1] = e * h[5] + i * h[6] + r * h[7] + n * h[8] + 255 * h[9], a[s + 2] = e * h[10] + i * h[11] + r * h[12] + n * h[13] + 255 * h[14], a[s + 3] = e * h[15] + i * h[16] + r * h[17] + n * h[18] + 255 * h[19])
            }
        },
        getUniformLocations: function(t, e) {
            return {
                uColorMatrix: t.getUniformLocation(e, "uColorMatrix"),
                uConstants: t.getUniformLocation(e, "uConstants")
            }
        },
        sendUniformData: function(t, e) {
            var i = this.matrix,
                r = [i[0], i[1], i[2], i[3], i[5], i[6], i[7], i[8], i[10], i[11], i[12], i[13], i[15], i[16], i[17], i[18]],
                n = [i[4], i[9], i[14], i[19]];
            t.uniformMatrix4fv(e.uColorMatrix, !1, r), t.uniform4fv(e.uConstants, n)
        }
    }), e.Image.filters.ColorMatrix.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, r = e.util.createClass;
    i.Brightness = r(i.BaseFilter, {
        type: "Brightness",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uBrightness;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor.rgb += uBrightness;\ngl_FragColor = color;\n}",
        brightness: 0,
        mainParameter: "brightness",
        applyTo2d: function(t) {
            if (0 !== this.brightness) {
                var e, i = t.imageData, r = i.data, n = r.length, s = Math.round(255 * this.brightness);
                for (e = 0; n > e; e += 4) {
                    r[e] = r[e] + s, r[e + 1] = r[e + 1] + s, r[e + 2] = r[e + 2] + s
                }
            }
        },
        getUniformLocations: function(t, e) {
            return {uBrightness: t.getUniformLocation(e, "uBrightness")}
        },
        sendUniformData: function(t, e) {
            t.uniform1f(e.uBrightness, this.brightness)
        }
    }), e.Image.filters.Brightness.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.object.extend, r = e.Image.filters, n = e.util.createClass;
    r.Convolute = n(r.BaseFilter, {
        type: "Convolute",
        opaque: !1,
        matrix: [0, 0, 0, 0, 1, 0, 0, 0, 0],
        fragmentSource: {
            Convolute_3_1: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[9];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 3.0; h+=1.0) {\nfor (float w = 0.0; w < 3.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 1), uStepH * (h - 1));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 3.0 + w)];\n}\n}\ngl_FragColor = color;\n}",
            Convolute_3_0: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[9];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 3.0; h+=1.0) {\nfor (float w = 0.0; w < 3.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 1.0), uStepH * (h - 1.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 3.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}",
            Convolute_5_1: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[25];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 5.0; h+=1.0) {\nfor (float w = 0.0; w < 5.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 5.0 + w)];\n}\n}\ngl_FragColor = color;\n}",
            Convolute_5_0: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[25];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 5.0; h+=1.0) {\nfor (float w = 0.0; w < 5.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 5.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}",
            Convolute_7_1: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[49];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 7.0; h+=1.0) {\nfor (float w = 0.0; w < 7.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 7.0 + w)];\n}\n}\ngl_FragColor = color;\n}",
            Convolute_7_0: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[49];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 7.0; h+=1.0) {\nfor (float w = 0.0; w < 7.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 7.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}",
            Convolute_9_1: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[81];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 9.0; h+=1.0) {\nfor (float w = 0.0; w < 9.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 9.0 + w)];\n}\n}\ngl_FragColor = color;\n}",
            Convolute_9_0: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[81];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 9.0; h+=1.0) {\nfor (float w = 0.0; w < 9.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 9.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}"
        },
        retrieveShader: function(t) {
            var e = Math.sqrt(this.matrix.length), i = this.type + "_" + e + "_" + (this.opaque ? 1 : 0),
                r = this.fragmentSource[i];
            return t.programCache.hasOwnProperty(i) || (t.programCache[i] = this.createProgram(t.context, r)), t.programCache[i]
        },
        applyTo2d: function(t) {
            var e, i, r, n, s, o, a, c, h, l, u, f, d, g = t.imageData, p = g.data, v = this.matrix,
                b = Math.round(Math.sqrt(v.length)), m = Math.floor(b / 2), y = g.width, _ = g.height,
                C = t.ctx.createImageData(y, _), x = C.data, w = this.opaque ? 1 : 0;
            for (u = 0; _ > u; u++) {
                for (l = 0; y > l; l++) {
                    for (s = 4 * (u * y + l), e = 0, i = 0, r = 0, n = 0, d = 0; b > d; d++) {
                        for (f = 0; b > f; f++) {
                            a = u + d - m, o = l + f - m, 0 > a || a > _ || 0 > o || o > y || (c = 4 * (a * y + o), h = v[d * b + f], e += p[c] * h, i += p[c + 1] * h, r += p[c + 2] * h, w || (n += p[c + 3] * h));
                        }
                    }
                    x[s] = e, x[s + 1] = i, x[s + 2] = r, x[s + 3] = w ? p[s + 3] : n
                }
            }
            t.imageData = C
        },
        getUniformLocations: function(t, e) {
            return {
                uMatrix: t.getUniformLocation(e, "uMatrix"),
                uOpaque: t.getUniformLocation(e, "uOpaque"),
                uHalfSize: t.getUniformLocation(e, "uHalfSize"),
                uSize: t.getUniformLocation(e, "uSize")
            }
        },
        sendUniformData: function(t, e) {
            t.uniform1fv(e.uMatrix, this.matrix)
        },
        toObject: function() {
            return i(this.callSuper("toObject"), {
                opaque: this.opaque,
                matrix: this.matrix
            })
        }
    }), e.Image.filters.Convolute.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, r = e.util.createClass;
    i.Grayscale = r(i.BaseFilter, {
        type: "Grayscale",
        fragmentSource: {
            average: "precision highp float;\nuniform sampler2D uTexture;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat average = (color.r + color.b + color.g) / 3.0;\ngl_FragColor = vec4(average, average, average, color.a);\n}",
            lightness: "precision highp float;\nuniform sampler2D uTexture;\nuniform int uMode;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 col = texture2D(uTexture, vTexCoord);\nfloat average = (max(max(col.r, col.g),col.b) + min(min(col.r, col.g),col.b)) / 2.0;\ngl_FragColor = vec4(average, average, average, col.a);\n}",
            luminosity: "precision highp float;\nuniform sampler2D uTexture;\nuniform int uMode;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 col = texture2D(uTexture, vTexCoord);\nfloat average = 0.21 * col.r + 0.72 * col.g + 0.07 * col.b;\ngl_FragColor = vec4(average, average, average, col.a);\n}"
        },
        mode: "average",
        mainParameter: "mode",
        applyTo2d: function(t) {
            var e, i, r = t.imageData, n = r.data, s = n.length, o = this.mode;
            for (e = 0; s > e; e += 4) {
                "average" === o ? i = (n[e] + n[e + 1] + n[e + 2]) / 3 : "lightness" === o ? i = (Math.min(n[e], n[e + 1], n[e + 2]) + Math.max(n[e], n[e + 1], n[e + 2])) / 2 : "luminosity" === o && (i = .21 * n[e] + .72 * n[e + 1] + .07 * n[e + 2]), n[e] = i, n[e + 1] = i, n[e + 2] = i
            }
        },
        retrieveShader: function(t) {
            var e = this.type + "_" + this.mode;
            if (!t.programCache.hasOwnProperty(e)) {
                var i = this.fragmentSource[this.mode];
                t.programCache[e] = this.createProgram(t.context, i)
            }
            return t.programCache[e]
        },
        getUniformLocations: function(t, e) {
            return {uMode: t.getUniformLocation(e, "uMode")}
        },
        sendUniformData: function(t, e) {
            var i = 1;
            t.uniform1i(e.uMode, i)
        },
        isNeutralState: function() {
            return !1
        }
    }), e.Image.filters.Grayscale.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, r = e.util.createClass;
    i.Invert = r(i.BaseFilter, {
        type: "Invert",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform int uInvert;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nif (uInvert == 1) {\ngl_FragColor = vec4(1.0 - color.r,1.0 -color.g,1.0 -color.b,color.a);\n} else {\ngl_FragColor = color;\n}\n}",
        invert: !0,
        mainParameter: "invert",
        applyTo2d: function(t) {
            var e, i = t.imageData, r = i.data, n = r.length;
            for (e = 0; n > e; e += 4) {
                r[e] = 255 - r[e], r[e + 1] = 255 - r[e + 1], r[e + 2] = 255 - r[e + 2]
            }
        },
        isNeutralState: function() {
            return !this.invert
        },
        getUniformLocations: function(t, e) {
            return {uInvert: t.getUniformLocation(e, "uInvert")}
        },
        sendUniformData: function(t, e) {
            t.uniform1i(e.uInvert, this.invert)
        }
    }), e.Image.filters.Invert.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.object.extend, r = e.Image.filters, n = e.util.createClass;
    r.Noise = n(r.BaseFilter, {
        type: "Noise",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uStepH;\nuniform float uNoise;\nuniform float uSeed;\nvarying vec2 vTexCoord;\nfloat rand(vec2 co, float seed, float vScale) {\nreturn fract(sin(dot(co.xy * vScale ,vec2(12.9898 , 78.233))) * 43758.5453 * (seed + 0.01) / 2.0);\n}\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor.rgb += (0.5 - rand(vTexCoord, uSeed, 0.1 / uStepH)) * uNoise;\ngl_FragColor = color;\n}",
        mainParameter: "noise",
        noise: 0,
        applyTo2d: function(t) {
            if (0 !== this.noise) {
                var e, i, r = t.imageData, n = r.data, s = n.length, o = this.noise;
                for (e = 0, s = n.length; s > e; e += 4) {
                    i = (.5 - Math.random()) * o, n[e] += i, n[e + 1] += i, n[e + 2] += i
                }
            }
        },
        getUniformLocations: function(t, e) {
            return {
                uNoise: t.getUniformLocation(e, "uNoise"),
                uSeed: t.getUniformLocation(e, "uSeed")
            }
        },
        sendUniformData: function(t, e) {
            t.uniform1f(e.uNoise, this.noise / 255), t.uniform1f(e.uSeed, Math.random())
        },
        toObject: function() {
            return i(this.callSuper("toObject"), {noise: this.noise})
        }
    }), e.Image.filters.Noise.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, r = e.util.createClass;
    i.Pixelate = r(i.BaseFilter, {
        type: "Pixelate",
        blocksize: 4,
        mainParameter: "blocksize",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uBlocksize;\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nfloat blockW = uBlocksize * uStepW;\nfloat blockH = uBlocksize * uStepW;\nint posX = int(vTexCoord.x / blockW);\nint posY = int(vTexCoord.y / blockH);\nfloat fposX = float(posX);\nfloat fposY = float(posY);\nvec2 squareCoords = vec2(fposX * blockW, fposY * blockH);\nvec4 color = texture2D(uTexture, squareCoords);\ngl_FragColor = color;\n}",
        applyTo2d: function(t) {
            var e, i, r, n, s, o, a, c, h, l, u, f = t.imageData, d = f.data, g = f.height, p = f.width;
            for (i = 0; g > i; i += this.blocksize) {
                for (r = 0; p > r; r += this.blocksize) {
                    for (e = 4 * i * p + 4 * r, n = d[e], s = d[e + 1], o = d[e + 2], a = d[e + 3], l = Math.min(i + this.blocksize, g), u = Math.min(r + this.blocksize, p), c = i; l > c; c++) {
                        for (h = r; u > h; h++) {
                            e = 4 * c * p + 4 * h, d[e] = n, d[e + 1] = s, d[e + 2] = o, d[e + 3] = a
                        }
                    }
                }
            }
        },
        isNeutralState: function() {
            return 1 === this.blocksize
        },
        getUniformLocations: function(t, e) {
            return {
                uBlocksize: t.getUniformLocation(e, "uBlocksize"),
                uStepW: t.getUniformLocation(e, "uStepW"),
                uStepH: t.getUniformLocation(e, "uStepH")
            }
        },
        sendUniformData: function(t, e) {
            t.uniform1f(e.uBlocksize, this.blocksize)
        }
    }), e.Image.filters.Pixelate.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.object.extend, r = e.Image.filters, n = e.util.createClass;
    r.RemoveColor = n(r.BaseFilter, {
        type: "RemoveColor",
        color: "#FFFFFF",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform vec4 uLow;\nuniform vec4 uHigh;\nvarying vec2 vTexCoord;\nvoid main() {\ngl_FragColor = texture2D(uTexture, vTexCoord);\nif(all(greaterThan(gl_FragColor.rgb,uLow.rgb)) && all(greaterThan(uHigh.rgb,gl_FragColor.rgb))) {\ngl_FragColor.a = 0.0;\n}\n}",
        distance: .02,
        useAlpha: !1,
        applyTo2d: function(t) {
            var i, r, n, o, s = t.imageData, a = s.data, c = 255 * this.distance,
                h = new e.Color(this.color).getSource(), l = [h[0] - c, h[1] - c, h[2] - c],
                u = [h[0] + c, h[1] + c, h[2] + c];
            for (i = 0; i < a.length; i += 4) {
                r = a[i], n = a[i + 1], o = a[i + 2], r > l[0] && n > l[1] && o > l[2] && r < u[0] && n < u[1] && o < u[2] && (a[i + 3] = 0)
            }
        },
        getUniformLocations: function(t, e) {
            return {
                uLow: t.getUniformLocation(e, "uLow"),
                uHigh: t.getUniformLocation(e, "uHigh")
            }
        },
        sendUniformData: function(t, i) {
            var r = new e.Color(this.color).getSource(), n = parseFloat(this.distance),
                o = [0 + r[0] / 255 - n, 0 + r[1] / 255 - n, 0 + r[2] / 255 - n, 1],
                s = [r[0] / 255 + n, r[1] / 255 + n, r[2] / 255 + n, 1];
            t.uniform4fv(i.uLow, o), t.uniform4fv(i.uHigh, s)
        },
        toObject: function() {
            return i(this.callSuper("toObject"), {
                color: this.color,
                distance: this.distance
            })
        }
    }), e.Image.filters.RemoveColor.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, r = e.util.createClass, n = {
        Brownie: [.5997, .34553, -.27082, 0, .186, -.0377, .86095, .15059, 0, -.1449, .24113, -.07441, .44972, 0, -.02965, 0, 0, 0, 1, 0],
        Vintage: [.62793, .32021, -.03965, 0, .03784, .02578, .64411, .03259, 0, .02926, .0466, -.08512, .52416, 0, .02023, 0, 0, 0, 1, 0],
        Kodachrome: [1.12855, -.39673, -.03992, 0, .24991, -.16404, 1.08352, -.05498, 0, .09698, -.16786, -.56034, 1.60148, 0, .13972, 0, 0, 0, 1, 0],
        Technicolor: [1.91252, -.85453, -.09155, 0, .04624, -.30878, 1.76589, -.10601, 0, -.27589, -.2311, -.75018, 1.84759, 0, .12137, 0, 0, 0, 1, 0],
        Polaroid: [1.438, -.062, -.062, 0, 0, -.122, 1.378, -.122, 0, 0, -.016, -.016, 1.483, 0, 0, 0, 0, 0, 1, 0],
        Sepia: [.393, .769, .189, 0, 0, .349, .686, .168, 0, 0, .272, .534, .131, 0, 0, 0, 0, 0, 1, 0],
        BlackWhite: [1.5, 1.5, 1.5, 0, -1, 1.5, 1.5, 1.5, 0, -1, 1.5, 1.5, 1.5, 0, -1, 0, 0, 0, 1, 0]
    };
    for (var o in n) {
        i[o] = r(i.ColorMatrix, {
            type: o,
            matrix: n[o],
            mainParameter: !1,
            colorsOnly: !0
        }), e.Image.filters[o].fromObject = e.Image.filters.BaseFilter.fromObject
    }
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric, i = e.Image.filters, r = e.util.createClass;
    i.BlendColor = r(i.BaseFilter, {
        type: "BlendColor",
        color: "#F95C63",
        mode: "multiply",
        alpha: 1,
        fragmentSource: {
            multiply: "gl_FragColor.rgb *= uColor.rgb;\n",
            screen: "gl_FragColor.rgb = 1.0 - (1.0 - gl_FragColor.rgb) * (1.0 - uColor.rgb);\n",
            add: "gl_FragColor.rgb += uColor.rgb;\n",
            diff: "gl_FragColor.rgb = abs(gl_FragColor.rgb - uColor.rgb);\n",
            subtract: "gl_FragColor.rgb -= uColor.rgb;\n",
            lighten: "gl_FragColor.rgb = max(gl_FragColor.rgb, uColor.rgb);\n",
            darken: "gl_FragColor.rgb = min(gl_FragColor.rgb, uColor.rgb);\n",
            exclusion: "gl_FragColor.rgb += uColor.rgb - 2.0 * (uColor.rgb * gl_FragColor.rgb);\n",
            overlay: "if (uColor.r < 0.5) {\ngl_FragColor.r *= 2.0 * uColor.r;\n} else {\ngl_FragColor.r = 1.0 - 2.0 * (1.0 - gl_FragColor.r) * (1.0 - uColor.r);\n}\nif (uColor.g < 0.5) {\ngl_FragColor.g *= 2.0 * uColor.g;\n} else {\ngl_FragColor.g = 1.0 - 2.0 * (1.0 - gl_FragColor.g) * (1.0 - uColor.g);\n}\nif (uColor.b < 0.5) {\ngl_FragColor.b *= 2.0 * uColor.b;\n} else {\ngl_FragColor.b = 1.0 - 2.0 * (1.0 - gl_FragColor.b) * (1.0 - uColor.b);\n}\n",
            tint: "gl_FragColor.rgb *= (1.0 - uColor.a);\ngl_FragColor.rgb += uColor.rgb;\n"
        },
        buildSource: function(t) {
            return "precision highp float;\nuniform sampler2D uTexture;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ngl_FragColor = color;\nif (color.a > 0.0) {\n" + this.fragmentSource[t] + "}\n}"
        },
        retrieveShader: function(t) {
            var e, i = this.type + "_" + this.mode;
            return t.programCache.hasOwnProperty(i) || (e = this.buildSource(this.mode), t.programCache[i] = this.createProgram(t.context, e)), t.programCache[i]
        },
        applyTo2d: function(t) {
            var i, r, n, o, s, a, c, h = t.imageData, l = h.data, u = l.length, f = 1 - this.alpha;
            c = new e.Color(this.color).getSource(), i = c[0] * this.alpha, r = c[1] * this.alpha, n = c[2] * this.alpha;
            for (var d = 0; u > d; d += 4) {
                switch (o = l[d], s = l[d + 1], a = l[d + 2], this.mode) {
                    case"multiply":
                        l[d] = o * i / 255, l[d + 1] = s * r / 255, l[d + 2] = a * n / 255;
                        break;
                    case"screen":
                        l[d] = 255 - (255 - o) * (255 - i) / 255, l[d + 1] = 255 - (255 - s) * (255 - r) / 255, l[d + 2] = 255 - (255 - a) * (255 - n) / 255;
                        break;
                    case"add":
                        l[d] = o + i, l[d + 1] = s + r, l[d + 2] = a + n;
                        break;
                    case"diff":
                    case"difference":
                        l[d] = Math.abs(o - i), l[d + 1] = Math.abs(s - r), l[d + 2] = Math.abs(a - n);
                        break;
                    case"subtract":
                        l[d] = o - i, l[d + 1] = s - r, l[d + 2] = a - n;
                        break;
                    case"darken":
                        l[d] = Math.min(o, i), l[d + 1] = Math.min(s, r), l[d + 2] = Math.min(a, n);
                        break;
                    case"lighten":
                        l[d] = Math.max(o, i), l[d + 1] = Math.max(s, r), l[d + 2] = Math.max(a, n);
                        break;
                    case"overlay":
                        l[d] = 128 > i ? 2 * o * i / 255 : 255 - 2 * (255 - o) * (255 - i) / 255, l[d + 1] = 128 > r ? 2 * s * r / 255 : 255 - 2 * (255 - s) * (255 - r) / 255, l[d + 2] = 128 > n ? 2 * a * n / 255 : 255 - 2 * (255 - a) * (255 - n) / 255;
                        break;
                    case"exclusion":
                        l[d] = i + o - 2 * i * o / 255, l[d + 1] = r + s - 2 * r * s / 255, l[d + 2] = n + a - 2 * n * a / 255;
                        break;
                    case"tint":
                        l[d] = i + o * f, l[d + 1] = r + s * f, l[d + 2] = n + a * f
                }
            }
        },
        getUniformLocations: function(t, e) {
            return {uColor: t.getUniformLocation(e, "uColor")}
        },
        sendUniformData: function(t, i) {
            var r = new e.Color(this.color).getSource();
            r[0] = this.alpha * r[0] / 255, r[1] = this.alpha * r[1] / 255, r[2] = this.alpha * r[2] / 255, r[3] = this.alpha, t.uniform4fv(i.uColor, r)
        },
        toObject: function() {
            return {
                type: this.type,
                color: this.color,
                mode: this.mode,
                alpha: this.alpha
            }
        }
    }), e.Image.filters.BlendColor.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric, i = e.Image.filters, r = e.util.createClass;
    i.BlendImage = r(i.BaseFilter, {
        type: "BlendImage",
        image: null,
        mode: "multiply",
        alpha: 1,
        vertexSource: "attribute vec2 aPosition;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nuniform mat3 uTransformMatrix;\nvoid main() {\nvTexCoord = aPosition;\nvTexCoord2 = (uTransformMatrix * vec3(aPosition, 1.0)).xy;\ngl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n}",
        fragmentSource: {
            multiply: "precision highp float;\nuniform sampler2D uTexture;\nuniform sampler2D uImage;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec4 color2 = texture2D(uImage, vTexCoord2);\ncolor.rgba *= color2.rgba;\ngl_FragColor = color;\n}",
            mask: "precision highp float;\nuniform sampler2D uTexture;\nuniform sampler2D uImage;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec4 color2 = texture2D(uImage, vTexCoord2);\ncolor.a = color2.a;\ngl_FragColor = color;\n}"
        },
        retrieveShader: function(t) {
            var e = this.type + "_" + this.mode, i = this.fragmentSource[this.mode];
            return t.programCache.hasOwnProperty(e) || (t.programCache[e] = this.createProgram(t.context, i)), t.programCache[e]
        },
        applyToWebGL: function(t) {
            var e = t.context, i = this.createTexture(t.filterBackend, this.image);
            this.bindAdditionalTexture(e, i, e.TEXTURE1), this.callSuper("applyToWebGL", t), this.unbindAdditionalTexture(e, e.TEXTURE1)
        },
        createTexture: function(t, e) {
            return t.getCachedTexture(e.cacheKey, e._element)
        },
        calculateMatrix: function() {
            var t = this.image, e = t._element.width, i = t._element.height;
            return [1 / t.scaleX, 0, 0, 0, 1 / t.scaleY, 0, -t.left / e, -t.top / i, 1]
        },
        applyTo2d: function(t) {
            var i, r, n, o, s, a, c, h, l, u, f, d = t.imageData, g = t.filterBackend.resources, p = d.data,
                v = p.length, m = d.width, b = d.height, y = this.image;
            g.blendImage || (g.blendImage = e.util.createCanvasElement()), l = g.blendImage, u = l.getContext("2d"), l.width !== m || l.height !== b ? (l.width = m, l.height = b) : u.clearRect(0, 0, m, b), u.setTransform(y.scaleX, 0, 0, y.scaleY, y.left, y.top), u.drawImage(y._element, 0, 0, m, b), f = u.getImageData(0, 0, m, b).data;
            for (var _ = 0; v > _; _ += 4) {
                switch (s = p[_], a = p[_ + 1], c = p[_ + 2], h = p[_ + 3], i = f[_], r = f[_ + 1], n = f[_ + 2], o = f[_ + 3], this.mode) {
                    case"multiply":
                        p[_] = s * i / 255, p[_ + 1] = a * r / 255, p[_ + 2] = c * n / 255, p[_ + 3] = h * o / 255;
                        break;
                    case"mask":
                        p[_ + 3] = o
                }
            }
        },
        getUniformLocations: function(t, e) {
            return {
                uTransformMatrix: t.getUniformLocation(e, "uTransformMatrix"),
                uImage: t.getUniformLocation(e, "uImage")
            }
        },
        sendUniformData: function(t, e) {
            var i = this.calculateMatrix();
            t.uniform1i(e.uImage, 1), t.uniformMatrix3fv(e.uTransformMatrix, !1, i)
        },
        toObject: function() {
            return {
                type: this.type,
                image: this.image && this.image.toObject(),
                mode: this.mode,
                alpha: this.alpha
            }
        }
    }), e.Image.filters.BlendImage.fromObject = function(t, i) {
        e.Image.fromObject(t.image, function(r) {
            var n = e.util.object.clone(t);
            n.image = r, i(new e.Image.filters.BlendImage(n))
        })
    }
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = Math.pow, r = Math.floor, n = Math.sqrt, o = Math.abs, s = Math.round,
        a = Math.sin, c = Math.ceil, h = e.Image.filters, l = e.util.createClass;
    h.Resize = l(h.BaseFilter, {
        type: "Resize",
        resizeType: "hermite",
        scaleX: 1,
        scaleY: 1,
        lanczosLobes: 3,
        getUniformLocations: function(t, e) {
            return {
                uDelta: t.getUniformLocation(e, "uDelta"),
                uTaps: t.getUniformLocation(e, "uTaps")
            }
        },
        sendUniformData: function(t, e) {
            t.uniform2fv(e.uDelta, this.horizontal ? [1 / this.width, 0] : [0, 1 / this.height]), t.uniform1fv(e.uTaps, this.taps)
        },
        retrieveShader: function(t) {
            var e = this.getFilterWindow(), i = this.type + "_" + e;
            if (!t.programCache.hasOwnProperty(i)) {
                var r = this.generateShader(e);
                t.programCache[i] = this.createProgram(t.context, r)
            }
            return t.programCache[i]
        },
        getFilterWindow: function() {
            var t = this.tempScale;
            return Math.ceil(this.lanczosLobes / t)
        },
        getTaps: function() {
            for (var t = this.lanczosCreate(this.lanczosLobes), e = this.tempScale, i = this.getFilterWindow(), r = new Array(i), n = 1; i >= n; n++) {
                r[n - 1] = t(n * e);
            }
            return r
        },
        generateShader: function(t) {
            for (var t, e = new Array(t), i = this.fragmentSourceTOP, r = 1; t >= r; r++) {
                e[r - 1] = r + ".0 * uDelta";
            }
            return i += "uniform float uTaps[" + t + "];\n", i += "void main() {\n", i += "  vec4 color = texture2D(uTexture, vTexCoord);\n", i += "  float sum = 1.0;\n", e.forEach(function(t, e) {
                i += "  color += texture2D(uTexture, vTexCoord + " + t + ") * uTaps[" + e + "];\n", i += "  color += texture2D(uTexture, vTexCoord - " + t + ") * uTaps[" + e + "];\n", i += "  sum += 2.0 * uTaps[" + e + "];\n"
            }), i += "  gl_FragColor = color / sum;\n", i += "}"
        },
        fragmentSourceTOP: "precision highp float;\nuniform sampler2D uTexture;\nuniform vec2 uDelta;\nvarying vec2 vTexCoord;\n",
        applyTo: function(t) {
            t.webgl ? (t.passes++, this.width = t.sourceWidth, this.horizontal = !0, this.dW = Math.round(this.width * this.scaleX), this.dH = t.sourceHeight, this.tempScale = this.dW / this.width, this.taps = this.getTaps(), t.destinationWidth = this.dW, this._setupFrameBuffer(t), this.applyToWebGL(t), this._swapTextures(t), t.sourceWidth = t.destinationWidth, this.height = t.sourceHeight, this.horizontal = !1, this.dH = Math.round(this.height * this.scaleY), this.tempScale = this.dH / this.height, this.taps = this.getTaps(), t.destinationHeight = this.dH, this._setupFrameBuffer(t), this.applyToWebGL(t), this._swapTextures(t), t.sourceHeight = t.destinationHeight) : this.applyTo2d(t)
        },
        isNeutralState: function() {
            return 1 === this.scaleX && 1 === this.scaleY
        },
        lanczosCreate: function(t) {
            return function(e) {
                if (e >= t || -t >= e) {
                    return 0;
                }
                if (1.1920929e-7 > e && e > -1.1920929e-7) {
                    return 1;
                }
                e *= Math.PI;
                var i = e / t;
                return a(e) / e * a(i) / i
            }
        },
        applyTo2d: function(t) {
            var e = t.imageData, i = this.scaleX, r = this.scaleY;
            this.rcpScaleX = 1 / i, this.rcpScaleY = 1 / r;
            var n, o = e.width, a = e.height, c = s(o * i), h = s(a * r);
            "sliceHack" === this.resizeType ? n = this.sliceByTwo(t, o, a, c, h) : "hermite" === this.resizeType ? n = this.hermiteFastResize(t, o, a, c, h) : "bilinear" === this.resizeType ? n = this.bilinearFiltering(t, o, a, c, h) : "lanczos" === this.resizeType && (n = this.lanczosResize(t, o, a, c, h)), t.imageData = n
        },
        sliceByTwo: function(t, i, n, o, s) {
            var a, c, h = t.imageData, l = .5, u = !1, f = !1, d = i * l, g = n * l, p = e.filterBackend.resources,
                v = 0, m = 0, b = i, y = 0;
            for (p.sliceByTwo || (p.sliceByTwo = document.createElement("canvas")), a = p.sliceByTwo, (a.width < 1.5 * i || a.height < n) && (a.width = 1.5 * i, a.height = n), c = a.getContext("2d"), c.clearRect(0, 0, 1.5 * i, n), c.putImageData(h, 0, 0), o = r(o), s = r(s); !u || !f;) {
                i = d, n = g, o < r(d * l) ? d = r(d * l) : (d = o, u = !0), s < r(g * l) ? g = r(g * l) : (g = s, f = !0), c.drawImage(a, v, m, i, n, b, y, d, g), v = b, m = y, y += g;
            }
            return c.getImageData(v, m, o, s)
        },
        lanczosResize: function(t, e, s, a, h) {
            function l(t) {
                var c, S, T, O, P, j, k, E, D, A, F;
                for (x.x = (t + .5) * p, w.x = r(x.x), c = 0; h > c; c++) {
                    for (x.y = (c + .5) * v, w.y = r(x.y), P = 0, j = 0, k = 0, E = 0, D = 0, S = w.x - y; S <= w.x + y; S++) {
                        if (!(0 > S || S >= e)) {
                            A = r(1e3 * o(S - x.x)), C[A] || (C[A] = {});
                            for (var M = w.y - _; M <= w.y + _; M++) {
                                0 > M || M >= s || (F = r(1e3 * o(M - x.y)), C[A][F] || (C[A][F] = g(n(i(A * m, 2) + i(F * b, 2)) / 1e3)), T = C[A][F], T > 0 && (O = 4 * (M * e + S), P += T, j += T * u[O], k += T * u[O + 1], E += T * u[O + 2], D += T * u[O + 3]))
                            }
                        }
                    }
                    O = 4 * (c * a + t), d[O] = j / P, d[O + 1] = k / P, d[O + 2] = E / P, d[O + 3] = D / P
                }
                return ++t < a ? l(t) : f
            }

            var u = t.imageData.data, f = t.ctx.createImageData(a, h), d = f.data,
                g = this.lanczosCreate(this.lanczosLobes), p = this.rcpScaleX, v = this.rcpScaleY,
                m = 2 / this.rcpScaleX, b = 2 / this.rcpScaleY, y = c(p * this.lanczosLobes / 2),
                _ = c(v * this.lanczosLobes / 2), C = {}, x = {}, w = {};
            return l(0)
        },
        bilinearFiltering: function(t, e, i, n, o) {
            var s, a, c, h, l, u, f, d, g, p, v, m, b, y = 0, _ = this.rcpScaleX, C = this.rcpScaleY, x = 4 * (e - 1),
                w = t.imageData, S = w.data, T = t.ctx.createImageData(n, o), O = T.data;
            for (f = 0; o > f; f++) {
                for (d = 0; n > d; d++) {
                    for (l = r(_ * d), u = r(C * f), g = _ * d - l, p = C * f - u, b = 4 * (u * e + l), v = 0; 4 > v; v++) {
                        s = S[b + v], a = S[b + 4 + v], c = S[b + x + v], h = S[b + x + 4 + v], m = s * (1 - g) * (1 - p) + a * g * (1 - p) + c * p * (1 - g) + h * g * p, O[y++] = m;
                    }
                }
            }
            return T
        },
        hermiteFastResize: function(t, e, i, s, a) {
            for (var h = this.rcpScaleX, l = this.rcpScaleY, u = c(h / 2), f = c(l / 2), d = t.imageData, g = d.data, p = t.ctx.createImageData(s, a), v = p.data, m = 0; a > m; m++) {
                for (var b = 0; s > b; b++) {
                    for (var y = 4 * (b + m * s), _ = 0, C = 0, x = 0, w = 0, S = 0, T = 0, O = 0, P = (m + .5) * l, j = r(m * l); (m + 1) * l > j; j++) {
                        for (var k = o(P - (j + .5)) / f, E = (b + .5) * h, D = k * k, A = r(b * h); (b + 1) * h > A; A++) {
                            var F = o(E - (A + .5)) / u, M = n(D + F * F);
                            M > 1 && -1 > M || (_ = 2 * M * M * M - 3 * M * M + 1, _ > 0 && (F = 4 * (A + j * e), O += _ * g[F + 3], x += _, g[F + 3] < 255 && (_ = _ * g[F + 3] / 250), w += _ * g[F], S += _ * g[F + 1], T += _ * g[F + 2], C += _))
                        }
                    }
                    v[y] = w / C, v[y + 1] = S / C, v[y + 2] = T / C, v[y + 3] = O / x
                }
            }
            return p
        },
        toObject: function() {
            return {
                type: this.type,
                scaleX: this.scaleX,
                scaleY: this.scaleY,
                resizeType: this.resizeType,
                lanczosLobes: this.lanczosLobes
            }
        }
    }), e.Image.filters.Resize.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, r = e.util.createClass;
    i.Contrast = r(i.BaseFilter, {
        type: "Contrast",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uContrast;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat contrastF = 1.015 * (uContrast + 1.0) / (1.0 * (1.015 - uContrast));\ncolor.rgb = contrastF * (color.rgb - 0.5) + 0.5;\ngl_FragColor = color;\n}",
        contrast: 0,
        mainParameter: "contrast",
        applyTo2d: function(t) {
            if (0 !== this.contrast) {
                var e, i, r = t.imageData, n = r.data, i = n.length, o = Math.floor(255 * this.contrast),
                    s = 259 * (o + 255) / (255 * (259 - o));
                for (e = 0; i > e; e += 4) {
                    n[e] = s * (n[e] - 128) + 128, n[e + 1] = s * (n[e + 1] - 128) + 128, n[e + 2] = s * (n[e + 2] - 128) + 128
                }
            }
        },
        getUniformLocations: function(t, e) {
            return {uContrast: t.getUniformLocation(e, "uContrast")}
        },
        sendUniformData: function(t, e) {
            t.uniform1f(e.uContrast, this.contrast)
        }
    }), e.Image.filters.Contrast.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, r = e.util.createClass;
    i.Saturation = r(i.BaseFilter, {
        type: "Saturation",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uSaturation;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat rgMax = max(color.r, color.g);\nfloat rgbMax = max(rgMax, color.b);\ncolor.r += rgbMax != color.r ? (rgbMax - color.r) * uSaturation : 0.00;\ncolor.g += rgbMax != color.g ? (rgbMax - color.g) * uSaturation : 0.00;\ncolor.b += rgbMax != color.b ? (rgbMax - color.b) * uSaturation : 0.00;\ngl_FragColor = color;\n}",
        saturation: 0,
        mainParameter: "saturation",
        applyTo2d: function(t) {
            if (0 !== this.saturation) {
                var e, i, r = t.imageData, n = r.data, o = n.length, a = -this.saturation;
                for (e = 0; o > e; e += 4) {
                    i = Math.max(n[e], n[e + 1], n[e + 2]), n[e] += i !== n[e] ? (i - n[e]) * a : 0, n[e + 1] += i !== n[e + 1] ? (i - n[e + 1]) * a : 0, n[e + 2] += i !== n[e + 2] ? (i - n[e + 2]) * a : 0
                }
            }
        },
        getUniformLocations: function(t, e) {
            return {uSaturation: t.getUniformLocation(e, "uSaturation")}
        },
        sendUniformData: function(t, e) {
            t.uniform1f(e.uSaturation, -this.saturation)
        }
    }), e.Image.filters.Saturation.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, r = e.util.createClass;
    i.Blur = r(i.BaseFilter, {
        type: "Blur",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform vec2 uDelta;\nvarying vec2 vTexCoord;\nconst float nSamples = 15.0;\nvec3 v3offset = vec3(12.9898, 78.233, 151.7182);\nfloat random(vec3 scale) {\nreturn fract(sin(dot(gl_FragCoord.xyz, scale)) * 43758.5453);\n}\nvoid main() {\nvec4 color = vec4(0.0);\nfloat total = 0.0;\nfloat offset = random(v3offset);\nfor (float t = -nSamples; t <= nSamples; t++) {\nfloat percent = (t + offset - 0.5) / nSamples;\nfloat weight = 1.0 - abs(percent);\ncolor += texture2D(uTexture, vTexCoord + uDelta * percent) * weight;\ntotal += weight;\n}\ngl_FragColor = color / total;\n}",
        blur: 0,
        mainParameter: "blur",
        applyTo: function(t) {
            t.webgl ? (this.aspectRatio = t.sourceWidth / t.sourceHeight, t.passes++, this._setupFrameBuffer(t), this.horizontal = !0, this.applyToWebGL(t), this._swapTextures(t), this._setupFrameBuffer(t), this.horizontal = !1, this.applyToWebGL(t), this._swapTextures(t)) : this.applyTo2d(t)
        },
        applyTo2d: function(t) {
            t.imageData = this.simpleBlur(t)
        },
        simpleBlur: function(t) {
            var i, r, n = t.filterBackend.resources, o = t.imageData.width, a = t.imageData.height;
            n.blurLayer1 || (n.blurLayer1 = e.util.createCanvasElement(), n.blurLayer2 = e.util.createCanvasElement()), i = n.blurLayer1, r = n.blurLayer2, (i.width !== o || i.height !== a) && (r.width = i.width = o, r.height = i.height = a);
            var s, c, h, l, u = i.getContext("2d"), f = r.getContext("2d"), d = 15, g = .06 * this.blur * .5;
            for (u.putImageData(t.imageData, 0, 0), f.clearRect(0, 0, o, a), l = -d; d >= l; l++) {
                s = (Math.random() - .5) / 4, c = l / d, h = g * c * o + s, f.globalAlpha = 1 - Math.abs(c), f.drawImage(i, h, s), u.drawImage(r, 0, 0), f.globalAlpha = 1, f.clearRect(0, 0, r.width, r.height);
            }
            for (l = -d; d >= l; l++) {
                s = (Math.random() - .5) / 4, c = l / d, h = g * c * a + s, f.globalAlpha = 1 - Math.abs(c), f.drawImage(i, s, h), u.drawImage(r, 0, 0), f.globalAlpha = 1, f.clearRect(0, 0, r.width, r.height);
            }
            t.ctx.drawImage(i, 0, 0);
            var p = t.ctx.getImageData(0, 0, i.width, i.height);
            return u.globalAlpha = 1, u.clearRect(0, 0, i.width, i.height), p
        },
        getUniformLocations: function(t, e) {
            return {delta: t.getUniformLocation(e, "uDelta")}
        },
        sendUniformData: function(t, e) {
            var i = this.chooseRightDelta();
            t.uniform2fv(e.delta, i)
        },
        chooseRightDelta: function() {
            var t, e = 1, i = [0, 0];
            return this.horizontal ? this.aspectRatio > 1 && (e = 1 / this.aspectRatio) : this.aspectRatio < 1 && (e = this.aspectRatio), t = e * this.blur * .12, this.horizontal ? i[0] = t : i[1] = t, i
        }
    }), i.Blur.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, r = e.util.createClass;
    i.Gamma = r(i.BaseFilter, {
        type: "Gamma",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform vec3 uGamma;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec3 correction = (1.0 / uGamma);\ncolor.r = pow(color.r, correction.r);\ncolor.g = pow(color.g, correction.g);\ncolor.b = pow(color.b, correction.b);\ngl_FragColor = color;\ngl_FragColor.rgb *= color.a;\n}",
        gamma: [1, 1, 1],
        mainParameter: "gamma",
        initialize: function(t) {
            this.gamma = [1, 1, 1], i.BaseFilter.prototype.initialize.call(this, t)
        },
        applyTo2d: function(t) {
            var e, i = t.imageData, r = i.data, n = this.gamma, o = r.length, a = 1 / n[0], s = 1 / n[1], c = 1 / n[2];
            for (this.rVals || (this.rVals = new Uint8Array(256), this.gVals = new Uint8Array(256), this.bVals = new Uint8Array(256)), e = 0, o = 256; o > e; e++) {
                this.rVals[e] = 255 * Math.pow(e / 255, a), this.gVals[e] = 255 * Math.pow(e / 255, s), this.bVals[e] = 255 * Math.pow(e / 255, c);
            }
            for (e = 0, o = r.length; o > e; e += 4) {
                r[e] = this.rVals[r[e]], r[e + 1] = this.gVals[r[e + 1]], r[e + 2] = this.bVals[r[e + 2]]
            }
        },
        getUniformLocations: function(t, e) {
            return {uGamma: t.getUniformLocation(e, "uGamma")}
        },
        sendUniformData: function(t, e) {
            t.uniform3fv(e.uGamma, this.gamma)
        }
    }), e.Image.filters.Gamma.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, r = e.util.createClass;
    i.Composed = r(i.BaseFilter, {
        type: "Composed",
        subFilters: [],
        initialize: function(t) {
            this.callSuper("initialize", t), this.subFilters = this.subFilters.slice(0)
        },
        applyTo: function(t) {
            t.passes += this.subFilters.length - 1, this.subFilters.forEach(function(e) {
                e.applyTo(t)
            })
        },
        toObject: function() {
            return e.util.object.extend(this.callSuper("toObject"), {
                subFilters: this.subFilters.map(function(t) {
                    return t.toObject()
                })
            })
        },
        isNeutralState: function() {
            return !this.subFilters.some(function(t) {
                return !t.isNeutralState()
            })
        }
    }), e.Image.filters.Composed.fromObject = function(t, i) {
        var r = t.subFilters || [], n = r.map(function(t) {
            return new e.Image.filters[t.type](t)
        }), o = new e.Image.filters.Composed({subFilters: n});
        return i && i(o), o
    }
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, r = e.util.createClass;
    i.HueRotation = r(i.ColorMatrix, {
        type: "HueRotation",
        rotation: 0,
        mainParameter: "rotation",
        calculateMatrix: function() {
            var t = this.rotation * Math.PI, i = e.util.cos(t), r = e.util.sin(t), n = 1 / 3, o = Math.sqrt(n) * r,
                a = 1 - i;
            this.matrix = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0], this.matrix[0] = i + a / 3, this.matrix[1] = n * a - o, this.matrix[2] = n * a + o, this.matrix[5] = n * a + o, this.matrix[6] = i + n * a, this.matrix[7] = n * a - o, this.matrix[10] = n * a - o, this.matrix[11] = n * a + o, this.matrix[12] = i + n * a
        },
        isNeutralState: function(t) {
            return this.calculateMatrix(), i.BaseFilter.prototype.isNeutralState.call(this, t)
        },
        applyTo: function(t) {
            this.calculateMatrix(), i.BaseFilter.prototype.applyTo.call(this, t)
        }
    }), e.Image.filters.HueRotation.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this);
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.object.clone;
    return e.Text ? void e.warn("fabric.Text is already defined") : (e.Text = e.util.createClass(e.Object, {
        _dimensionAffectingProps: ["fontSize", "fontWeight", "fontFamily", "fontStyle", "lineHeight", "text", "charSpacing", "textAlign", "styles"],
        _reNewline: /\r?\n/,
        _reSpacesAndTabs: /[ \t\r]/g,
        _reSpaceAndTab: /[ \t\r]/,
        _reWords: /\S+/g,
        type: "text",
        fontSize: 40,
        fontWeight: "normal",
        fontFamily: "Times New Roman",
        underline: !1,
        overline: !1,
        linethrough: !1,
        textAlign: "left",
        fontStyle: "normal",
        lineHeight: 1.16,
        superscript: {
            size: .6,
            baseline: -.35
        },
        subscript: {
            size: .6,
            baseline: .11
        },
        textBackgroundColor: "",
        stateProperties: e.Object.prototype.stateProperties.concat("fontFamily", "fontWeight", "fontSize", "text", "underline", "overline", "linethrough", "textAlign", "fontStyle", "lineHeight", "textBackgroundColor", "charSpacing", "styles"),
        cacheProperties: e.Object.prototype.cacheProperties.concat("fontFamily", "fontWeight", "fontSize", "text", "underline", "overline", "linethrough", "textAlign", "fontStyle", "lineHeight", "textBackgroundColor", "charSpacing", "styles"),
        stroke: null,
        shadow: null,
        _fontSizeFraction: .222,
        offsets: {
            underline: .1,
            linethrough: -.315,
            overline: -.88
        },
        _fontSizeMult: 1.13,
        charSpacing: 0,
        styles: null,
        _measuringContext: null,
        deltaY: 0,
        _styleProperties: ["stroke", "strokeWidth", "fill", "fontFamily", "fontSize", "fontWeight", "fontStyle", "underline", "overline", "linethrough", "deltaY", "textBackgroundColor"],
        __charBounds: [],
        CACHE_FONT_SIZE: 400,
        MIN_TEXT_WIDTH: 2,
        initialize: function(t, e) {
            this.styles = e ? e.styles || {} : {}, this.text = t, this.__skipDimension = !0, this.callSuper("initialize", e), this.__skipDimension = !1, this.initDimensions(), this.setCoords(), this.setupState({propertySet: "_dimensionAffectingProps"})
        },
        getMeasuringContext: function() {
            return e._measuringContext || (e._measuringContext = this.canvas && this.canvas.contextCache || e.util.createCanvasElement().getContext("2d")), e._measuringContext
        },
        _splitText: function() {
            var t = this._splitTextIntoLines(this.text);
            return this.textLines = t.lines, this._textLines = t.graphemeLines, this._unwrappedTextLines = t._unwrappedLines, this._text = t.graphemeText, t
        },
        initDimensions: function() {
            this.__skipDimension || (this._splitText(), this._clearCache(), this.width = this.calcTextWidth() || this.cursorWidth || this.MIN_TEXT_WIDTH, -1 !== this.textAlign.indexOf("justify") && this.enlargeSpaces(), this.height = this.calcTextHeight(), this.saveState({propertySet: "_dimensionAffectingProps"}))
        },
        enlargeSpaces: function() {
            for (var t, e, i, r, n, o, s, a = 0, c = this._textLines.length; c > a; a++) {
                if (("justify" === this.textAlign || a !== c - 1 && !this.isEndOfWrapping(a)) && (r = 0, n = this._textLines[a], e = this.getLineWidth(a), e < this.width && (s = this.textLines[a].match(this._reSpacesAndTabs)))) {
                    i = s.length, t = (this.width - e) / i;
                    for (var h = 0, l = n.length; l >= h; h++) {
                        o = this.__charBounds[a][h], this._reSpaceAndTab.test(n[h]) ? (o.width += t, o.kernedWidth += t, o.left += r, r += t) : o.left += r
                    }
                }
            }
        },
        isEndOfWrapping: function(t) {
            return t === this._textLines.length - 1
        },
        toString: function() {
            return "#<fabric.Text (" + this.complexity() + '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>'
        },
        _getCacheCanvasDimensions: function() {
            var t = this.callSuper("_getCacheCanvasDimensions"), e = this.fontSize;
            return t.width += e * t.zoomX, t.height += e * t.zoomY, t
        },
        _render: function(t) {
            this._setTextStyles(t), this._renderTextLinesBackground(t), this._renderTextDecoration(t, "underline"), this._renderText(t), this._renderTextDecoration(t, "overline"), this._renderTextDecoration(t, "linethrough")
        },
        _renderText: function(t) {
            "stroke" === this.paintFirst ? (this._renderTextStroke(t), this._renderTextFill(t)) : (this._renderTextFill(t), this._renderTextStroke(t))
        },
        _setTextStyles: function(t, e, i) {
            t.textBaseline = "alphabetic", t.font = this._getFontDeclaration(e, i)
        },
        calcTextWidth: function() {
            for (var t = this.getLineWidth(0), e = 1, i = this._textLines.length; i > e; e++) {
                var r = this.getLineWidth(e);
                r > t && (t = r)
            }
            return t
        },
        _renderTextLine: function(t, e, i, r, n, o) {
            this._renderChars(t, e, i, r, n, o)
        },
        _renderTextLinesBackground: function(t) {
            if (this.textBackgroundColor || this.styleHas("textBackgroundColor")) {
                for (var e, i, r, n, o, s, a = 0, c = t.fillStyle, h = this._getLeftOffset(), l = this._getTopOffset(), u = 0, f = 0, d = 0, g = this._textLines.length; g > d; d++) {
                    if (e = this.getHeightOfLine(d), this.textBackgroundColor || this.styleHas("textBackgroundColor", d)) {
                        r = this._textLines[d], i = this._getLineLeftOffset(d), f = 0, u = 0, n = this.getValueOfPropertyAt(d, 0, "textBackgroundColor");
                        for (var p = 0, v = r.length; v > p; p++) {
                            o = this.__charBounds[d][p], s = this.getValueOfPropertyAt(d, p, "textBackgroundColor"), s !== n ? (t.fillStyle = n, n && t.fillRect(h + i + u, l + a, f, e / this.lineHeight), u = o.left, f = o.width, n = s) : f += o.kernedWidth;
                        }
                        s && (t.fillStyle = s, t.fillRect(h + i + u, l + a, f, e / this.lineHeight)), a += e
                    } else {
                        a += e;
                    }
                }
                t.fillStyle = c, this._removeShadow(t)
            }
        },
        getFontCache: function(t) {
            var i = t.fontFamily.toLowerCase();
            e.charWidthsCache[i] || (e.charWidthsCache[i] = {});
            var r = e.charWidthsCache[i], n = t.fontStyle.toLowerCase() + "_" + (t.fontWeight + "").toLowerCase();
            return r[n] || (r[n] = {}), r[n]
        },
        _applyCharStyles: function(t, e, i, r, n) {
            this._setFillStyles(e, n), this._setStrokeStyles(e, n), e.font = this._getFontDeclaration(n)
        },
        _measureChar: function(t, e, i, r) {
            var n, o, s, a, c = this.getFontCache(e), h = this._getFontDeclaration(e), l = this._getFontDeclaration(r),
                u = i + t, f = h === l, d = e.fontSize / this.CACHE_FONT_SIZE;
            if (i && void 0 !== c[i] && (s = c[i]), void 0 !== c[t] && (a = n = c[t]), f && void 0 !== c[u] && (o = c[u], a = o - s), void 0 === n || void 0 === s || void 0 === o) {
                var g = this.getMeasuringContext();
                this._setTextStyles(g, e, !0)
            }
            return void 0 === n && (a = n = g.measureText(t).width, c[t] = n), void 0 === s && f && i && (s = g.measureText(i).width, c[i] = s), f && void 0 === o && (o = g.measureText(u).width, c[u] = o, a = o - s), {
                width: n * d,
                kernedWidth: a * d
            }
        },
        getHeightOfChar: function(t, e) {
            return this.getValueOfPropertyAt(t, e, "fontSize")
        },
        measureLine: function(t) {
            var e = this._measureLine(t);
            return 0 !== this.charSpacing && (e.width -= this._getWidthOfCharSpacing()), e.width < 0 && (e.width = 0), e
        },
        _measureLine: function(t) {
            var e, i, r, n, o = 0, s = this._textLines[t], a = 0, c = new Array(s.length);
            for (this.__charBounds[t] = c, e = 0; e < s.length; e++) {
                i = s[e], n = this._getGraphemeBox(i, t, e, r), c[e] = n, o += n.kernedWidth, r = i;
            }
            return c[e] = {
                left: n ? n.left + n.width : 0,
                width: 0,
                kernedWidth: 0,
                height: this.fontSize
            }, {
                width: o,
                numOfSpaces: a
            }
        },
        _getGraphemeBox: function(t, e, i, r, n) {
            var o, s = this.getCompleteStyleDeclaration(e, i), a = r ? this.getCompleteStyleDeclaration(e, i - 1) : {},
                c = this._measureChar(t, s, r, a), h = c.kernedWidth, l = c.width;
            0 !== this.charSpacing && (o = this._getWidthOfCharSpacing(), l += o, h += o);
            var u = {
                width: l,
                left: 0,
                height: s.fontSize,
                kernedWidth: h,
                deltaY: s.deltaY
            };
            if (i > 0 && !n) {
                var f = this.__charBounds[e][i - 1];
                u.left = f.left + f.width + c.kernedWidth - c.width
            }
            return u
        },
        getHeightOfLine: function(t) {
            if (this.__lineHeights[t]) {
                return this.__lineHeights[t];
            }
            for (var e = this._textLines[t], i = this.getHeightOfChar(t, 0), r = 1, n = e.length; n > r; r++) {
                i = Math.max(this.getHeightOfChar(t, r), i);
            }
            return this.__lineHeights[t] = i * this.lineHeight * this._fontSizeMult
        },
        calcTextHeight: function() {
            for (var t, e = 0, i = 0, r = this._textLines.length; r > i; i++) {
                t = this.getHeightOfLine(i), e += i === r - 1 ? t / this.lineHeight : t;
            }
            return e
        },
        _getLeftOffset: function() {
            return -this.width / 2
        },
        _getTopOffset: function() {
            return -this.height / 2
        },
        _renderTextCommon: function(t, e) {
            t.save();
            for (var i = 0, r = this._getLeftOffset(), n = this._getTopOffset(), o = this._applyPatternGradientTransform(t, "fillText" === e ? this.fill : this.stroke), s = 0, a = this._textLines.length; a > s; s++) {
                var c = this.getHeightOfLine(s), h = c / this.lineHeight, l = this._getLineLeftOffset(s);
                this._renderTextLine(e, t, this._textLines[s], r + l - o.offsetX, n + i + h - o.offsetY, s), i += c
            }
            t.restore()
        },
        _renderTextFill: function(t) {
            (this.fill || this.styleHas("fill")) && this._renderTextCommon(t, "fillText")
        },
        _renderTextStroke: function(t) {
            (this.stroke && 0 !== this.strokeWidth || !this.isEmptyStyles()) && (this.shadow && !this.shadow.affectStroke && this._removeShadow(t), t.save(), this._setLineDash(t, this.strokeDashArray), t.beginPath(), this._renderTextCommon(t, "strokeText"), t.closePath(), t.restore())
        },
        _renderChars: function(t, e, i, r, n, o) {
            var s, a, c, h, l = this.getHeightOfLine(o), u = -1 !== this.textAlign.indexOf("justify"), f = "", d = 0,
                g = !u && 0 === this.charSpacing && this.isEmptyStyles(o);
            if (e.save(), n -= l * this._fontSizeFraction / this.lineHeight, g) {
                return this._renderChar(t, e, o, 0, this.textLines[o], r, n, l), void e.restore();
            }
            for (var p = 0, v = i.length - 1; v >= p; p++) {
                h = p === v || this.charSpacing, f += i[p], c = this.__charBounds[o][p], 0 === d ? (r += c.kernedWidth - c.width, d += c.width) : d += c.kernedWidth, u && !h && this._reSpaceAndTab.test(i[p]) && (h = !0), h || (s = s || this.getCompleteStyleDeclaration(o, p), a = this.getCompleteStyleDeclaration(o, p + 1), h = this._hasStyleChanged(s, a)), h && (this._renderChar(t, e, o, p, f, r, n, l), f = "", s = a, r += d, d = 0);
            }
            e.restore()
        },
        _renderChar: function(t, e, i, r, n, o, s) {
            var a = this._getStyleDeclaration(i, r), c = this.getCompleteStyleDeclaration(i, r),
                h = "fillText" === t && c.fill, l = "strokeText" === t && c.stroke && c.strokeWidth;
            (l || h) && (a && e.save(), this._applyCharStyles(t, e, i, r, c), a && a.textBackgroundColor && this._removeShadow(e), a && a.deltaY && (s += a.deltaY), h && e.fillText(n, o, s), l && e.strokeText(n, o, s), a && e.restore())
        },
        setSuperscript: function(t, e) {
            return this._setScript(t, e, this.superscript)
        },
        setSubscript: function(t, e) {
            return this._setScript(t, e, this.subscript)
        },
        _setScript: function(t, e, i) {
            var r = this.get2DCursorLocation(t, !0),
                n = this.getValueOfPropertyAt(r.lineIndex, r.charIndex, "fontSize"),
                o = this.getValueOfPropertyAt(r.lineIndex, r.charIndex, "deltaY"), s = {
                    fontSize: n * i.size,
                    deltaY: o + n * i.baseline
                };
            return this.setSelectionStyles(s, t, e), this
        },
        _hasStyleChanged: function(t, e) {
            return t.fill !== e.fill || t.stroke !== e.stroke || t.strokeWidth !== e.strokeWidth || t.fontSize !== e.fontSize || t.fontFamily !== e.fontFamily || t.fontWeight !== e.fontWeight || t.fontStyle !== e.fontStyle || t.deltaY !== e.deltaY
        },
        _hasStyleChangedForSvg: function(t, e) {
            return this._hasStyleChanged(t, e) || t.overline !== e.overline || t.underline !== e.underline || t.linethrough !== e.linethrough
        },
        _getLineLeftOffset: function(t) {
            var e = this.getLineWidth(t);
            return "center" === this.textAlign ? (this.width - e) / 2 : "right" === this.textAlign ? this.width - e : "justify-center" === this.textAlign && this.isEndOfWrapping(t) ? (this.width - e) / 2 : "justify-right" === this.textAlign && this.isEndOfWrapping(t) ? this.width - e : 0
        },
        _clearCache: function() {
            this.__lineWidths = [], this.__lineHeights = [], this.__charBounds = []
        },
        _shouldClearDimensionCache: function() {
            var t = this._forceClearCache;
            return t || (t = this.hasStateChanged("_dimensionAffectingProps")), t && (this.dirty = !0, this._forceClearCache = !1), t
        },
        getLineWidth: function(t) {
            if (this.__lineWidths[t]) {
                return this.__lineWidths[t];
            }
            var e, i, r = this._textLines[t];
            return "" === r ? e = 0 : (i = this.measureLine(t), e = i.width), this.__lineWidths[t] = e, e
        },
        _getWidthOfCharSpacing: function() {
            return 0 !== this.charSpacing ? this.fontSize * this.charSpacing / 1e3 : 0
        },
        getValueOfPropertyAt: function(t, e, i) {
            var r = this._getStyleDeclaration(t, e);
            return r && "undefined" != typeof r[i] ? r[i] : this[i]
        },
        _renderTextDecoration: function(t, e) {
            if (this[e] || this.styleHas(e)) {
                for (var i, r, n, o, s, a, c, h, l, u, f, d, g, p, v, m, b = this._getLeftOffset(), y = this._getTopOffset(), _ = this._getWidthOfCharSpacing(), x = 0, C = this._textLines.length; C > x; x++) {
                    if (i = this.getHeightOfLine(x), this[e] || this.styleHas(e, x)) {
                        c = this._textLines[x], p = i / this.lineHeight, o = this._getLineLeftOffset(x), u = 0, f = 0, h = this.getValueOfPropertyAt(x, 0, e), m = this.getValueOfPropertyAt(x, 0, "fill"), l = y + p * (1 - this._fontSizeFraction), r = this.getHeightOfChar(x, 0), s = this.getValueOfPropertyAt(x, 0, "deltaY");
                        for (var w = 0, S = c.length; S > w; w++) {
                            d = this.__charBounds[x][w], g = this.getValueOfPropertyAt(x, w, e), v = this.getValueOfPropertyAt(x, w, "fill"), n = this.getHeightOfChar(x, w), a = this.getValueOfPropertyAt(x, w, "deltaY"), (g !== h || v !== m || n !== r || a !== s) && f > 0 ? (t.fillStyle = m, h && m && t.fillRect(b + o + u, l + this.offsets[e] * r + s, f, this.fontSize / 15), u = d.left, f = d.width, h = g, m = v, r = n, s = a) : f += d.kernedWidth;
                        }
                        t.fillStyle = v, g && v && t.fillRect(b + o + u, l + this.offsets[e] * r + s, f - _, this.fontSize / 15), y += i
                    } else {
                        y += i;
                    }
                }
                this._removeShadow(t)
            }
        },
        _getFontDeclaration: function(t, i) {
            var r = t || this, n = this.fontFamily, o = e.Text.genericFonts.indexOf(n.toLowerCase()) > -1,
                s = void 0 === n || n.indexOf("'") > -1 || n.indexOf('"') > -1 || o ? r.fontFamily : '"' + r.fontFamily + '"';
            return [e.isLikelyNode ? r.fontWeight : r.fontStyle, e.isLikelyNode ? r.fontStyle : r.fontWeight, i ? this.CACHE_FONT_SIZE + "px" : r.fontSize + "px", s].join(" ")
        },
        render: function(t) {
            this.visible && (!this.canvas || !this.canvas.skipOffscreen || this.group || this.isOnScreen()) && (this._shouldClearDimensionCache() && this.initDimensions(), this.callSuper("render", t))
        },
        _splitTextIntoLines: function(t) {
            for (var i = t.split(this._reNewline), r = new Array(i.length), n = ["\n"], o = [], s = 0; s < i.length; s++) {
                r[s] = e.util.string.graphemeSplit(i[s]), o = o.concat(r[s], n);
            }
            return o.pop(), {
                _unwrappedLines: r,
                lines: i,
                graphemeText: o,
                graphemeLines: r
            }
        },
        toObject: function(t) {
            var e = ["text", "fontSize", "fontWeight", "fontFamily", "fontStyle", "lineHeight", "underline", "overline", "linethrough", "textAlign", "textBackgroundColor", "charSpacing"].concat(t),
                r = this.callSuper("toObject", e);
            return r.styles = i(this.styles, !0), r
        },
        set: function(t, e) {
            this.callSuper("set", t, e);
            var i = !1;
            if ("object" == typeof t) {
                for (var r in t) {
                    i = i || -1 !== this._dimensionAffectingProps.indexOf(r);
                }
            } else {
                i = -1 !== this._dimensionAffectingProps.indexOf(t);
            }
            return i && (this.initDimensions(), this.setCoords()), this
        },
        complexity: function() {
            return 1
        }
    }), e.Text.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("x y dx dy font-family font-style font-weight font-size letter-spacing text-decoration text-anchor".split(" ")), e.Text.DEFAULT_SVG_FONT_SIZE = 16, e.Text.fromElement = function(t, r, n) {
        if (!t) {
            return r(null);
        }
        var o = e.parseAttributes(t, e.Text.ATTRIBUTE_NAMES), s = o.textAnchor || "left";
        if (n = e.util.object.extend(n ? i(n) : {}, o), n.top = n.top || 0, n.left = n.left || 0, o.textDecoration) {
            var a = o.textDecoration;
            -1 !== a.indexOf("underline") && (n.underline = !0), -1 !== a.indexOf("overline") && (n.overline = !0), -1 !== a.indexOf("line-through") && (n.linethrough = !0), delete n.textDecoration
        }
        "dx" in o && (n.left += o.dx), "dy" in o && (n.top += o.dy), "fontSize" in n || (n.fontSize = e.Text.DEFAULT_SVG_FONT_SIZE);
        var c = "";
        "textContent" in t ? c = t.textContent : "firstChild" in t && null !== t.firstChild && "data" in t.firstChild && null !== t.firstChild.data && (c = t.firstChild.data), c = c.replace(/^\s+|\s+$|\n+/g, "").replace(/\s+/g, " ");
        var h = n.strokeWidth;
        n.strokeWidth = 0;
        var l = new e.Text(c, n), u = l.getScaledHeight() / l.height,
            f = (l.height + l.strokeWidth) * l.lineHeight - l.height, d = f * u, g = l.getScaledHeight() + d, p = 0;
        "center" === s && (p = l.getScaledWidth() / 2), "right" === s && (p = l.getScaledWidth()), l.set({
            left: l.left - p,
            top: l.top - (g - l.fontSize * (.07 + l._fontSizeFraction)) / l.lineHeight,
            strokeWidth: "undefined" != typeof h ? h : 1
        }), r(l)
    }, e.Text.fromObject = function(t, i) {
        return e.Object._fromObject("Text", t, i, "text")
    }, e.Text.genericFonts = ["sans-serif", "serif", "cursive", "fantasy", "monospace"], void (e.util.createAccessors && e.util.createAccessors(e.Text)))
}("undefined" != typeof exports ? exports : this);
!function() {
    fabric.util.object.extend(fabric.Text.prototype, {
        isEmptyStyles: function(t) {
            if (!this.styles) {
                return !0;
            }
            if ("undefined" != typeof t && !this.styles[t]) {
                return !0;
            }
            var e = "undefined" == typeof t ? this.styles : {line: this.styles[t]};
            for (var i in e) {
                for (var r in e[i]) {
                    for (var n in e[i][r]) {
                        return !1;
                    }
                }
            }
            return !0
        },
        styleHas: function(t, e) {
            if (!this.styles || !t || "" === t) {
                return !1;
            }
            if ("undefined" != typeof e && !this.styles[e]) {
                return !1;
            }
            var i = "undefined" == typeof e ? this.styles : {line: this.styles[e]};
            for (var r in i) {
                for (var n in i[r]) {
                    if ("undefined" != typeof i[r][n][t]) {
                        return !0;
                    }
                }
            }
            return !1
        },
        cleanStyle: function(t) {
            if (!this.styles || !t || "" === t) {
                return !1;
            }
            var e, i, r, n = this.styles, o = 0, s = !0, a = 0;
            for (var c in n) {
                e = 0;
                for (var h in n[c]) {
                    var r = n[c][h], l = r.hasOwnProperty(t);
                    o++, l ? (i ? r[t] !== i && (s = !1) : i = r[t], r[t] === this[t] && delete r[t]) : s = !1, 0 !== Object.keys(r).length ? e++ : delete n[c][h]
                }
                0 === e && delete n[c]
            }
            for (var u = 0; u < this._textLines.length; u++) {
                a += this._textLines[u].length;
            }
            s && o === a && (this[t] = i, this.removeStyle(t))
        },
        removeStyle: function(t) {
            if (this.styles && t && "" !== t) {
                var e, i, r, n = this.styles;
                for (i in n) {
                    e = n[i];
                    for (r in e) {
                        delete e[r][t], 0 === Object.keys(e[r]).length && delete e[r];
                    }
                    0 === Object.keys(e).length && delete n[i]
                }
            }
        },
        _extendStyles: function(t, e) {
            var i = this.get2DCursorLocation(t);
            this._getLineStyle(i.lineIndex) || this._setLineStyle(i.lineIndex, {}), this._getStyleDeclaration(i.lineIndex, i.charIndex) || this._setStyleDeclaration(i.lineIndex, i.charIndex, {}), fabric.util.object.extend(this._getStyleDeclaration(i.lineIndex, i.charIndex), e)
        },
        get2DCursorLocation: function(t, e) {
            "undefined" == typeof t && (t = this.selectionStart);
            for (var i = e ? this._unwrappedTextLines : this._textLines, r = i.length, n = 0; r > n; n++) {
                if (t <= i[n].length) {
                    return {
                        lineIndex: n,
                        charIndex: t
                    };
                }
                t -= i[n].length + 1
            }
            return {
                lineIndex: n - 1,
                charIndex: i[n - 1].length < t ? i[n - 1].length : t
            }
        },
        getSelectionStyles: function(t, e, i) {
            "undefined" == typeof t && (t = this.selectionStart || 0), "undefined" == typeof e && (e = this.selectionEnd || t);
            for (var r = [], n = t; e > n; n++) {
                r.push(this.getStyleAtPosition(n, i));
            }
            return r
        },
        getStyleAtPosition: function(t, e) {
            var i = this.get2DCursorLocation(t),
                r = e ? this.getCompleteStyleDeclaration(i.lineIndex, i.charIndex) : this._getStyleDeclaration(i.lineIndex, i.charIndex);
            return r || {}
        },
        setSelectionStyles: function(t, e, i) {
            "undefined" == typeof e && (e = this.selectionStart || 0), "undefined" == typeof i && (i = this.selectionEnd || e);
            for (var r = e; i > r; r++) {
                this._extendStyles(r, t);
            }
            return this._forceClearCache = !0, this
        },
        _getStyleDeclaration: function(t, e) {
            var i = this.styles && this.styles[t];
            return i ? i[e] : null
        },
        getCompleteStyleDeclaration: function(t, e) {
            for (var i, r = this._getStyleDeclaration(t, e) || {}, n = {}, o = 0; o < this._styleProperties.length; o++) {
                i = this._styleProperties[o], n[i] = "undefined" == typeof r[i] ? this[i] : r[i];
            }
            return n
        },
        _setStyleDeclaration: function(t, e, i) {
            this.styles[t][e] = i
        },
        _deleteStyleDeclaration: function(t, e) {
            delete this.styles[t][e]
        },
        _getLineStyle: function(t) {
            return this.styles[t]
        },
        _setLineStyle: function(t, e) {
            this.styles[t] = e
        },
        _deleteLineStyle: function(t) {
            delete this.styles[t]
        }
    })
}();
!function() {
    function t(t) {
        t.textDecoration && (t.textDecoration.indexOf("underline") > -1 && (t.underline = !0), t.textDecoration.indexOf("line-through") > -1 && (t.linethrough = !0), t.textDecoration.indexOf("overline") > -1 && (t.overline = !0), delete t.textDecoration)
    }

    fabric.IText = fabric.util.createClass(fabric.Text, fabric.Observable, {
        type: "i-text",
        selectionStart: 0,
        selectionEnd: 0,
        selectionColor: "rgba(17,119,255,0.3)",
        isEditing: !1,
        editable: !0,
        editingBorderColor: "rgba(102,153,255,0.25)",
        cursorWidth: 2,
        cursorColor: "#333",
        cursorDelay: 1e3,
        cursorDuration: 600,
        caching: !0,
        _reSpace: /\s|\n/,
        _currentCursorOpacity: 0,
        _selectionDirection: null,
        _abortCursorAnimation: !1,
        __widthOfSpace: [],
        inCompositionMode: !1,
        initialize: function(t, e) {
            this.callSuper("initialize", t, e), this.initBehavior()
        },
        setSelectionStart: function(t) {
            t = Math.max(t, 0), this._updateAndFire("selectionStart", t)
        },
        setSelectionEnd: function(t) {
            t = Math.min(t, this.text.length), this._updateAndFire("selectionEnd", t)
        },
        _updateAndFire: function(t, e) {
            this[t] !== e && (this._fireSelectionChanged(), this[t] = e), this._updateTextarea()
        },
        _fireSelectionChanged: function() {
            this.fire("selection:changed"), this.canvas && this.canvas.fire("text:selection:changed", {target: this})
        },
        initDimensions: function() {
            this.isEditing && this.initDelayedCursor(), this.clearContextTop(), this.callSuper("initDimensions")
        },
        render: function(t) {
            this.clearContextTop(), this.callSuper("render", t), this.cursorOffsetCache = {}, this.renderCursorOrSelection()
        },
        _render: function(t) {
            this.callSuper("_render", t)
        },
        clearContextTop: function(t) {
            if (this.isEditing && this.canvas && this.canvas.contextTop) {
                var e = this.canvas.contextTop, i = this.canvas.viewportTransform;
                e.save(), e.transform(i[0], i[1], i[2], i[3], i[4], i[5]), this.transform(e), this.transformMatrix && e.transform.apply(e, this.transformMatrix), this._clearTextArea(e), t || e.restore()
            }
        },
        renderCursorOrSelection: function() {
            if (this.isEditing && this.canvas) {
                var t, e = this._getCursorBoundaries();
                this.canvas && this.canvas.contextTop ? (t = this.canvas.contextTop, this.clearContextTop(!0)) : (t = this.canvas.contextContainer, t.save()), this.selectionStart === this.selectionEnd ? this.renderCursor(e, t) : this.renderSelection(e, t), t.restore()
            }
        },
        _clearTextArea: function(t) {
            var e = this.width + 4, i = this.height + 4;
            t.clearRect(-e / 2, -i / 2, e, i)
        },
        _getCursorBoundaries: function(t) {
            "undefined" == typeof t && (t = this.selectionStart);
            var e = this._getLeftOffset(), i = this._getTopOffset(), r = this._getCursorBoundariesOffsets(t);
            return {
                left: e,
                top: i,
                leftOffset: r.left,
                topOffset: r.top
            }
        },
        _getCursorBoundariesOffsets: function(t) {
            if (this.cursorOffsetCache && "top" in this.cursorOffsetCache) {
                return this.cursorOffsetCache;
            }
            var e, i, r, n, o = 0, s = 0, a = this.get2DCursorLocation(t);
            r = a.charIndex, i = a.lineIndex;
            for (var c = 0; i > c; c++) {
                o += this.getHeightOfLine(c);
            }
            e = this._getLineLeftOffset(i);
            var h = this.__charBounds[i][r];
            return h && (s = h.left), 0 !== this.charSpacing && r === this._textLines[i].length && (s -= this._getWidthOfCharSpacing()), n = {
                top: o,
                left: e + (s > 0 ? s : 0)
            }, this.cursorOffsetCache = n, this.cursorOffsetCache
        },
        renderCursor: function(t, e) {
            var i = this.get2DCursorLocation(), r = i.lineIndex, n = i.charIndex > 0 ? i.charIndex - 1 : 0,
                o = this.getValueOfPropertyAt(r, n, "fontSize"), s = this.scaleX * this.canvas.getZoom(),
                a = this.cursorWidth / s, c = t.topOffset, h = this.getValueOfPropertyAt(r, n, "deltaY");
            c += (1 - this._fontSizeFraction) * this.getHeightOfLine(r) / this.lineHeight - o * (1 - this._fontSizeFraction), this.inCompositionMode && this.renderSelection(t, e), e.fillStyle = this.getValueOfPropertyAt(r, n, "fill"), e.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity, e.fillRect(t.left + t.leftOffset - a / 2, c + t.top + h, a, o)
        },
        renderSelection: function(t, e) {
            for (var i = this.inCompositionMode ? this.hiddenTextarea.selectionStart : this.selectionStart, r = this.inCompositionMode ? this.hiddenTextarea.selectionEnd : this.selectionEnd, n = -1 !== this.textAlign.indexOf("justify"), o = this.get2DCursorLocation(i), s = this.get2DCursorLocation(r), a = o.lineIndex, c = s.lineIndex, h = o.charIndex < 0 ? 0 : o.charIndex, l = s.charIndex < 0 ? 0 : s.charIndex, u = a; c >= u; u++) {
                var f = this._getLineLeftOffset(u) || 0, d = this.getHeightOfLine(u), g = 0, p = 0, v = 0;
                if (u === a && (p = this.__charBounds[a][h].left), u >= a && c > u) {
                    v = n && !this.isEndOfWrapping(u) ? this.width : this.getLineWidth(u) || 5;
                } else if (u === c) {
                    if (0 === l) {
                        v = this.__charBounds[c][l].left;
                    } else {
                        var m = this._getWidthOfCharSpacing();
                        v = this.__charBounds[c][l - 1].left + this.__charBounds[c][l - 1].width - m
                    }
                }
                g = d, (this.lineHeight < 1 || u === c && this.lineHeight > 1) && (d /= this.lineHeight), this.inCompositionMode ? (e.fillStyle = this.compositionColor || "black", e.fillRect(t.left + f + p, t.top + t.topOffset + d, v - p, 1)) : (e.fillStyle = this.selectionColor, e.fillRect(t.left + f + p, t.top + t.topOffset, v - p, d)), t.topOffset += g
            }
        },
        getCurrentCharFontSize: function() {
            var t = this._getCurrentCharIndex();
            return this.getValueOfPropertyAt(t.l, t.c, "fontSize")
        },
        getCurrentCharColor: function() {
            var t = this._getCurrentCharIndex();
            return this.getValueOfPropertyAt(t.l, t.c, "fill")
        },
        _getCurrentCharIndex: function() {
            var t = this.get2DCursorLocation(this.selectionStart, !0), e = t.charIndex > 0 ? t.charIndex - 1 : 0;
            return {
                l: t.lineIndex,
                c: e
            }
        }
    }), fabric.IText.fromObject = function(e, i) {
        if (t(e), e.styles) {
            for (var r in e.styles) {
                for (var n in e.styles[r]) {
                    t(e.styles[r][n]);
                }
            }
        }
        fabric.Object._fromObject("IText", e, i, "text")
    }
}();
!function() {
    var t = fabric.util.object.clone;
    fabric.util.object.extend(fabric.IText.prototype, {
        initBehavior: function() {
            this.initAddedHandler(), this.initRemovedHandler(), this.initCursorSelectionHandlers(), this.initDoubleClickSimulation(), this.mouseMoveHandler = this.mouseMoveHandler.bind(this)
        },
        onDeselect: function() {
            this.isEditing && this.exitEditing(), this.selected = !1
        },
        initAddedHandler: function() {
            var t = this;
            this.on("added", function() {
                var e = t.canvas;
                e && (e._hasITextHandlers || (e._hasITextHandlers = !0, t._initCanvasHandlers(e)), e._iTextInstances = e._iTextInstances || [], e._iTextInstances.push(t))
            })
        },
        initRemovedHandler: function() {
            var t = this;
            this.on("removed", function() {
                var e = t.canvas;
                e && (e._iTextInstances = e._iTextInstances || [], fabric.util.removeFromArray(e._iTextInstances, t), 0 === e._iTextInstances.length && (e._hasITextHandlers = !1, t._removeCanvasHandlers(e)))
            })
        },
        _initCanvasHandlers: function(t) {
            t._mouseUpITextHandler = function() {
                t._iTextInstances && t._iTextInstances.forEach(function(t) {
                    t.__isMousedown = !1
                })
            }, t.on("mouse:up", t._mouseUpITextHandler)
        },
        _removeCanvasHandlers: function(t) {
            t.off("mouse:up", t._mouseUpITextHandler)
        },
        _tick: function() {
            this._currentTickState = this._animateCursor(this, 1, this.cursorDuration, "_onTickComplete")
        },
        _animateCursor: function(t, e, i, r) {
            var n;
            return n = {
                isAborted: !1,
                abort: function() {
                    this.isAborted = !0
                }
            }, t.animate("_currentCursorOpacity", e, {
                duration: i,
                onComplete: function() {
                    n.isAborted || t[r]()
                },
                onChange: function() {
                    t.canvas && t.selectionStart === t.selectionEnd && t.renderCursorOrSelection()
                },
                abort: function() {
                    return n.isAborted
                }
            }), n
        },
        _onTickComplete: function() {
            var t = this;
            this._cursorTimeout1 && clearTimeout(this._cursorTimeout1), this._cursorTimeout1 = setTimeout(function() {
                t._currentTickCompleteState = t._animateCursor(t, 0, this.cursorDuration / 2, "_tick")
            }, 100)
        },
        initDelayedCursor: function(t) {
            var e = this, i = t ? 0 : this.cursorDelay;
            this.abortCursorAnimation(), this._currentCursorOpacity = 1, this._cursorTimeout2 = setTimeout(function() {
                e._tick()
            }, i)
        },
        abortCursorAnimation: function() {
            var t = this._currentTickState || this._currentTickCompleteState, e = this.canvas;
            this._currentTickState && this._currentTickState.abort(), this._currentTickCompleteState && this._currentTickCompleteState.abort(), clearTimeout(this._cursorTimeout1), clearTimeout(this._cursorTimeout2), this._currentCursorOpacity = 0, t && e && e.clearContext(e.contextTop || e.contextContainer)
        },
        selectAll: function() {
            return this.selectionStart = 0, this.selectionEnd = this._text.length, this._fireSelectionChanged(), this._updateTextarea(), this
        },
        getSelectedText: function() {
            return this._text.slice(this.selectionStart, this.selectionEnd).join("")
        },
        findWordBoundaryLeft: function(t) {
            var e = 0, i = t - 1;
            if (this._reSpace.test(this._text[i])) {
                for (; this._reSpace.test(this._text[i]);) {
                    e++, i--;
                }
            }
            for (; /\S/.test(this._text[i]) && i > -1;) {
                e++, i--;
            }
            return t - e
        },
        findWordBoundaryRight: function(t) {
            var e = 0, i = t;
            if (this._reSpace.test(this._text[i])) {
                for (; this._reSpace.test(this._text[i]);) {
                    e++, i++;
                }
            }
            for (; /\S/.test(this._text[i]) && i < this.text.length;) {
                e++, i++;
            }
            return t + e
        },
        findLineBoundaryLeft: function(t) {
            for (var e = 0, i = t - 1; !/\n/.test(this._text[i]) && i > -1;) {
                e++, i--;
            }
            return t - e
        },
        findLineBoundaryRight: function(t) {
            for (var e = 0, i = t; !/\n/.test(this._text[i]) && i < this.text.length;) {
                e++, i++;
            }
            return t + e
        },
        searchWordBoundary: function(t, e) {
            for (var i = this._reSpace.test(this.text.charAt(t)) ? t - 1 : t, r = this.text.charAt(i), n = /[ \n\.,;!\?\-]/; !n.test(r) && i > 0 && i < this.text.length;) {
                i += e, r = this.text.charAt(i);
            }
            return n.test(r) && "\n" !== r && (i += 1 === e ? 0 : 1), i
        },
        selectWord: function(t) {
            t = t || this.selectionStart;
            var e = this.searchWordBoundary(t, -1), i = this.searchWordBoundary(t, 1);
            this.selectionStart = e, this.selectionEnd = i, this._fireSelectionChanged(), this._updateTextarea(), this.renderCursorOrSelection()
        },
        selectLine: function(t) {
            t = t || this.selectionStart;
            var e = this.findLineBoundaryLeft(t), i = this.findLineBoundaryRight(t);
            return this.selectionStart = e, this.selectionEnd = i, this._fireSelectionChanged(), this._updateTextarea(), this
        },
        enterEditing: function(t) {
            return !this.isEditing && this.editable ? (this.canvas && (this.canvas.calcOffset(), this.exitEditingOnOthers(this.canvas)), this.isEditing = !0, this.initHiddenTextarea(t), this.hiddenTextarea.focus(), this.hiddenTextarea.value = this.text, this._updateTextarea(), this._saveEditingProps(), this._setEditingProps(), this._textBeforeEdit = this.text, this._tick(), this.fire("editing:entered"), this._fireSelectionChanged(), this.canvas ? (this.canvas.fire("text:editing:entered", {target: this}), this.initMouseMoveHandler(), this.canvas.requestRenderAll(), this) : this) : void 0
        },
        exitEditingOnOthers: function(t) {
            t._iTextInstances && t._iTextInstances.forEach(function(t) {
                t.selected = !1, t.isEditing && t.exitEditing()
            })
        },
        initMouseMoveHandler: function() {
            this.canvas.on("mouse:move", this.mouseMoveHandler)
        },
        mouseMoveHandler: function(t) {
            if (this.__isMousedown && this.isEditing) {
                var e = this.getSelectionStartFromPointer(t.e), i = this.selectionStart, r = this.selectionEnd;
                (e === this.__selectionStartOnMouseDown && i !== r || i !== e && r !== e) && (e > this.__selectionStartOnMouseDown ? (this.selectionStart = this.__selectionStartOnMouseDown, this.selectionEnd = e) : (this.selectionStart = e, this.selectionEnd = this.__selectionStartOnMouseDown), (this.selectionStart !== i || this.selectionEnd !== r) && (this.restartCursorIfNeeded(), this._fireSelectionChanged(), this._updateTextarea(), this.renderCursorOrSelection()))
            }
        },
        _setEditingProps: function() {
            this.hoverCursor = "text", this.canvas && (this.canvas.defaultCursor = this.canvas.moveCursor = "text"), this.borderColor = this.editingBorderColor, this.hasControls = this.selectable = !1, this.lockMovementX = this.lockMovementY = !0
        },
        fromStringToGraphemeSelection: function(t, e, i) {
            var r = i.slice(0, t), n = fabric.util.string.graphemeSplit(r).length;
            if (t === e) {
                return {
                    selectionStart: n,
                    selectionEnd: n
                };
            }
            var s = i.slice(t, e), o = fabric.util.string.graphemeSplit(s).length;
            return {
                selectionStart: n,
                selectionEnd: n + o
            }
        },
        fromGraphemeToStringSelection: function(t, e, i) {
            var r = i.slice(0, t), n = r.join("").length;
            if (t === e) {
                return {
                    selectionStart: n,
                    selectionEnd: n
                };
            }
            var s = i.slice(t, e), o = s.join("").length;
            return {
                selectionStart: n,
                selectionEnd: n + o
            }
        },
        _updateTextarea: function() {
            if (this.cursorOffsetCache = {}, this.hiddenTextarea) {
                if (!this.inCompositionMode) {
                    var t = this.fromGraphemeToStringSelection(this.selectionStart, this.selectionEnd, this._text);
                    this.hiddenTextarea.selectionStart = t.selectionStart, this.hiddenTextarea.selectionEnd = t.selectionEnd
                }
                this.updateTextareaPosition()
            }
        },
        updateFromTextArea: function() {
            if (this.hiddenTextarea) {
                this.cursorOffsetCache = {}, this.text = this.hiddenTextarea.value, this._shouldClearDimensionCache() && (this.initDimensions(), this.setCoords());
                var t = this.fromStringToGraphemeSelection(this.hiddenTextarea.selectionStart, this.hiddenTextarea.selectionEnd, this.hiddenTextarea.value);
                this.selectionEnd = this.selectionStart = t.selectionEnd, this.inCompositionMode || (this.selectionStart = t.selectionStart), this.updateTextareaPosition()
            }
        },
        updateTextareaPosition: function() {
            if (this.selectionStart === this.selectionEnd) {
                var t = this._calcTextareaPosition();
                this.hiddenTextarea.style.left = t.left, this.hiddenTextarea.style.top = t.top
            }
        },
        _calcTextareaPosition: function() {
            if (!this.canvas) {
                return {
                    x: 1,
                    y: 1
                };
            }
            var t = this.inCompositionMode ? this.compositionStart : this.selectionStart,
                e = this._getCursorBoundaries(t), i = this.get2DCursorLocation(t), r = i.lineIndex, n = i.charIndex,
                s = this.getValueOfPropertyAt(r, n, "fontSize") * this.lineHeight, o = e.leftOffset,
                a = this.calcTransformMatrix(), c = {
                    x: e.left + o,
                    y: e.top + e.topOffset + s
                }, h = this.canvas.upperCanvasEl, l = h.width, u = h.height, f = l - s, d = u - s, g = h.clientWidth / l,
                p = h.clientHeight / u;
            return c = fabric.util.transformPoint(c, a), c = fabric.util.transformPoint(c, this.canvas.viewportTransform), c.x *= g, c.y *= p, c.x < 0 && (c.x = 0), c.x > f && (c.x = f), c.y < 0 && (c.y = 0), c.y > d && (c.y = d), c.x += this.canvas._offset.left, c.y += this.canvas._offset.top, {
                left: c.x + "px",
                top: c.y + "px",
                fontSize: s + "px",
                charHeight: s
            }
        },
        _saveEditingProps: function() {
            this._savedProps = {
                hasControls: this.hasControls,
                borderColor: this.borderColor,
                lockMovementX: this.lockMovementX,
                lockMovementY: this.lockMovementY,
                hoverCursor: this.hoverCursor,
                defaultCursor: this.canvas && this.canvas.defaultCursor,
                moveCursor: this.canvas && this.canvas.moveCursor
            }
        },
        _restoreEditingProps: function() {
            this._savedProps && (this.hoverCursor = this._savedProps.hoverCursor, this.hasControls = this._savedProps.hasControls, this.borderColor = this._savedProps.borderColor, this.lockMovementX = this._savedProps.lockMovementX, this.lockMovementY = this._savedProps.lockMovementY, this.canvas && (this.canvas.defaultCursor = this._savedProps.defaultCursor, this.canvas.moveCursor = this._savedProps.moveCursor))
        },
        exitEditing: function() {
            var t = this._textBeforeEdit !== this.text;
            return this.selected = !1, this.isEditing = !1, this.selectable = !0, this.selectionEnd = this.selectionStart, this.hiddenTextarea && (this.hiddenTextarea.blur && this.hiddenTextarea.blur(), this.canvas && this.hiddenTextarea.parentNode.removeChild(this.hiddenTextarea), this.hiddenTextarea = null), this.abortCursorAnimation(), this._restoreEditingProps(), this._currentCursorOpacity = 0, this._shouldClearDimensionCache() && (this.initDimensions(), this.setCoords()), this.fire("editing:exited"), t && this.fire("modified"), this.canvas && (this.canvas.off("mouse:move", this.mouseMoveHandler), this.canvas.fire("text:editing:exited", {target: this}), t && this.canvas.fire("object:modified", {target: this})), this
        },
        _removeExtraneousStyles: function() {
            for (var t in this.styles) {
                this._textLines[t] || delete this.styles[t]
            }
        },
        removeStyleFromTo: function(t, e) {
            var i, r, n = this.get2DCursorLocation(t, !0), s = this.get2DCursorLocation(e, !0), o = n.lineIndex,
                a = n.charIndex, c = s.lineIndex, h = s.charIndex;
            if (o !== c) {
                if (this.styles[o]) {
                    for (i = a; i < this._unwrappedTextLines[o].length; i++) {
                        delete this.styles[o][i];
                    }
                }
                if (this.styles[c]) {
                    for (i = h; i < this._unwrappedTextLines[c].length; i++) {
                        r = this.styles[c][i], r && (this.styles[o] || (this.styles[o] = {}), this.styles[o][a + i - h] = r);
                    }
                }
                for (i = o + 1; c >= i; i++) {
                    delete this.styles[i];
                }
                this.shiftLineStyles(c, o - c)
            } else if (this.styles[o]) {
                r = this.styles[o];
                var l, u, f = h - a;
                for (i = a; h > i; i++) {
                    delete r[i];
                }
                for (u in this.styles[o]) {
                    l = parseInt(u, 10), l >= h && (r[l - f] = r[u], delete r[u])
                }
            }
        },
        shiftLineStyles: function(e, i) {
            var r = t(this.styles);
            for (var n in this.styles) {
                var s = parseInt(n, 10);
                s > e && (this.styles[s + i] = r[s], r[s - i] || delete this.styles[s])
            }
        },
        restartCursorIfNeeded: function() {
            (!this._currentTickState || this._currentTickState.isAborted || !this._currentTickCompleteState || this._currentTickCompleteState.isAborted) && this.initDelayedCursor()
        },
        insertNewlineStyleObject: function(e, i, r, n) {
            var s, o = {}, a = !1;
            r || (r = 1), this.shiftLineStyles(e, r), this.styles[e] && (s = this.styles[e][0 === i ? i : i - 1]);
            for (var c in this.styles[e]) {
                var h = parseInt(c, 10);
                h >= i && (a = !0, o[h - i] = this.styles[e][c], delete this.styles[e][c])
            }
            for (a ? this.styles[e + r] = o : delete this.styles[e + r]; r > 1;) {
                r--, n && n[r] ? this.styles[e + r] = {0: t(n[r])} : s ? this.styles[e + r] = {0: t(s)} : delete this.styles[e + r];
            }
            this._forceClearCache = !0
        },
        insertCharStyleObject: function(e, i, r, n) {
            this.styles || (this.styles = {});
            var s = this.styles[e], o = s ? t(s) : {};
            r || (r = 1);
            for (var a in o) {
                var c = parseInt(a, 10);
                c >= i && (s[c + r] = o[c], o[c - r] || delete s[c])
            }
            if (this._forceClearCache = !0, n) {
                for (; r--;) {
                    Object.keys(n[r]).length && (this.styles[e] || (this.styles[e] = {}), this.styles[e][i + r] = t(n[r]));
                }
            } else if (s) {
                for (var h = s[i ? i - 1 : 1]; h && r--;) {
                    this.styles[e][i + r] = t(h)
                }
            }
        },
        insertNewStyleBlock: function(t, e, i) {
            for (var r = this.get2DCursorLocation(e, !0), n = [0], s = 0, o = 0; o < t.length; o++) {
                "\n" === t[o] ? (s++, n[s] = 0) : n[s]++;
            }
            n[0] > 0 && (this.insertCharStyleObject(r.lineIndex, r.charIndex, n[0], i), i = i && i.slice(n[0] + 1)), s && this.insertNewlineStyleObject(r.lineIndex, r.charIndex + n[0], s);
            for (var o = 1; s > o; o++) {
                n[o] > 0 ? this.insertCharStyleObject(r.lineIndex + o, 0, n[o], i) : i && (this.styles[r.lineIndex + o][0] = i[0]), i = i && i.slice(n[o] + 1);
            }
            n[o] > 0 && this.insertCharStyleObject(r.lineIndex + o, 0, n[o], i)
        },
        setSelectionStartEndWithShift: function(t, e, i) {
            t >= i ? (e === t ? this._selectionDirection = "left" : "right" === this._selectionDirection && (this._selectionDirection = "left", this.selectionEnd = t), this.selectionStart = i) : i > t && e > i ? "right" === this._selectionDirection ? this.selectionEnd = i : this.selectionStart = i : (e === t ? this._selectionDirection = "right" : "left" === this._selectionDirection && (this._selectionDirection = "right", this.selectionStart = e), this.selectionEnd = i)
        },
        setSelectionInBoundaries: function() {
            var t = this.text.length;
            this.selectionStart > t ? this.selectionStart = t : this.selectionStart < 0 && (this.selectionStart = 0), this.selectionEnd > t ? this.selectionEnd = t : this.selectionEnd < 0 && (this.selectionEnd = 0)
        }
    })
}();
fabric.util.object.extend(fabric.IText.prototype, {
    initDoubleClickSimulation: function() {
        this.__lastClickTime = +new Date, this.__lastLastClickTime = +new Date, this.__lastPointer = {}, this.on("mousedown", this.onMouseDown)
    },
    onMouseDown: function(t) {
        if (this.canvas) {
            this.__newClickTime = +new Date;
            var e = t.pointer;
            this.isTripleClick(e) && (this.fire("tripleclick", t), this._stopEvent(t.e)), this.__lastLastClickTime = this.__lastClickTime, this.__lastClickTime = this.__newClickTime, this.__lastPointer = e, this.__lastIsEditing = this.isEditing, this.__lastSelected = this.selected
        }
    },
    isTripleClick: function(t) {
        return this.__newClickTime - this.__lastClickTime < 500 && this.__lastClickTime - this.__lastLastClickTime < 500 && this.__lastPointer.x === t.x && this.__lastPointer.y === t.y
    },
    _stopEvent: function(t) {
        t.preventDefault && t.preventDefault(), t.stopPropagation && t.stopPropagation()
    },
    initCursorSelectionHandlers: function() {
        this.initMousedownHandler(), this.initMouseupHandler(), this.initClicks()
    },
    initClicks: function() {
        this.on("mousedblclick", function(t) {
            this.selectWord(this.getSelectionStartFromPointer(t.e))
        }), this.on("tripleclick", function(t) {
            this.selectLine(this.getSelectionStartFromPointer(t.e))
        })
    },
    _mouseDownHandler: function(t) {
        !this.canvas || !this.editable || t.e.button && 1 !== t.e.button || (this.__isMousedown = !0, this.selected && this.setCursorByClick(t.e), this.isEditing && (this.__selectionStartOnMouseDown = this.selectionStart, this.selectionStart === this.selectionEnd && this.abortCursorAnimation(), this.renderCursorOrSelection()))
    },
    _mouseDownHandlerBefore: function(t) {
        !this.canvas || !this.editable || t.e.button && 1 !== t.e.button || this === this.canvas._activeObject && (this.selected = !0)
    },
    initMousedownHandler: function() {
        this.on("mousedown", this._mouseDownHandler), this.on("mousedown:before", this._mouseDownHandlerBefore)
    },
    initMouseupHandler: function() {
        this.on("mouseup", this.mouseUpHandler)
    },
    mouseUpHandler: function(t) {
        if (this.__isMousedown = !1, !(!this.editable || this.group || t.transform && t.transform.actionPerformed || t.e.button && 1 !== t.e.button)) {
            if (this.canvas) {
                var e = this.canvas._activeObject;
                if (e && e !== this) {
                    return
                }
            }
            this.__lastSelected && !this.__corner ? (this.selected = !1, this.__lastSelected = !1, this.enterEditing(t.e), this.selectionStart === this.selectionEnd ? this.initDelayedCursor(!0) : this.renderCursorOrSelection()) : this.selected = !0
        }
    },
    setCursorByClick: function(t) {
        var e = this.getSelectionStartFromPointer(t), i = this.selectionStart, r = this.selectionEnd;
        t.shiftKey ? this.setSelectionStartEndWithShift(i, r, e) : (this.selectionStart = e, this.selectionEnd = e), this.isEditing && (this._fireSelectionChanged(), this._updateTextarea())
    },
    getSelectionStartFromPointer: function(t) {
        for (var e, i, r = this.getLocalPointer(t), n = 0, s = 0, o = 0, a = 0, c = 0, h = 0, l = this._textLines.length; l > h && o <= r.y; h++) {
            o += this.getHeightOfLine(h) * this.scaleY, c = h, h > 0 && (a += this._textLines[h - 1].length + 1);
        }
        e = this._getLineLeftOffset(c), s = e * this.scaleX, i = this._textLines[c];
        for (var u = 0, f = i.length; f > u && (n = s, s += this.__charBounds[c][u].kernedWidth * this.scaleX, s <= r.x); u++) {
            a++;
        }
        return this._getNewSelectionStartFromOffset(r, n, s, a, f)
    },
    _getNewSelectionStartFromOffset: function(t, e, i, r, n) {
        var s = t.x - e, o = i - t.x, a = o > s || 0 > o ? 0 : 1, c = r + a;
        return this.flipX && (c = n - c), c > this._text.length && (c = this._text.length), c
    }
});
fabric.util.object.extend(fabric.IText.prototype, {
    initHiddenTextarea: function() {
        this.hiddenTextarea = fabric.document.createElement("textarea"), this.hiddenTextarea.setAttribute("autocapitalize", "off"), this.hiddenTextarea.setAttribute("autocorrect", "off"), this.hiddenTextarea.setAttribute("autocomplete", "off"), this.hiddenTextarea.setAttribute("spellcheck", "false"), this.hiddenTextarea.setAttribute("data-fabric-hiddentextarea", ""), this.hiddenTextarea.setAttribute("wrap", "off");
        var t = this._calcTextareaPosition();
        this.hiddenTextarea.style.cssText = "position: absolute; top: " + t.top + "; left: " + t.left + "; z-index: -999; opacity: 0; width: 1px; height: 1px; font-size: 1px; padding???top: " + t.fontSize + ";", fabric.document.body.appendChild(this.hiddenTextarea), fabric.util.addListener(this.hiddenTextarea, "keydown", this.onKeyDown.bind(this)), fabric.util.addListener(this.hiddenTextarea, "keyup", this.onKeyUp.bind(this)), fabric.util.addListener(this.hiddenTextarea, "input", this.onInput.bind(this)), fabric.util.addListener(this.hiddenTextarea, "copy", this.copy.bind(this)), fabric.util.addListener(this.hiddenTextarea, "cut", this.copy.bind(this)), fabric.util.addListener(this.hiddenTextarea, "paste", this.paste.bind(this)), fabric.util.addListener(this.hiddenTextarea, "compositionstart", this.onCompositionStart.bind(this)), fabric.util.addListener(this.hiddenTextarea, "compositionupdate", this.onCompositionUpdate.bind(this)), fabric.util.addListener(this.hiddenTextarea, "compositionend", this.onCompositionEnd.bind(this)), !this._clickHandlerInitialized && this.canvas && (fabric.util.addListener(this.canvas.upperCanvasEl, "click", this.onClick.bind(this)), this._clickHandlerInitialized = !0)
    },
    keysMap: {
        9: "exitEditing",
        27: "exitEditing",
        33: "moveCursorUp",
        34: "moveCursorDown",
        35: "moveCursorRight",
        36: "moveCursorLeft",
        37: "moveCursorLeft",
        38: "moveCursorUp",
        39: "moveCursorRight",
        40: "moveCursorDown"
    },
    ctrlKeysMapUp: {
        67: "copy",
        88: "cut"
    },
    ctrlKeysMapDown: {65: "selectAll"},
    onClick: function() {
        this.hiddenTextarea && this.hiddenTextarea.focus()
    },
    onKeyDown: function(t) {
        if (this.isEditing && !this.inCompositionMode) {
            if (t.keyCode in this.keysMap) {
                this[this.keysMap[t.keyCode]](t);
            } else {
                if (!(t.keyCode in this.ctrlKeysMapDown && (t.ctrlKey || t.metaKey))) {
                    return;
                }
                this[this.ctrlKeysMapDown[t.keyCode]](t)
            }
            t.stopImmediatePropagation(), t.preventDefault(), t.keyCode >= 33 && t.keyCode <= 40 ? (this.clearContextTop(), this.renderCursorOrSelection()) : this.canvas && this.canvas.requestRenderAll()
        }
    },
    onKeyUp: function(t) {
        return !this.isEditing || this._copyDone || this.inCompositionMode ? void (this._copyDone = !1) : void (t.keyCode in this.ctrlKeysMapUp && (t.ctrlKey || t.metaKey) && (this[this.ctrlKeysMapUp[t.keyCode]](t), t.stopImmediatePropagation(), t.preventDefault(), this.canvas && this.canvas.requestRenderAll()))
    },
    onInput: function(t) {
        var e = this.fromPaste;
        if (this.fromPaste = !1, t && t.stopPropagation(), this.isEditing) {
            var i, r, n = this._splitTextIntoLines(this.hiddenTextarea.value).graphemeText, s = this._text.length,
                o = n.length, a = o - s;
            if ("" === this.hiddenTextarea.value) {
                return this.styles = {}, this.updateFromTextArea(), this.fire("changed"), void (this.canvas && (this.canvas.fire("text:changed", {target: this}), this.canvas.requestRenderAll()));
            }
            var c = this.fromStringToGraphemeSelection(this.hiddenTextarea.selectionStart, this.hiddenTextarea.selectionEnd, this.hiddenTextarea.value),
                h = this.selectionStart > c.selectionStart;
            this.selectionStart !== this.selectionEnd ? (i = this._text.slice(this.selectionStart, this.selectionEnd), a += this.selectionEnd - this.selectionStart) : s > o && (i = h ? this._text.slice(this.selectionEnd + a, this.selectionEnd) : this._text.slice(this.selectionStart, this.selectionStart - a)), r = n.slice(c.selectionEnd - a, c.selectionEnd), i && i.length && (this.selectionStart !== this.selectionEnd ? this.removeStyleFromTo(this.selectionStart, this.selectionEnd) : h ? this.removeStyleFromTo(this.selectionEnd - i.length, this.selectionEnd) : this.removeStyleFromTo(this.selectionEnd, this.selectionEnd + i.length)), r.length && (e && r.join("") === fabric.copiedText ? this.insertNewStyleBlock(r, this.selectionStart, fabric.copiedTextStyle) : this.insertNewStyleBlock(r, this.selectionStart)), this.updateFromTextArea(), this.fire("changed"), this.canvas && (this.canvas.fire("text:changed", {target: this}), this.canvas.requestRenderAll())
        }
    },
    onCompositionStart: function() {
        this.inCompositionMode = !0
    },
    onCompositionEnd: function() {
        this.inCompositionMode = !1
    },
    onCompositionUpdate: function(t) {
        this.compositionStart = t.target.selectionStart, this.compositionEnd = t.target.selectionEnd, this.updateTextareaPosition()
    },
    copy: function() {
        this.selectionStart !== this.selectionEnd && (fabric.copiedText = this.getSelectedText(), fabric.copiedTextStyle = this.getSelectionStyles(this.selectionStart, this.selectionEnd, !0), this._copyDone = !0)
    },
    paste: function() {
        this.fromPaste = !0
    },
    _getClipboardData: function(t) {
        return t && t.clipboardData || fabric.window.clipboardData
    },
    _getWidthBeforeCursor: function(t, e) {
        var i, r = this._getLineLeftOffset(t);
        return e > 0 && (i = this.__charBounds[t][e - 1], r += i.left + i.width), r
    },
    getDownCursorOffset: function(t, e) {
        var i = this._getSelectionForOffset(t, e), r = this.get2DCursorLocation(i), n = r.lineIndex;
        if (n === this._textLines.length - 1 || t.metaKey || 34 === t.keyCode) {
            return this._text.length - i;
        }
        var s = r.charIndex, o = this._getWidthBeforeCursor(n, s), a = this._getIndexOnLine(n + 1, o),
            c = this._textLines[n].slice(s);
        return c.length + a + 2
    },
    _getSelectionForOffset: function(t, e) {
        return t.shiftKey && this.selectionStart !== this.selectionEnd && e ? this.selectionEnd : this.selectionStart
    },
    getUpCursorOffset: function(t, e) {
        var i = this._getSelectionForOffset(t, e), r = this.get2DCursorLocation(i), n = r.lineIndex;
        if (0 === n || t.metaKey || 33 === t.keyCode) {
            return -i;
        }
        var s = r.charIndex, o = this._getWidthBeforeCursor(n, s), a = this._getIndexOnLine(n - 1, o),
            c = this._textLines[n].slice(0, s);
        return -this._textLines[n - 1].length + a - c.length
    },
    _getIndexOnLine: function(t, e) {
        for (var i, r, n = this._textLines[t], s = this._getLineLeftOffset(t), o = s, a = 0, c = 0, h = n.length; h > c; c++) {
            if (i = this.__charBounds[t][c].width, o += i, o > e) {
                r = !0;
                var l = o - i, u = o, f = Math.abs(l - e), d = Math.abs(u - e);
                a = f > d ? c : c - 1;
                break
            }
        }
        return r || (a = n.length - 1), a
    },
    moveCursorDown: function(t) {
        this.selectionStart >= this._text.length && this.selectionEnd >= this._text.length || this._moveCursorUpOrDown("Down", t)
    },
    moveCursorUp: function(t) {
        (0 !== this.selectionStart || 0 !== this.selectionEnd) && this._moveCursorUpOrDown("Up", t)
    },
    _moveCursorUpOrDown: function(t, e) {
        var i = "get" + t + "CursorOffset", r = this[i](e, "right" === this._selectionDirection);
        e.shiftKey ? this.moveCursorWithShift(r) : this.moveCursorWithoutShift(r), 0 !== r && (this.setSelectionInBoundaries(), this.abortCursorAnimation(), this._currentCursorOpacity = 1, this.initDelayedCursor(), this._fireSelectionChanged(), this._updateTextarea())
    },
    moveCursorWithShift: function(t) {
        var e = "left" === this._selectionDirection ? this.selectionStart + t : this.selectionEnd + t;
        return this.setSelectionStartEndWithShift(this.selectionStart, this.selectionEnd, e), 0 !== t
    },
    moveCursorWithoutShift: function(t) {
        return 0 > t ? (this.selectionStart += t, this.selectionEnd = this.selectionStart) : (this.selectionEnd += t, this.selectionStart = this.selectionEnd), 0 !== t
    },
    moveCursorLeft: function(t) {
        (0 !== this.selectionStart || 0 !== this.selectionEnd) && this._moveCursorLeftOrRight("Left", t)
    },
    _move: function(t, e, i) {
        var r;
        if (t.altKey) {
            r = this["findWordBoundary" + i](this[e]);
        } else {
            if (!t.metaKey && 35 !== t.keyCode && 36 !== t.keyCode) {
                return this[e] += "Left" === i ? -1 : 1, !0;
            }
            r = this["findLineBoundary" + i](this[e])
        }
        return void 0 !== typeof r && this[e] !== r ? (this[e] = r, !0) : void 0
    },
    _moveLeft: function(t, e) {
        return this._move(t, e, "Left")
    },
    _moveRight: function(t, e) {
        return this._move(t, e, "Right")
    },
    moveCursorLeftWithoutShift: function(t) {
        var e = !0;
        return this._selectionDirection = "left", this.selectionEnd === this.selectionStart && 0 !== this.selectionStart && (e = this._moveLeft(t, "selectionStart")), this.selectionEnd = this.selectionStart, e
    },
    moveCursorLeftWithShift: function(t) {
        return "right" === this._selectionDirection && this.selectionStart !== this.selectionEnd ? this._moveLeft(t, "selectionEnd") : 0 !== this.selectionStart ? (this._selectionDirection = "left", this._moveLeft(t, "selectionStart")) : void 0
    },
    moveCursorRight: function(t) {
        this.selectionStart >= this._text.length && this.selectionEnd >= this._text.length || this._moveCursorLeftOrRight("Right", t)
    },
    _moveCursorLeftOrRight: function(t, e) {
        var i = "moveCursor" + t + "With";
        this._currentCursorOpacity = 1, i += e.shiftKey ? "Shift" : "outShift", this[i](e) && (this.abortCursorAnimation(), this.initDelayedCursor(), this._fireSelectionChanged(), this._updateTextarea())
    },
    moveCursorRightWithShift: function(t) {
        return "left" === this._selectionDirection && this.selectionStart !== this.selectionEnd ? this._moveRight(t, "selectionStart") : this.selectionEnd !== this._text.length ? (this._selectionDirection = "right", this._moveRight(t, "selectionEnd")) : void 0
    },
    moveCursorRightWithoutShift: function(t) {
        var e = !0;
        return this._selectionDirection = "right", this.selectionStart === this.selectionEnd ? (e = this._moveRight(t, "selectionStart"), this.selectionEnd = this.selectionStart) : this.selectionStart = this.selectionEnd, e
    },
    removeChars: function(t, e) {
        "undefined" == typeof e && (e = t + 1), this.removeStyleFromTo(t, e), this._text.splice(t, e - t), this.text = this._text.join(""), this.set("dirty", !0), this._shouldClearDimensionCache() && (this.initDimensions(), this.setCoords()), this._removeExtraneousStyles()
    },
    insertChars: function(t, e, i, r) {
        "undefined" == typeof r && (r = i), r > i && this.removeStyleFromTo(i, r);
        var n = fabric.util.string.graphemeSplit(t);
        this.insertNewStyleBlock(n, i, e), this._text = [].concat(this._text.slice(0, i), n, this._text.slice(r)), this.text = this._text.join(""), this.set("dirty", !0), this._shouldClearDimensionCache() && (this.initDimensions(), this.setCoords()), this._removeExtraneousStyles()
    }
});
!function() {
    var t = fabric.util.toFixed, e = /  +/g;
    fabric.util.object.extend(fabric.Text.prototype, {
        toSVG: function(t) {
            var e = this._getSVGLeftTopOffsets(), i = this._getSVGTextAndBg(e.textTop, e.textLeft),
                r = this._wrapSVGTextAndBg(i);
            return this._createBaseSVGMarkup(r, {
                reviver: t,
                noStyle: !0,
                withShadow: !0
            })
        },
        _getSVGLeftTopOffsets: function() {
            return {
                textLeft: -this.width / 2,
                textTop: -this.height / 2,
                lineTop: this.getHeightOfLine(0)
            }
        },
        _wrapSVGTextAndBg: function(t) {
            var e = !0, i = this.getSvgTextDecoration(this);
            return [t.textBgRects.join(""), '		<text xml:space="preserve" ', this.fontFamily ? 'font-family="' + this.fontFamily.replace(/"/g, "'") + '" ' : "", this.fontSize ? 'font-size="' + this.fontSize + '" ' : "", this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : "", this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : "", i ? 'text-decoration="' + i + '" ' : "", 'style="', this.getSvgStyles(e), '"', this.addPaintOrder(), " >", t.textSpans.join(""), "</text>\n"]
        },
        _getSVGTextAndBg: function(t, e) {
            var i, r = [], n = [], s = t;
            this._setSVGBg(n);
            for (var o = 0, a = this._textLines.length; a > o; o++) {
                i = this._getLineLeftOffset(o), (this.textBackgroundColor || this.styleHas("textBackgroundColor", o)) && this._setSVGTextLineBg(n, o, e + i, s), this._setSVGTextLineText(r, o, e + i, s), s += this.getHeightOfLine(o);
            }
            return {
                textSpans: r,
                textBgRects: n
            }
        },
        _createTextCharSpan: function(i, r, n, s) {
            var o = i !== i.trim() || i.match(e), a = this.getSvgSpanStyles(r, o), c = a ? 'style="' + a + '"' : "",
                h = r.deltaY, l = "", u = fabric.Object.NUM_FRACTION_DIGITS;
            return h && (l = ' dy="' + t(h, u) + '" '), ['<tspan x="', t(n, u), '" y="', t(s, u), '" ', l, c, ">", fabric.util.string.escapeXml(i), "</tspan>"].join("")
        },
        _setSVGTextLineText: function(t, e, i, r) {
            var n, s, o, a, c, h = this.getHeightOfLine(e), l = -1 !== this.textAlign.indexOf("justify"), u = "", f = 0,
                d = this._textLines[e];
            r += h * (1 - this._fontSizeFraction) / this.lineHeight;
            for (var g = 0, p = d.length - 1; p >= g; g++) {
                c = g === p || this.charSpacing, u += d[g], o = this.__charBounds[e][g], 0 === f ? (i += o.kernedWidth - o.width, f += o.width) : f += o.kernedWidth, l && !c && this._reSpaceAndTab.test(d[g]) && (c = !0), c || (n = n || this.getCompleteStyleDeclaration(e, g), s = this.getCompleteStyleDeclaration(e, g + 1), c = this._hasStyleChangedForSvg(n, s)), c && (a = this._getStyleDeclaration(e, g) || {}, t.push(this._createTextCharSpan(u, a, i, r)), u = "", n = s, i += f, f = 0)
            }
        },
        _pushTextBgRect: function(e, i, r, n, s, o) {
            var a = fabric.Object.NUM_FRACTION_DIGITS;
            e.push("		<rect ", this._getFillAttributes(i), ' x="', t(r, a), '" y="', t(n, a), '" width="', t(s, a), '" height="', t(o, a), '"></rect>\n')
        },
        _setSVGTextLineBg: function(t, e, i, r) {
            for (var n, s, o = this._textLines[e], a = this.getHeightOfLine(e) / this.lineHeight, c = 0, h = 0, l = this.getValueOfPropertyAt(e, 0, "textBackgroundColor"), u = 0, f = o.length; f > u; u++) {
                n = this.__charBounds[e][u], s = this.getValueOfPropertyAt(e, u, "textBackgroundColor"), s !== l ? (l && this._pushTextBgRect(t, l, i + h, r, c, a), h = n.left, c = n.width, l = s) : c += n.kernedWidth;
            }
            s && this._pushTextBgRect(t, s, i + h, r, c, a)
        },
        _getFillAttributes: function(t) {
            var e = t && "string" == typeof t ? new fabric.Color(t) : "";
            return e && e.getSource() && 1 !== e.getAlpha() ? 'opacity="' + e.getAlpha() + '" fill="' + e.setAlpha(1).toRgb() + '"' : 'fill="' + t + '"'
        },
        _getSVGLineTopOffset: function(t) {
            for (var e = 0, i = 0, r = 0; t > r; r++) {
                e += this.getHeightOfLine(r);
            }
            return i = this.getHeightOfLine(r), {
                lineTop: e,
                offset: (this._fontSizeMult - this._fontSizeFraction) * i / (this.lineHeight * this._fontSizeMult)
            }
        },
        getSvgStyles: function(t) {
            var e = fabric.Object.prototype.getSvgStyles.call(this, t);
            return e + " white-space: pre;"
        }
    })
}();
!function(t) {
    "use strict";
    var e = t.fabric || (t.fabric = {});
    e.Textbox = e.util.createClass(e.IText, e.Observable, {
        type: "textbox",
        minWidth: 20,
        dynamicMinWidth: 2,
        __cachedLines: null,
        lockScalingFlip: !0,
        noScaleCache: !1,
        _dimensionAffectingProps: e.Text.prototype._dimensionAffectingProps.concat("width"),
        initDimensions: function() {
            this.__skipDimension || (this.isEditing && this.initDelayedCursor(), this.clearContextTop(), this._clearCache(), this.dynamicMinWidth = 0, this._styleMap = this._generateStyleMap(this._splitText()), this.dynamicMinWidth > this.width && this._set("width", this.dynamicMinWidth), -1 !== this.textAlign.indexOf("justify") && this.enlargeSpaces(), this.height = this.calcTextHeight(), this.saveState({propertySet: "_dimensionAffectingProps"}))
        },
        _generateStyleMap: function(t) {
            for (var e = 0, i = 0, r = 0, n = {}, s = 0; s < t.graphemeLines.length; s++) {
                "\n" === t.graphemeText[r] && s > 0 ? (i = 0, r++, e++) : this._reSpaceAndTab.test(t.graphemeText[r]) && s > 0 && (i++, r++), n[s] = {
                    line: e,
                    offset: i
                }, r += t.graphemeLines[s].length, i += t.graphemeLines[s].length;
            }
            return n
        },
        styleHas: function(t, i) {
            if (this._styleMap && !this.isWrapping) {
                var r = this._styleMap[i];
                r && (i = r.line)
            }
            return e.Text.prototype.styleHas.call(this, t, i)
        },
        isEmptyStyles: function(t) {
            var e, i, r = 0, n = t + 1, s = !1, o = this._styleMap[t], a = this._styleMap[t + 1];
            o && (t = o.line, r = o.offset), a && (n = a.line, s = n === t, e = a.offset), i = "undefined" == typeof t ? this.styles : {line: this.styles[t]};
            for (var c in i) {
                for (var h in i[c]) {
                    if (h >= r && (!s || e > h)) {
                        for (var l in i[c][h]) {
                            return !1;
                        }
                    }
                }
            }
            return !0
        },
        _getStyleDeclaration: function(t, e) {
            if (this._styleMap && !this.isWrapping) {
                var i = this._styleMap[t];
                if (!i) {
                    return null;
                }
                t = i.line, e = i.offset + e
            }
            return this.callSuper("_getStyleDeclaration", t, e)
        },
        _setStyleDeclaration: function(t, e, i) {
            var r = this._styleMap[t];
            t = r.line, e = r.offset + e, this.styles[t][e] = i
        },
        _deleteStyleDeclaration: function(t, e) {
            var i = this._styleMap[t];
            t = i.line, e = i.offset + e, delete this.styles[t][e]
        },
        _getLineStyle: function(t) {
            var e = this._styleMap[t];
            return this.styles[e.line]
        },
        _setLineStyle: function(t, e) {
            var i = this._styleMap[t];
            this.styles[i.line] = e
        },
        _deleteLineStyle: function(t) {
            var e = this._styleMap[t];
            delete this.styles[e.line]
        },
        _wrapText: function(t, e) {
            var i, r = [];
            for (this.isWrapping = !0, i = 0; i < t.length; i++) {
                r = r.concat(this._wrapLine(t[i], i, e));
            }
            return this.isWrapping = !1, r
        },
        _measureWord: function(t, e, i) {
            var r, n = 0, s = !0;
            i = i || 0;
            for (var o = 0, a = t.length; a > o; o++) {
                var c = this._getGraphemeBox(t[o], e, o + i, r, s);
                n += c.kernedWidth, r = t[o]
            }
            return n
        },
        _wrapLine: function(t, i, r, n) {
            var s = 0, o = [], a = [], c = t.split(this._reSpaceAndTab), h = "", l = 0, u = " ", f = 0, d = 0, g = 0,
                p = !0, v = this._getWidthOfCharSpacing(), n = n || 0;
            r -= n;
            for (var m = 0; m < c.length; m++) {
                h = e.util.string.graphemeSplit(c[m]), f = this._measureWord(h, i, l), l += h.length, s += d + f - v, s >= r && !p ? (o.push(a), a = [], s = f, p = !0) : s += v, p || a.push(u), a = a.concat(h), d = this._measureWord([u], i, l), l++, p = !1, f > g && (g = f);
            }
            return m && o.push(a), g + n > this.dynamicMinWidth && (this.dynamicMinWidth = g - v + n), o
        },
        isEndOfWrapping: function(t) {
            return this._styleMap[t + 1] ? this._styleMap[t + 1].line !== this._styleMap[t].line ? !0 : !1 : !0
        },
        _splitTextIntoLines: function(t) {
            for (var i = e.Text.prototype._splitTextIntoLines.call(this, t), r = this._wrapText(i.lines, this.width), n = new Array(r.length), s = 0; s < r.length; s++) {
                n[s] = r[s].join("");
            }
            return i.lines = n, i.graphemeLines = r, i
        },
        getMinWidth: function() {
            return Math.max(this.minWidth, this.dynamicMinWidth)
        },
        toObject: function(t) {
            return this.callSuper("toObject", ["minWidth"].concat(t))
        }
    }), e.Textbox.fromObject = function(t, i) {
        return e.Object._fromObject("Textbox", t, i, "text")
    }
}("undefined" != typeof exports ? exports : this);
!function() {
    var t = fabric.Canvas.prototype._setObjectScale;
    fabric.Canvas.prototype._setObjectScale = function(e, i, r, n, s, o, a) {
        var c = i.target;
        if (!("x" === s && c instanceof fabric.Textbox)) {
            return t.call(fabric.Canvas.prototype, e, i, r, n, s, o, a);
        }
        var h = c._getTransformedDimensions().x, l = c.width * (e.x / h);
        return l >= c.getMinWidth() ? (c.set("width", l), !0) : void 0
    }, fabric.util.object.extend(fabric.Textbox.prototype, {
        _removeExtraneousStyles: function() {
            for (var t in this._styleMap) {
                this._textLines[t] || delete this.styles[this._styleMap[t].line]
            }
        }
    })
}();