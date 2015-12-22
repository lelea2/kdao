define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var PodRIQ = Backbone.Model.extend({
        defaults: {
            "offerCode": "",
            "offerImage": {
                "offerImage1": ""
            },
            "offerSummary": "default summary",
            "brandName": "default brand",
            "offerDescription": "default details"
        }
    });

    return PodRIQ;
});