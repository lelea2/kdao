// js/views/AllCouponsView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'models/Pod',
    'models/PodRIQ',
    'collection/CouponsCollection',
    'collection/CouponsRIQCollection',
    'text!../../templates/pod.html',
    'text!../../templates/podRIQ.html',
    'colorpicker'
], function($, _, Backbone, Pod, PodRIQ, AllCoupons, AllRIQCoupons, podHtml, podRIQHtml) {
    var LIQView = Backbone.View.extend({
        el: ".liq",
        collection: null,
        arr: [],
        source: "",
        collectionCount: [],
        collectionItems: [],

        events: {
            "click .search-btn": "generateSearch",
            "click .badge": "generatePreClipped",
            "click .pod": "handlePodClick"
        },

        riqObj: {
            "dg": ["../img/dollar_general.jpg", "#050505", "#dbdb58"],
            "wg": ["../img/walgreen.jpg", "#eb3434", "#ededed"],
            "marsh": ["../img/marsh.jpg", "#e01b1b", "#ffffff"],
            "heb": ["../img/heb.jpg", "#e83a3a", "#ffffff"]
        },

        initialize: function() {
            this.source = this.getURLParam("source");
            var storename = this.getURLParam("store") || "",
                self = this;
                url = "";

            if (this.source === "riq" && storename !== "") {
                this.collection = new AllRIQCoupons();
                url = "/prototypes/LIQ/backend/offers.php?storename=" + storename;
                //console.log(url);
                require([url],
                    function (response) {
                        console.log(response);
                        //The data object will be the API response for the
                        //JSONP data call.
                        //console.log(response);
                        if (response && response.offer) {
                            var items = response.offer,
                                podData;

                            _.each(items, function(item, index) {
                                podData = item;
                                self.collection.push(new PodRIQ(podData));
                            });
                        }
                        self.render(response);
                        self.$el.find(".logo").attr("src", self.riqObj[storename][0]);
                    },
                    function (err) { //Error handling on TIMEOUT

                    }
                );
            } else { //cpr
                var item = this.getURLParam("i") || "",
                    s = this.getURLParam("s");
                if (item !== "" && s=== "no") {
                    this.generateSearch();
                }
            }
        },

        render: function(){
            var self = this;
            this.$el.find('.gallery').empty();
            this.$el.find('.loading-indicator').addClass("hidden");
            if (this.collection.length == 0) {
                this.$el.find('.gallery').html('Sorry there is no matching offers currently available.');
            } else {
                if (this.collectionItems.length > 0) {
                    //console.log(this.collectionItems[0]);
                    this.$el.find('.gallery').append('<div class="segment">' + this.collectionItems[0] + '(' + this.collectionCount[0] + ')</div>');
                }
                var currArrIndex = 0,
                    nextCount = 0 + this.collectionCount[currArrIndex];
                this.collection.each(function( item, index ) {
                    //console.log(index);
                    if (index === nextCount) {
                        currArrIndex += 1;
                        self.$el.find('.gallery').append('<div class="segment">' + self.collectionItems[currArrIndex] + ' (' + self.collectionCount[currArrIndex] + ')</div>');
                        //self.renderPod( item.toJSON());
                        nextCount += self.collectionCount[currArrIndex];
                        console.log(nextCount);
                    }
                    self.renderPod( item.toJSON());
                }, this);
            }
        },

        renderPod: function(item) {
            if (this.source === "cpr") { //Normal coupons
                if (!item.imgUrl) {
                    item.imgUrl = "//cdn.cpnscdn.com/insight.coupons.com/COS20/_Cache/_ImageCache/001/" + item.coupon_id + ".gif";
                }
                var podTemplate = _.template(podHtml, item);
            } else {//For RIQ coupons
                var podTemplate = _.template(podRIQHtml, item);
            }
            this.$el.find(".gallery").append(podTemplate);
        },

        generateRequestURL: function() { //TODO: New API from Manasi
            var query = this.$el.find("#items").val();
            if (query === undefined || query === "") {
                query = this.getURLParam("i") || "";
            }
            //console.log(query);
            return "http://vdevusvr67.corp.coupons.com/exitintent/genintentcoupons.php?tmpl=search&query=" + query;
        },

        generateSearch: function() {
            //console.log("testing");
            var self = this;
            this.collection = new AllCoupons();
            //this.collectionArr = [];
            //this.render();
            this.$el.find('.loading-indicator').removeClass("hidden");
            this.listenTo( this.collection, 'reset', this.render);
            require([this.generateRequestURL()],
                function (response) {
                    //The data object will be the API response for the
                    //JSONP data call.
                    //console.log(response);
                    if (response && response.offers) {
                        var items = response.offers,
                            podData;
                            //podLength = 0;
                        _.each(items, function(item, index) { //search data
                            _.each(item, function(poditem, podindex) {
                                podData = poditem;
                                self.collection.push(new Pod(podData));
                            });
                        });
                    }
                    if (response && response.counts) {
                        var counts = response.counts;
                        self.collectionCount = [];
                        self.collectionItems = [];
                        _.each(counts, function(count, item) {
                            //console.log(item);
                            //console.log(count);
                            self.collectionCount.push(count);
                            self.collectionItems.push(item);
                        });
                    }
                    self.render(response);
                },
                function (err) { //Error handling on TIMEOUT

                }
            );
        },

        generatePreClipped: function() {
            var arrCids = this.arr.join("~");
            window.location = "/?cid=" + arrCids;
        },

        handlePodClick: function(e) {
            var target = $(e.target),
                pod = $(target).hasClass("pod") ? $(target) : $(target).parents(".pod"),
                podid = $(pod).data("podid"),
                index = 0;
            if (podid === undefined) {
                return;
            }
            if ($.inArray(podid, this.arr) < 0) {
                this.arr.push(podid);
                $(".btn-cta", pod).html("Added");
                $(pod).addClass("added");
            } else {
                index = $.inArray(podid, this.arr);
                this.arr.splice(index, 1);
                $(".btn-cta", pod).html("Add Coupon");
                $(pod).removeClass("added");
            }
            //Update count
            this.$el.find('.badge span').html(this.arr.length);
            console.log(this.arr);
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

    return LIQView;
});
