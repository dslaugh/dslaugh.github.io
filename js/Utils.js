export function compose() {
    const fns = Array.prototype.slice.call(arguments, 0).reverse();
    return initVal => {
        return fns.reduce((prevVal, currVal) => {
            return currVal(prevVal);
        }, initVal);
    };
}

export function curry(fn) {
    return given([]);

    function given(argsSoFar) {
        return function() {
            var updatedArgsSoFar = argsSoFar.concat(Array.prototype.slice.call(arguments, 0));

            if (updatedArgsSoFar.length >= fn.length) {
                return fn.apply(this, updatedArgsSoFar);
            } else {
                return given(updatedArgsSoFar);
            }
        };
    }
}

export function extend(consumer) {
    var providers = Array.prototype.slice.call(arguments, 1);
    providers.forEach(function(provider) {
        for(var key in provider) {
            if (provider.hasOwnProperty(key)) {
                consumer[key] = provider[key];
            }
        }
    });
    return consumer;
}
