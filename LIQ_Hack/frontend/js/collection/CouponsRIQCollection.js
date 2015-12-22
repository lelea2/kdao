define([
    'jquery',
    'underscore',
    'backbone',
    'models/PodRIQ'
], function($, _, Backbone, PodRIQ){
    var AllRIQCoupons = Backbone.Collection.extend({
        //url: 'backend/coupons.php',
        model: PodRIQ

        //url: '../backend/coupons/offers_mock.php'
    });

    return AllRIQCoupons;
});