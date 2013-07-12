// Creates a *single* element from an HTML string.
function elementFromHTML(html) {
    var temp = document.createElement('div');
    if (!html) return temp;
    temp.innerHTML = html;
    return temp.firstElementChild;
}

// Loads a stylesheet with the given the URL.
function loadStylesheet(href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    document.head.appendChild(link);
    return link;
}

// Given an element, it returns its tag name
function tagName(element) {
    return element && element.nodeName && element.nodeName.toLowerCase();
}

// Translates the given element `px` pixels horizontally
function translateX(element, px) {

    if (!_.isElement(element)) throw new Error('Value is not a DOM element');

    var rule = (px) ? 'translateX('+px+'px)' : '';

    if (element.style && element.style[cssTransform] !== rule) {
        element.style[cssTransform] = rule;
    }
}

// Given two arrays, it checks whether all the values in the second
// array are identical to the values in the beginning of the first array.
// 
//     startsWith([1,2,3,4,5], [1,2])
//     => true
//        
//     startsWith([1,2,3,4,5], [1,2,4])
//     => false
//   
function startsWith(a, b) {

    if (!_.isArray(a) || !_.isArray(b)) throw new Error('Value is not an array');

    if (a.length < b.length) {
        return false;
    }

    var i = Math.min(a.length, b.length);

    while (i--) {
        if (a[i] !== b[i]) return false;
    }

    return true;
}

// Given an element or NodeList, it returns a *chainable* object
// with `on` and `off` methods, each calling `addEventListener`
// and `removeEventListener`, respectively.
function attachEventTo(elements) {

    if (!elements) return elements;

    if (elements.addEventListener) {
        elements = [elements];
    } else if (elements[0].addEventListener) {
        elements = _.toArray(elements);
    } else {
        throw new Error('Could not attach event to element');
    }

    function on(event, callback, capture) {
        _.forEach(elements, function(element) {
            document.addEventListener.call(element, event, callback, capture || false);
        });
        return this;
    }

    function off(event, callback, capture) {
        _.forEach(elements, function(element) {
            document.removeEventListener.call(element, event, callback, capture || false);
        });
        return this;
    }

    return {
        on: on,
        off: off
    };
}

// Given a variants array, it detects whether it contains at least one 
// italic variant. 
// 
// Variants arrays are used by the Google Font Developer API
// See: https://developers.google.com/fonts/docs/developer_api#Example
//
//     hasItalic(['300', '300italic', 700])
//      => true
//        
function hasItalic(variants) {
    return _.some(variants, function(weight) {
        return (weight.indexOf('italic') !== -1);
    });
}

// Given a variants array, it returns an array of weights available.
//   
//     getWeights(['300', '300italic', 700])
//     => ['300', '700']
//       
function getWeights(variants) {

    var weights = [];

    if (!variants) return weights;

    _.forEach(variants, function(weight) {
        if (weight === 'regular' || weight === 'italic') {
            weight = '400';
        }
        // all valid weights are three-digit
        weight = weight.slice(0,3);
        // check for duplicates
        if (weights.indexOf(weight) === -1) {
            weights.push(weight);
        }
    });

    return weights;
}

// Given an element and [parent] (optional), it climbs up the DOM tree
// and returns dataset.fontFamily if specified on the element or on 
// any of its parents up until [parent].
function getFamily(element, parent) {

    if (!element) return null;
    
    parent = parent || document.body;

    while (parent.contains(element)) {
        if (element && element.dataset && element.dataset.fontFamily !== undefined)
            return element.dataset.fontFamily;
        element = element.parentNode;
    }

    return null;
}
