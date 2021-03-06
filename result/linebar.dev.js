/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isTouch = isTouch;
exports.createElement = createElement;
exports.getCallBack = getCallBack;
exports.getSettings = getSettings;
function isTouch() {
	return "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch;
}

function createElement(tag, attr, styles) {
	var element = document.createElement(tag);

	if (typeof attr == "string") element.classList.add(attr);else if ((typeof attr === "undefined" ? "undefined" : _typeof(attr)) == "object") for (var name in attr) {
		element.setAttribute(name, attr[name]);
	}if (styles) {
		for (var name in styles) {
			element.style[name] = styles[name];
		}
	}

	return element;
}

function getCallBack(str) {
	if (typeof str == "string") return new Function("e", str);else if (typeof str == "function") return str;else return function () {};
}

function getSettings(settings, defaults, attributes, element) {
	for (var i in defaults) {
		if (settings[i] === undefined) {
			var attr = element ? element.getAttribute('data-' + (attributes[i] || i)) : null,
			    num = +attr;

			if (attr === "" || attr === "true") attr = true;else if (attr === "false") attr = false;else if (attr !== null && !isNaN(num)) attr = num;

			settings[i] = attr !== null ? attr : defaults[i];
		}
	}return settings;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Output = function Output(id) {
	_classCallCheck(this, Output);

	this._listId = [].concat(id);
};

var APIClass = function () {
	function APIClass() {
		_classCallCheck(this, APIClass);

		this._listId = {};
	}

	_createClass(APIClass, [{
		key: "_call",
		value: function _call(target, name, args) {
			var _this = this;

			var result = [];

			target._listId.forEach(function (id) {

				var value = void 0,
				    obj = _this._listId[id];

				if (obj && typeof obj[name] == "function") value = obj[name].apply(obj, args);

				if (value !== undefined) result.push(value);
			});

			return result.length == 1 ? result[0] : result;
		}
	}, {
		key: "setMethods",
		value: function setMethods(methods) {
			var self = this;

			methods.forEach(function (method) {
				Output.prototype[method] = function () {
					return self._call(this, method, arguments);
				};
			});
		}
	}, {
		key: "add",
		value: function add(target) {
			var id = Math.random();
			this._listId[id] = target;
			return id;
		}
	}, {
		key: "output",
		value: function output(id) {
			return new Output(id);
		}
	}]);

	return APIClass;
}();

var API = exports.API = new APIClass();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _linebar = __webpack_require__(3);

var _api = __webpack_require__(1);

_api.API.setMethods(["setState", "getState", "appendTo"]);

$.fn.linebar = function (settings) {
	var list = [];

	if (this.length) this.each(function () {
		var linebar = new _linebar.Linebar(this, settings);
		this._linebarId = linebar.id;
		list.push(linebar.id);
	});else {
		var linebar = new _linebar.Linebar(null, settings);
		list.push(linebar.id);
	}

	return _api.API.output(list);
};

$('[data-linebar]').linebar();

$.linebar = function (query) {
	var list = [];

	$(query).each(function () {
		if (this._linebarId) list.push(this._linebarId);
	});

	return _api.API.output(list);
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Linebar = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _functions = __webpack_require__(0);

var func = _interopRequireWildcard(_functions);

var _carriage = __webpack_require__(4);

var _field = __webpack_require__(5);

var _bar = __webpack_require__(6);

var _api = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaults = {
    min: 0,
    max: 100,
    from: 0,
    to: 100,
    radius: 10,
    interact: true,
    step: 0,
    fields: true,
    width: "100%",
    onChange: null,
    onClick: null,
    onReady: null
};

var attributes = {
    onChange: "on-change",
    onClick: "on-click",
    onReady: "on-ready"
};

var Linebar = exports.Linebar = function () {
    function Linebar(target) {
        var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Linebar);

        var self = this;

        // add object to API
        this.id = _api.API.add(this);

        func.getSettings(settings, defaults, attributes, target);

        this.width = typeof settings.width == "number" ? settings.width + "px" : settings.width;
        this.carSize = settings.interact ? settings.radius * 2 : 0;
        this.minValue = settings.min;
        this.maxValue = settings.max;
        this.fromValue = settings.from;
        this.toValue = settings.to;
        this.step = settings.step;

        this.target = target ? target : func.createElement("div");
        this.target.style.width = this.width;

        // special values
        this._special = this._calcSpecial();

        // state in pixels
        this._state = {
            min: this._valueToPx(this.minValue),
            max: this._valueToPx(this.maxValue),
            from: this._valueToPx(this.fromValue),
            to: this._valueToPx(this.toValue)
        };

        this.leftCar = new _carriage.Carriage(settings.radius);
        this.rightCar = new _carriage.Carriage(settings.radius);
        this.bar = new _bar.Bar();

        if (settings.fields) {
            this.minField = new _field.Field();
            this.minField.onChange = function (value) {
                self._updateFromState({
                    from: self._valueToPx(value)
                });
            };

            this.maxField = new _field.Field();
            this.maxField.onChange = function (value) {
                self._updateFromState({
                    to: self._valueToPx(value)
                });
            };
        }

        this.setState(settings);

        this.onChange = func.getCallBack(settings.onChange);
        this.onClick = func.getCallBack(settings.onClick);
        this.onReady = func.getCallBack(settings.onReady);

        this._createElements(settings);
        this._listenEvents(settings);

        if (typeof this.onReady == "function") this.onReady(_api.API.output(this.id)); // return API of this object
    }

    _createClass(Linebar, [{
        key: '_resize',
        value: function _resize() {
            this.target.style.width = this.width;

            this._special = this._calcSpecial();

            this._state.max = this._valueToPx(this.maxValue);
            this._state.min = this._valueToPx(this.minValue);

            this._updateFromState({
                from: this._valueToPx(this.fromValue),
                to: this._valueToPx(this.toValue)
            });
        }
    }, {
        key: '_calcSpecial',
        value: function _calcSpecial() {
            var width = this.target.offsetWidth,
                ration = (this.maxValue - this.minValue) / width;

            return {
                width: width,
                ration: ration,
                absCoord: this.target.getBoundingClientRect().left,
                step: this.step ? this.step / ration : 0
            };
        }
    }, {
        key: '_createElements',
        value: function _createElements(settings) {
            this.wrapper = func.createElement("div", "linebar-wrapper");

            var self = this,
                linebar = func.createElement("div", "linebar", { width: "100%" }),
                fields = func.createElement("div", "fields");

            if (settings.fields) {
                var fields = func.createElement("div", "fields"),
                    apply = func.createElement("button", "apply");

                apply.innerText = "↵";
                apply.onclick = function () {
                    self.onClick(self.getState());
                };

                fields.append(this.minField.element, this.maxField.element, apply);

                this.wrapper.append(fields);
            }

            linebar.append(this.leftCar.element, this.rightCar.element, this.bar.element);

            this.wrapper.append(linebar);
            this.target.append(this.wrapper);
        }
    }, {
        key: '_listenEvents',
        value: function _listenEvents(settings) {
            var self = this;

            document.addEventListener("mousemove", function (e) {
                self._updateFromEvent(e);
            });

            if (func.isTouch) this.wrapper.addEventListener("touchmove", function (e) {
                Array.prototype.forEach.call(e.touches, function (touch) {
                    return self._updateFromEvent(touch);
                });
            });

            document.addEventListener("scroll", function () {
                self._special.absCoord = self.target.getBoundingClientRect().left;
            });

            window.addEventListener("resize", function () {
                self._resize();
            });
        }
    }, {
        key: '_updateFromEvent',
        value: function _updateFromEvent(e) {
            var offset = e.clientX - this._special.absCoord,
                target = "";

            if (func.isTouch()) {
                if (this.leftCar.element === e.target) target = "left";else if (this.rightCar.element === e.target) target = "right";
            } else {
                if (this.leftCar.active) target = "left";else if (this.rightCar.active) target = "right";
            }

            if (target == "left") this._update({ from: this._filterValue(offset) });else if (target == "right") this._update({ to: this._filterValue(offset) });
        }
    }, {
        key: '_updateFromState',
        value: function _updateFromState(state) {
            this.leftCar.active = true;
            this.rightCar.active = true;

            this._update(state, true);

            this.leftCar.active = false;
            this.rightCar.active = false;
        }
    }, {
        key: '_update',
        value: function _update(state) {
            state = this._filterState(state);

            var fromValue = this._pxToValue(state.from),
                toValue = this._pxToValue(state.to);

            this.leftCar.move(state.from);
            this.rightCar.move(state.to);
            this.bar.setState(state);

            this._state.from = state.from;
            this._state.to = state.to;

            if (fromValue != this.fromValue || this.toValue != toValue) {
                this.fromValue = fromValue;
                this.toValue = toValue;

                if (this.minField) this.minField.setValue(fromValue);

                if (this.maxField) this.maxField.setValue(toValue);

                if (typeof this.onChange == "function") this.onChange(this.getState());
            }
        }
    }, {
        key: '_filterValue',
        value: function _filterValue(value) {
            return this._special.step ? this._special.step * Math.round(value / this._special.step) : value;
        }
    }, {
        key: '_filterState',
        value: function _filterState(state) {
            if (state.from === undefined) state.from = this._state.from;
            if (state.to === undefined) state.to = this._state.to;

            if (this.leftCar.active) {
                if (state.to - state.from < this.carSize) state.from = state.to - this.carSize;

                if (state.from < this._state.min) state.from = this._state.min;

                if (state.from > this._state.max - this.carSize) state.from = this._state.max - this.carSize;
            }

            if (this.rightCar.active) {
                if (state.to - state.from < this.carSize) state.to = state.from + this.carSize;

                if (state.to > this._state.max) state.to = this._state.max;

                if (state.to < this._state.min + this.carSize) state.to = this._state.min + this.carSize;
            }

            return state;
        }
    }, {
        key: 'appendTo',
        value: function appendTo(element) {
            element = element.length ? element[0] : element;
            element.append(this.target);
            this._resize();
        }
    }, {
        key: 'setState',
        value: function setState(state) {
            this._updateFromState({
                from: this._valueToPx(state.from),
                to: this._valueToPx(state.to)
            });
        }
    }, {
        key: 'getState',
        value: function getState() {
            return {
                min: this.minValue,
                max: this.maxValue,
                from: this.fromValue,
                to: this.toValue
            };
        }
    }, {
        key: '_pxToValue',
        value: function _pxToValue(px) {
            if (px !== undefined) return px * this._special.ration + this.minValue;
        }
    }, {
        key: '_valueToPx',
        value: function _valueToPx(val) {
            if (val !== undefined) return (val - this.minValue) / this._special.ration;
        }
    }]);

    return Linebar;
}();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Carriage = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _functions = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Carriage = exports.Carriage = function () {
	function Carriage(radius) {
		_classCallCheck(this, Carriage);

		var self = this;

		this.radius = radius;
		this.active = true;

		this.element = (0, _functions.createElement)("div", "carriage", {
			position: "absolute",
			left: 0,
			top: 0,
			margin: "auto",
			width: this.radius * 2 + "px",
			height: this.radius * 2 + "px"
		});

		this.element.ondragstart = function () {
			return false;
		};

		this._listenEvents();
	}

	_createClass(Carriage, [{
		key: "_listenEvents",
		value: function _listenEvents() {
			var self = this;

			if ((0, _functions.isTouch)()) {
				this.element.addEventListener("touchstart", function (e) {
					self.active = true;
				});

				document.addEventListener("touchend", function () {
					self.active = false;
				});
			} else {
				this.element.addEventListener("mousedown", function () {
					self.active = true;
				});

				document.addEventListener("mouseup", function () {
					self.active = false;
				});
			}
		}
	}, {
		key: "move",
		value: function move(offset) {
			if (this.active) this.element.style.transform = "translateX(" + (offset - this.radius) + "px)";
		}
	}]);

	return Carriage;
}();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Field = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _functions = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Field = exports.Field = function () {
    function Field(settings) {
        _classCallCheck(this, Field);

        var self = this;

        this.element = (0, _functions.createElement)("input", { type: "text" });
        this.onChange = function () {};

        this.element.addEventListener("input", function () {
            var value = self.element.value;
            if (isNaN(+value)) value = value.slice(0, -1);
            self.element.value = value;
        });

        this.element.addEventListener("change", function (e) {
            self.onChange(self.element.value);
        });
    }

    _createClass(Field, [{
        key: "setValue",
        value: function setValue(value) {
            value = Math.round(value);
            this.element.value = value;
        }
    }]);

    return Field;
}();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Bar = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _functions = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bar = exports.Bar = function () {
    function Bar() {
        _classCallCheck(this, Bar);

        this.element = (0, _functions.createElement)("div", "bar");
        this.element.ondragstart = function () {
            return false;
        };
    }

    _createClass(Bar, [{
        key: "setState",
        value: function setState(state) {
            this.element.style.left = state.from + "px";
            this.element.style.width = state.to - state.from + "px";
        }
    }]);

    return Bar;
}();

/***/ })
/******/ ]);