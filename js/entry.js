import CustomEvents from './CustomEvents';
import LocStore from './LocStore';

var Model = {
    events: CustomEvents(),
    cart_ratings: [],
    loadRatings: () => {
        Model.cart_ratings = LocStore.get('cart_ratings') || [];
        Model.events.emit('ratings_loaded', Model.cart_ratings);
    },
    addRating: (rating) => {
        Model.cart_ratings.push(rating);
        Model._writeToLocalStorage();
        Model.events.emit('rating_added', Model.cart_ratings);
    },
    resetRatings: () => {
        Model.cart_ratings = [];
        Model._writeToLocalStorage();
        Model.events.emit('ratings_reset', Model.cart_ratings);
    },
    _writeToLocalStorage: () => {
        LocStore.set('cart_ratings', Model.cart_ratings);
    }
};

var View = {
    addRatingBtn: document.querySelector('#AddRatingBtn'),
    addRatingContainer: document.querySelector('#AddRatingContainer'),
    saveRatingBtn: document.querySelector('#SaveRatingBtn'),
    cartNumber: document.querySelector('#CartNumber'),
    resetRatingsBtn: document.querySelector('#ResetRatings'),
    ratings: Array.prototype.slice.call(document.querySelectorAll('input[name=rating]')),
    ratingsList: document.querySelector('#TopCarts tbody'),
    renderRatings: (ratings) => {
        let sortedRatings = ratings.sort((a, b) => {
            a.score = parseInt(a.score, 10);
            b.score = parseInt(b.score, 10);
            return b.score - a.score;
        });

        View.ratingsList.innerHTML = sortedRatings.reduce((prevVal, currVal) => {
            return prevVal + '<tr><td>' + currVal.number + '</td><td>' + View.renderStars(currVal.score) + '</td></tr>';
        }, '');
    },
    showAddRating: () => {
        View.addRatingContainer.style.display = 'block';
    },
    hideAddRating: () => {
        View.addRatingContainer.style.display = 'none';
    },
    renderStars: (numStars) => {
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
    resetRatingForm: () => {
        View.cartNumber.value = '';
        View.ratings.forEach((rating) => {
            rating.checked = false;
        });
    },
    bindUIEvents: () => {
        View.saveRatingBtn.addEventListener('click', Controller.saveRating);
        View.addRatingBtn.addEventListener('click', Controller.showHideAddRating);
        // View.resetRatingsBtn.addEventListener('click', Controller.resetRatings);
    }
};

var Controller = {
    initialize: () => {
        Model.events.on('ratings_loaded', View.renderRatings);
        Model.events.on('rating_added', View.renderRatings);
        Model.events.on('ratings_reset', View.renderRatings);
        Model.loadRatings();
        View.bindUIEvents();
    },
    showHideAddRating: () => {
        if (View.addRatingContainer.style.display === 'block') {
            View.hideAddRating();
        } else {
            View.showAddRating();
        }
    },
    saveRating: () => {
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
    },
    resetRatings: () => {
        Model.resetRatings();
    }
};

Controller.initialize();
