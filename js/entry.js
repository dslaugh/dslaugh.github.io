// import {compose, curry, extend} from './Utils';
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
// console.log(sortedRatings);
        View.ratingsList.innerHTML = sortedRatings.reduce((prevVal, currVal) => {
            return prevVal + '<tr><td>Cart #: ' + currVal.number + '</td><td>rating: ' + currVal.score + '</td></tr>';
        }, '');
    },
    bindUIEvents: () => {
        View.addRatingBtn.addEventListener('click', Controller.addRating);
        View.resetRatingsBtn.addEventListener('click', Controller.resetRatings);
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
    addRating: () => {
        let score = View.ratings.filter((rating) => {
            return rating.checked === true;
        });

        let rating = {
            number: View.cartNumber.value,
            score: score[0].value,
        };

        Model.addRating(rating);
    },
    resetRatings: () => {
        Model.resetRatings();
    }
};

Controller.initialize();
