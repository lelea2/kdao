define([
    'jquery',
    'underscore',
    'backbone',
    'models/Pod'
], function($, _, Backbone, Pod){
    var AllCoupons = Backbone.Collection.extend({
        //url: 'backend/coupons.php',
        model: Pod

        //url: '../backend/coupons/offers_mock.php'
    });

    return AllCoupons;
});