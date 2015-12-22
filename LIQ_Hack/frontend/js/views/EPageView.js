// js/views/AllCouponsView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'models/Pod',
    'collection/CouponsCollection',
    'text!../../templates/pod.html'
], function($, _, Backbone, Pod, AllCoupons, podHtml) {
    var EPageView = Backbone.View.extend({
        el: ".mod-epage",
        collection: null,
        initialize: function() {
            var self = this,
                tmpl = '',
                url;
            this.collection = new AllCoupons();
            url = "http://vdevusvr67.corp.coupons.com/exitintent/genintentcoupons.php";
            tmpl = this.getURLParam('tmpl');

                //?tmpl=geo&zip=94089
            if (tmpl === "geo") {
                url = url + "?tmpl=geo&zip=94089";
            } else if (tmpl === "brand") {
                url = url + "?tmpl=brand";
            } else {
                url = url + "?tmpl=coprint&cids=18055363,18055390,18079182,18079186";
            }
            require([url],
                function (response) {
                    //console.log(response);
                    //The data object will be the API response for the
                    //JSONP data call.
                    //console.log(response);
                    if (response && response.offers) {
                        var items = response.offers,
                            podData;

                        _.each(items, function(item, index) {
                            podData = item;
                            self.collection.push(new Pod(podData));
                        });
                    }
                    self.render(response);
                },
                function (err) { //Error handling on TIMEOUT

                }
            );
        },

        render: function(){
            this.$el.find('.gallery').empty();
            if (this.collection.length == 0) {
                this.$el.find('.gallery').html('Sorry there is no matching offers currently available.');
            } else {
                this.collection.each(function( item, index ) {
                    //console.log(item);
                    this.renderPod( item.toJSON());
                }, this );
            }
        },

        renderPod: function(item) {
            if (!item.imgUrl) {
                item.imgUrl = "//cdn.cpnscdn.com/insight.coupons.com/COS20/_Cache/_ImageCache/001/" + item.coupon_id + ".gif";
            }
            var podTemplate = _.template(podHtml, item);
            this.$el.find(".gallery").append(podTemplate);
        },

        /**
         * Helper function to get URL parameter
         */
        getURLParam: function(name) {
            var url = window.location.search;
            parameter = (RegExp('(\\?|&)' + name + '=?' + '(.*?)(&|$)', "i").exec(url)||[,,null])[2];
            // unescaping casts to string. we want null to be null instead of 'null'
            if (parameter !== null) {
                parameter = unescape(parameter);
            }
            return parameter;
        }

    });

    return EPageView;
});