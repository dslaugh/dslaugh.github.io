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

	var _CustomEvents = __webpack_require__(1);

	var _CustomEvents2 = _interopRequireDefault(_CustomEvents);

	var _LocStore = __webpack_require__(2);

	var _LocStore2 = _interopRequireDefault(_LocStore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Model = {
	    events: (0, _CustomEvents2.default)(),
	    cart_ratings: [],
	    loadRatings: function loadRatings() {
	        this.cart_ratings = _LocStore2.default.get('cart_ratings') || [];
	        this.events.emit('ratings_loaded', this.cart_ratings);
	    },
	    addRating: function addRating(rating) {
	        // Check to see if cart rating already exists and replace it if so.
	        var existing = this.cart_ratings.filter(function (r) {
	            return r.number === rating.number;
	        });
	        if (existing.length > 0) {
	            var index = this.cart_ratings.indexOf(existing[0]);
	            this.cart_ratings.splice(index, 1, rating);
	        } else {
	            this.cart_ratings.push(rating);
	        }
	        this._writeToLocalStorage();
	        this.events.emit('rating_added', this.cart_ratings);
	    },
	    resetRatings: function resetRatings() {
	        var ok = confirm('Are you sure you want to reset ratings?');
	        if (ok) {
	            this.cart_ratings = [];
	            this._writeToLocalStorage();
	            this.events.emit('ratings_reset', this.cart_ratings);
	        }
	    },
	    _writeToLocalStorage: function _writeToLocalStorage() {
	        _LocStore2.default.set('cart_ratings', this.cart_ratings);
	    }
	};

	var View = {
	    addRatingBtn: document.querySelector('#AddRatingBtn'),
	    addRatingItems: document.querySelector('#AddRatingItems'),
	    saveRatingBtn: document.querySelector('#SaveRatingBtn'),
	    cartNumber: document.querySelector('#CartNumber'),
	    resetRatingsBtn: document.querySelector('#ResetRatings'),
	    ratings: Array.prototype.slice.call(document.querySelectorAll('input[name=rating]')),
	    ratingsList: document.querySelector('#TopCarts tbody'),
	    fiveStarFilterBtn: document.querySelector('#FiveStarFilterBtn'),
	    fourStarFilterBtn: document.querySelector('#FourStarFilterBtn'),
	    threeStarFilterBtn: document.querySelector('#ThreeStarFilterBtn'),
	    twoStarFilterBtn: document.querySelector('#TwoStarFilterBtn'),
	    oneStarFilterBtn: document.querySelector('#OneStarFilterBtn'),
	    cartNumberFilterInput: document.querySelector('#CartNumberFilterInput'),
	    cartNumberFilterBtn: document.querySelector('#CartNumberFilterBtn'),
	    resetFilterBtn: document.querySelector('#ResetFilterBtn'),
	    filterItems: document.querySelector('#FilterItems'),
	    showHideFiltersBtn: document.querySelector('#ShowHideFiltersBtn'),
	    renderRatings: function renderRatings(ratings) {
	        var _this = this;

	        var sortedRatings = ratings.sort(function (a, b) {
	            a.score = parseInt(a.score, 10);
	            b.score = parseInt(b.score, 10);
	            return b.score - a.score;
	        });

	        this.ratingsList.innerHTML = sortedRatings.reduce(function (prevVal, currVal) {
	            return prevVal + '<tr><td class="cart-number">' + currVal.number + '</td><td class="stars">' + _this.renderStars(currVal.score) + '</td></tr>';
	        }, '');
	    },
	    showAddRating: function showAddRating() {
	        this.addRatingItems.style.display = 'block';
	    },
	    hideAddRating: function hideAddRating() {
	        this.addRatingItems.style.display = 'none';
	    },
	    renderStars: function renderStars(numStars) {
	        var i = 0;
	        var stars = '';
	        for (; i < numStars; i++) {
	            stars += '<svg width="40" height="40">\n                <polygon id="star" points="20,5 25,14 35,15 28,23 30,32 20,27 10,32 12,23 6,15 15,14" style="fill:blue"; stroke-width:1; stroke:white; stroke:white;" />\n            </svg>';
	        }
	        return stars;
	    },
	    resetRatingForm: function resetRatingForm() {
	        this.cartNumber.value = '';
	        this.ratings.forEach(function (rating) {
	            rating.checked = false;
	        });
	    },
	    filterFiveStars: function filterFiveStars() {
	        this._filterByStars(5);
	    },
	    filterFourStars: function filterFourStars() {
	        this._filterByStars(4);
	    },
	    filterThreeStars: function filterThreeStars() {
	        this._filterByStars(3);
	    },
	    filterTwoStars: function filterTwoStars() {
	        this._filterByStars(2);
	    },
	    filterOneStar: function filterOneStar() {
	        this._filterByStars(1);
	    },
	    _filterByStars: function _filterByStars(numStars) {
	        this._clearFilters();

	        var rows = this.ratingsList.querySelectorAll('tr');
	        var i = 0;
	        var len = rows.length;
	        for (; i < len; i++) {
	            var svgs = rows[i].querySelectorAll('.stars > svg');
	            var stars = svgs.length;
	            if (stars !== numStars) {
	                rows[i].style.display = 'none';
	            }
	        }
	    },
	    filterByCart: function filterByCart() {
	        var cartNumber = parseInt(this.cartNumberFilterInput.value, 10);
	        if (isNaN(cartNumber)) {
	            alert('Cart number must be a number');
	            return false;
	        }
	        this._filterByCartNumber(cartNumber);
	    },
	    _filterByCartNumber: function _filterByCartNumber(cartNumber) {
	        this._clearFilters();

	        var rows = this.ratingsList.querySelectorAll('tr');
	        var i = 0;
	        var len = rows.length;
	        for (; i < len; i++) {
	            var elemCartNumber = parseInt(rows[i].querySelector('.cart-number').innerText, 10);
	            if (elemCartNumber !== cartNumber) {
	                rows[i].style.display = 'none';
	            }
	        }
	    },
	    resetFilters: function resetFilters() {
	        this.cartNumberFilterInput.value = '';
	        this._clearFilters();
	    },
	    _clearFilters: function _clearFilters() {
	        var rows = this.ratingsList.querySelectorAll('tr');
	        var i = 0;
	        var len = rows.length;
	        for (; i < len; i++) {
	            rows[i].style.display = 'table-row';
	        }
	    },
	    showFilterItems: function showFilterItems() {
	        this.filterItems.display = 'block';
	    },
	    hideFilterItems: function hideFilterItems() {
	        this.filterItems.display = 'none';
	    },
	    bindUIEvents: function bindUIEvents() {
	        this.saveRatingBtn.addEventListener('click', Controller.saveRating);
	        this.addRatingBtn.addEventListener('click', Controller.showHideAddRating);
	        this.fiveStarFilterBtn.addEventListener('click', this.filterFiveStars.bind(View));
	        this.fourStarFilterBtn.addEventListener('click', this.filterFourStars.bind(View));
	        this.threeStarFilterBtn.addEventListener('click', this.filterThreeStars.bind(View));
	        this.twoStarFilterBtn.addEventListener('click', this.filterTwoStars.bind(View));
	        this.oneStarFilterBtn.addEventListener('click', this.filterOneStar.bind(View));
	        this.cartNumberFilterBtn.addEventListener('click', this.filterByCart.bind(View));
	        this.resetFilterBtn.addEventListener('click', this.resetFilters.bind(View));
	        this.showHideFiltersBtn.addEventListener('click', Controller.showHideFilters);
	        // View.resetRatingsBtn.addEventListener('click', Controller.resetRatings);
	    }
	};

	var Controller = {
	    initialize: function initialize() {
	        Model.events.on('ratings_loaded', View.renderRatings.bind(View));
	        Model.events.on('rating_added', View.renderRatings.bind(View));
	        Model.events.on('ratings_reset', View.renderRatings.bind(View));
	        Model.loadRatings();
	        View.bindUIEvents();
	    },
	    showHideAddRating: function showHideAddRating() {
	        if (View.addRatingItems.style.display === 'block') {
	            View.hideAddRating();
	        } else {
	            View.showAddRating();
	        }
	    },
	    showHideFilters: function showHideFilters() {
	        if (View.filterItems.style.display === 'block') {
	            View.filterItems.style.display = 'none';
	        } else {
	            View.filterItems.style.display = 'block';
	        }
	    },
	    saveRating: function saveRating() {
	        var score = View.ratings.filter(function (rating) {
	            return rating.checked === true;
	        });

	        if (score.length < 1 || View.cartNumber.value == '') {
	            alert('Please fill out form');
	            return false;
	        }

	        var rating = {
	            number: View.cartNumber.value,
	            score: score[0].value
	        };
	        Model.addRating(rating);

	        View.resetRatingForm();
	        View.hideAddRating();
	    },
	    resetRatings: function resetRatings() {
	        Model.resetRatings();
	    }
	};

	Controller.initialize();

/***/ },
/* 1 */
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
	            if (subscribers[topic]) {
	                subscribers[topic].forEach(function (fn) {
	                    fn(data);
	                });
	            }
	        }
	    };
	};

	exports.default = CustomEvents;

/***/ },
/* 2 */
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