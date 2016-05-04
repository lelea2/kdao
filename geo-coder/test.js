//sudo npm install node-geocoder -g

var geocoderProvider = 'google';
var httpAdapter = 'http';
var extra = {};

var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

// Using callback
geocoder.geocode('4900 Marie P DeBartolo Way, Santa Clara, CA 95054', function(err, res) {
    console.log(res);
});

// Or using Promise
/*geocoder.geocode('29 champs elysée paris')
    .then(function(res) {
        console.log(res);
    })
    .catch(function(err) {
        console.log(err);
    });*/
