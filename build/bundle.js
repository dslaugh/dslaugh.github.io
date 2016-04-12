/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _CustomEvents = __webpack_require__(2);

	var _CustomEvents2 = _interopRequireDefault(_CustomEvents);

	var _LocStore = __webpack_require__(3);

	var _LocStore2 = _interopRequireDefault(_LocStore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import {compose, curry, extend} from './Utils';


	var Model = {
	    events: (0, _CustomEvents2.default)(),
	    cart_ratings: [],
	    loadRatings: function loadRatings() {
	        Model.cart_ratings = _LocStore2.default.get('cart_ratings') || [];
	        Model.events.emit('ratings_loaded', Model.cart_ratings);
	    },
	    addRating: function addRating(rating) {
	        Model.cart_ratings.push(rating);
	        Model._writeToLocalStorage();
	        Model.events.emit('rating_added', Model.cart_ratings);
	    },
	    _writeToLocalStorage: function _writeToLocalStorage() {
	        _LocStore2.default.set('cart_ratings', Model.cart_ratings);
	    }
	};

	var View = {
	    addRatingBtn: document.querySelector('#AddRatingBtn'),
	    cartNumber: document.querySelector('#CartNumber'),
	    ratings: Array.prototype.slice.call(document.querySelectorAll('input[name=rating]')),
	    ratingsList: document.querySelector('#TopCarts tbody'),
	    renderRatings: function renderRatings(ratings) {
	        var sortedRatings = ratings.sort(function (a, b) {
	            a.score = parseInt(a.score, 10);
	            b.score = parseInt(b.score, 10);
	            return b.score - a.score;
	        });
	        // console.log(sortedRatings);
	        View.ratingsList.innerHTML = sortedRatings.reduce(function (prevVal, currVal) {
	            return prevVal + '<tr><td>Cart #: ' + currVal.number + '</td><td>rating: ' + currVal.score + '</td></tr>';
	        }, '');
	    },
	    bindUIEvents: function bindUIEvents() {
	        View.addRatingBtn.addEventListener('click', Controller.addRating);
	    }
	};

	var Controller = {
	    initialize: function initialize() {
	        Model.events.on('ratings_loaded', View.renderRatings);
	        Model.events.on('rating_added', View.renderRatings);
	        Model.loadRatings();
	        View.bindUIEvents();
	    },
	    addRating: function addRating() {
	        var score = View.ratings.filter(function (rating) {
	            return rating.checked === true;
	        });

	        var rating = {
	            number: View.cartNumber.value,
	            score: score[0].value
	        };

	        Model.addRating(rating);

	        console.log(View.cartNumber.value, score[0].value);
	    }
	};

	Controller.initialize();

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var CustomEvents = function CustomEvents() {
	    var subscribers = {};
	    return {
	        on: function on(topic, fn) {
	            if (typeof topic === 'string' && typeof fn === 'function') {
	                subscribers[topic] = subscribers[topic] || [];
	                subscribers[topic].push(fn);
	            }
	        },
	        off: function off(topic, fn) {
	            subscribers[topic].splice(subscribers[topic].indexOf(fn), 1);
	        },
	        emit: function emit(topic, data) {
	            subscribers[topic].forEach(function (fn) {
	                fn(data);
	            });
	        }
	    };
	};

	exports.default = CustomEvents;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var LocStore = function () {
		function set(name, data) {
			window.localStorage.setItem(name, JSON.stringify(data));
		}
		function get(name) {
			return JSON.parse(window.localStorage.getItem(name));
		}
		function remove(name) {
			window.localStorage.removeItem(name);
		}
		return {
			set: set,
			get: get,
			remove: remove
		};
	}();

	exports.default = LocStore;

/***/ }
/******/ ]);