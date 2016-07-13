import CustomEvents from './CustomEvents';
import LocStore from './LocStore';

var Model = {
    events: CustomEvents(),
    cart_ratings: [],
    loadRatings: function() {
        this.cart_ratings = LocStore.get('cart_ratings') || [];
        this.events.emit('ratings_loaded', this.cart_ratings);
    },
    addRating: function(rating) {
        // Check to see if cart rating already exists and replace it if so.
        var existing = this.cart_ratings.filter((r) => {
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
    resetRatings: function() {
        var ok = confirm('Are you sure you want to reset ratings?');
        if (ok) {
            this.cart_ratings = [];
            this._writeToLocalStorage();
            this.events.emit('ratings_reset', this.cart_ratings);
        }
    },
    _writeToLocalStorage: function() {
        LocStore.set('cart_ratings', this.cart_ratings);
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
    renderRatings: function(ratings) {
        let sortedRatings = ratings.sort((a, b) => {
            a.score = parseInt(a.score, 10);
            b.score = parseInt(b.score, 10);
            return b.score - a.score;
        });

        this.ratingsList.innerHTML = sortedRatings.reduce((prevVal, currVal) => {
            return prevVal + '<tr><td class="cart-number">' + currVal.number + '</td><td class="stars">' + this.renderStars(currVal.score) + '</td></tr>';
        }, '');
    },
    showAddRating: function() {
        this.addRatingItems.style.display = 'block';
    },
    hideAddRating: function() {
        this.addRatingItems.style.display = 'none';
    },
    renderStars: function(numStars) {
        let i = 0;
        let stars = '';
        for(; i<numStars; i++) {
            stars +=
            `<svg width="40" height="40">
                <polygon id="star" points="20,5 25,14 35,15 28,23 30,32 20,27 10,32 12,23 6,15 15,14" style="fill:blue"; stroke-width:1; stroke:white; stroke:white;" />
            </svg>`;
        }
        return stars;
    },
    resetRatingForm: function() {
        this.cartNumber.value = '';
        this.ratings.forEach((rating) => {
            rating.checked = false;
        });
    },
    filterFiveStars: function() {
        this._filterByStars(5);
    },
    filterFourStars: function() {
        this._filterByStars(4);
    },
    filterThreeStars: function() {
        this._filterByStars(3);
    },
    filterTwoStars: function() {
        this._filterByStars(2);
    },
    filterOneStar: function() {
        this._filterByStars(1);
    },
    _filterByStars: function(numStars) {
        this._clearFilters();

        let rows = this.ratingsList.querySelectorAll('tr');
        let i = 0;
        let len = rows.length;
        for (; i<len; i++) {
            let svgs = rows[i].querySelectorAll('.stars > svg');
            let stars = svgs.length;
            if (stars !== numStars) {
                rows[i].style.display = 'none';
            }
        }
    },
    filterByCart: function() {
        let cartNumber = parseInt(this.cartNumberFilterInput.value, 10);
        if (isNaN(cartNumber)) {
            alert('Cart number must be a number');
            return false;
        }
        this._filterByCartNumber(cartNumber);
    },
    _filterByCartNumber: function(cartNumber) {
        this._clearFilters();

        let rows = this.ratingsList.querySelectorAll('tr');
        let i = 0;
        let len = rows.length;
        for (; i<len; i++) {
            let elemCartNumber = parseInt(rows[i].querySelector('.cart-number').innerText, 10);
            if (elemCartNumber !== cartNumber) {
                rows[i].style.display = 'none';
            }
        }
    },
    resetFilters: function() {
        this.cartNumberFilterInput.value = '';
        this._clearFilters();
    },
    _clearFilters: function() {
        let rows = this.ratingsList.querySelectorAll('tr');
        let i = 0;
        let len = rows.length;
        for (; i<len; i++) {
            rows[i].style.display = 'table-row';
        }
    },
    showFilterItems: function() {
        this.filterItems.display = 'block';
    },
    hideFilterItems: function() {
        this.filterItems.display = 'none';
    },
    bindUIEvents: function() {
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
    initialize: function() {
        Model.events.on('ratings_loaded', View.renderRatings.bind(View));
        Model.events.on('rating_added', View.renderRatings.bind(View));
        Model.events.on('ratings_reset', View.renderRatings.bind(View));
        Model.loadRatings();
        View.bindUIEvents();
    },
    showHideAddRating: function() {
        if (View.addRatingItems.style.display === 'block') {
            View.hideAddRating();
        } else {
            View.showAddRating();
        }
    },
    showHideFilters: function() {
        if (View.filterItems.style.display === 'block') {
            View.filterItems.style.display = 'none';
        } else {
            View.filterItems.style.display = 'block';
        }
    },
    saveRating: function() {
        let score = View.ratings.filter((rating) => {
            return rating.checked === true;
        });

        if ((score.length < 1) || (View.cartNumber.value == '')) {
            alert('Please fill out form');
            return false;
        }

        let rating = {
            number: View.cartNumber.value,
            score: score[0].value,
        };
        Model.addRating(rating);

        View.resetRatingForm();
        View.hideAddRating();
    },
    resetRatings: function() {
        Model.resetRatings();
    }
};

Controller.initialize();
