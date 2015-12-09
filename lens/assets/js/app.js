define([
    'jquery',
    'underscore',
    'backbone',
    'views/AllCouponsView',
], function($, _, Backbone, AllCouponsView) {
    var initialize = function(){
        var allCouponsView = new AllCouponsView();
    };

    return {
        initialize: initialize
    };
});
