// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
    baseUrl: "assets/js",
    // The shim config allows us to configure dependencies for
    // scripts that do not call define() to register a module
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        text: {
            deps: ['backbone']
        },
        "jquery-ui": {
            deps: ["jquery"]
        },
        "highcharts": {
            deps: ["jquery"]
        },
        "highcharts-more": {
            deps: [
                "jquery",
                "highcharts"
            ]
        }
    },
    paths: {
        jquery: 'lib/jquery.min',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        text: 'lib/text',
        "jquery-ui": "lib/jquery-ui.min",
        "highcharts": "lib/highstock",
        "highcharts-more": "lib/highcharts-more",
        "highcharts-trendline": "lib/regression"
    }
});

require([
    // Load our app module and pass it to our definition function
    'app'
], function(App) {
    // The "app" dependency is passed in as "App"
    // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
    App.initialize();
});
