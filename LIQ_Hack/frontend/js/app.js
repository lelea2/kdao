define([
    'jquery',
    'underscore',
    'backbone',
    'views/AdminView',
    'views/LIQView',
    'views/EPageView'
], function($, _, Backbone, AdminView, LIQView, EPageView) {
    var initialize = function(){
        var adminView = new AdminView(),
            epageView = new EPageView(),
            liqView = new LIQView(); //TODO: this should be distinguished by router
    };

    return {
        initialize: initialize
    };
});
