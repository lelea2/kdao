// js/views/AllCouponsView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'models/Pod',
    'collection/CouponsCollection',
    'views/LensView',
    'text!../../templates/pod.html',
    'text!../../templates/error.html'
], function($, _, Backbone, Pod, AllCoupons, Lens, podHtml, errorHtml) {
    var AllCouponsView = Backbone.View.extend({
        el: "#gallery",

        events: {
            "click .pod .lens-cta": "openLensView"
        },

        requestURL: "backend/coupons.php?define=callback",
        //requestURL: "http://vdevusvr82.corp.coupons.com/lens/index.php?define=callback",

        generateRequestURL: function() {
            var q = this.getURLParam("q"),
                zip = this.getURLParam("zip"),
                url = this.requestURL;
            if (q !== null) {
                url = url + "&submit=search&q=" + q;
            } else if (zip !== null) {
                url = url + "&zip=" + zip;
            }
            return url;
        },

        getURLParam: function(name) {
            var url = window.location.search;
            parameter = (RegExp('(\\?|&)' + name + '=?' + '(.*?)(&|$)', "i").exec(url)||[,,null])[2];
            // unescaping casts to string. we want null to be null instead of 'null'
            if (parameter !== null) {
                parameter = unescape(parameter);
            }
            return parameter;
        },

        initialize: function() {
            var self = this;
            this.collection = new AllCoupons();
            //this.render();
            this.listenTo( this.collection, 'reset', this.render );
            require([this.generateRequestURL()],
                function (response) {
                    //The data object will be the API response for the
                    //JSONP data call.
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
                    if(err.requireType === 'timeout') {
                        var errTemplate = _.template(errorHtml);
                        this.$el.html(errTemplate);
                    }
                }
            );
        },

        render: function(response) {
            this.$el.empty();
            if (this.collection.length == 0) {
                var q = this.getURLParam("q"),
                    zip = this.getURLParam("zip"),
                    errmsg = {
                        zip: (zip === null) ? false : encodeURIComponent(zip),
                        q: (q === null) ? false : encodeURIComponent(q)
                    },
                    errTemplate = _.template(errorHtml, errmsg);
                console.log(errmsg);
                this.$el.html(errTemplate);
            } else {
                //console.log(this.collection.length);
                if (typeof response.activeCount === "undefined") {
                    if (response.zipcode) {
                        this.$el.append("<h2>" + this.collection.length + " Active Offers in " + encodeURIComponent(response.zipcode) + "</h2>");
                    } else {
                        this.$el.append("<h2>" + this.collection.length + " Active National Offers</h2>");
                    }
                } else if (response.activeCount > 0) {
                    this.$el.append("<h2>" + response.activeCount + " Active Offers</h2>");
                }
                this.collection.each(function( item, index ) {
                    if (index === response.activeCount && response.inactiveCount > 0) {
                        this.$el.append("<h2>" + response.inactiveCount + " Expired Offers</h2>");
                    }
                    this.renderPod( item.toJSON());
                }, this );
            }
        },

        renderPod: function(item) {
            if (!item.imgUrl) {
                item.imgUrl = "//cdn.cpnscdn.com/insight.coupons.com/COS20/_Cache/_ImageCache/001/" + item.coupon_id + ".gif";
            }
            var podTemplate = _.template(podHtml, item);
            this.$el.append(podTemplate);
        },

        openLensView: function(e) {
            var target = $(e.target),
                pod = $(target.parents(".pod"));
                cid = $(pod).data("podid"),
                imgURL = $(pod).find("img").attr("src"),
                lensView = null;
            if (!cid) {
                alert("Something is wrong... Please try again");
                return;
            }
            lensView = new Lens({cid: cid, imgURL: imgURL}); //Initalize lens view popup
        }

    });
    return AllCouponsView;
});
