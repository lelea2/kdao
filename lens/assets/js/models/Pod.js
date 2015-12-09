define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var Pod = Backbone.Model.extend({
        defaults: {
            "coupon_id": "",
            "slot": "",
            "activation_date": "",
            "imgUrl": "http://insight.coupons.com/COS20/_Cache/_ImageCache/img/placeholder.png",
            "offer_summary_top": "default summary",
            "brand": "default brand",
            "value": 0,
            "offer_summary_detail": "default details"
        }
    });

    return Pod;
});
