// js/views/AllCouponsView.js
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    var AdminView = Backbone.View.extend({
        el: ".admin",

        events: {
            "click button": "generateWidget",
            "change input[name=search]": "generateSearchField",
            "change input[name=couponsource]": "generateRIQField",
            "change input[name=storename]": "generateStoreField"
        },

        riqObj: {
            "dg": ["../img/dollar_general.jpg", "#050505", "#dbdb58"],
            "wg": ["../img/walgreen.jpg", "#eb3434", "#ededed"],
            "marsh": ["../img/marsh.jpg", "#e01b1b", "#ffffff"],
            "heb": ["../img/heb.jpg", "#e83a3a", "#ffffff"]
        },

        //requestURL: "backend/coupons.php?define=callback",
        //requestURL: "http://vdevusvr82.corp.coupons.com/lens/index.php?define=callback",
        generateRIQField: function() {
            var source = $("input[name=couponsource]:checked").val();
            if (source === "riq") {
                this.$el.find(".riqlist").removeClass("hidden");
                $("input[name=search]").prop("disabled", true);
                $("input[name=branddisplay]").prop("disabled", true);
                this.$el.find(".region-brand").addClass("disabled");
                this.$el.find(".region-search").addClass("disabled");
                var storename = $("input[name=storename]").val();
                $(".riqlist img").attr("src", this.riqObj[storename][0]);
                $("input[name=colortheme]").val(this.riqObj[storename][1]);
                $("input[name=colortext]").val(this.riqObj[storename][2]);
                $($($("input[name=colortheme]").next(".minicolors-swatch")).children(".minicolors-swatch-color")).css("background-color", this.riqObj[storename][1]);
                $($($("input[name=colortext]").next(".minicolors-swatch")).children(".minicolors-swatch-color")).css("background-color", this.riqObj[storename][2]);
            } else {
                this.$el.find(".riqlist").addClass("hidden");
                $("input[name=search]").prop("disabled", false);
                this.$el.find(".region-search").removeClass("disabled");
                $("input[name=branddisplay]").prop("disabled", false);
                this.$el.find(".region-brand").removeClass("disabled");
            }
        },

        generateStoreField: function() {
            var storename = $("input[name=storename]:checked").val();
            $(".riqlist img").attr("src", this.riqObj[storename][0]);
            $("input[name=colortheme]").val(this.riqObj[storename][1]);
            $("input[name=colortext]").val(this.riqObj[storename][2]);
            $($($("input[name=colortheme]").next(".minicolors-swatch")).children(".minicolors-swatch-color")).css("background-color", this.riqObj[storename][1]);
            $($($("input[name=colortext]").next(".minicolors-swatch")).children(".minicolors-swatch-color")).css("background-color", this.riqObj[storename][2]);
        },

        generateSearchField: function() {
            var s = $("input[name=search]:checked").val();
            if (s === "no") {
                this.$el.find(".staticlist").removeClass("hidden");
            } else {
                this.$el.find(".staticlist").addClass("hidden");
            }
        },

        generateWidget: function() {
            //console.log("hello");
            var size = $("input[name=widgetsize]:checked").val().split("x");
                listitem = encodeURIComponent($("input[name=listitem]").val()) || "",
                title = encodeURIComponent($("input[name=title]").val()),
                style = $("input[name=cs]:checked").val(),
                brand = $("input[name=branddisplay]:checked").val(),
                source = $("input[name=couponsource]:checked").val(),
                s = (source === "riq") ? "no" : $("input[name=search]:checked").val(),
                storename = (source === "cpr") ? "" : $("input[name=storename]:checked").val(),
                color = encodeURIComponent($("input[name=colortheme]").val()),
                textcolor = encodeURIComponent($("input[name=colortext]").val());
                embeddedURL = "",
                url = "http://vdevusvr79.corp.coupons.com/prototypes/LIQ/?size=" + size + "&color=" + color + "&tc=" + textcolor + "&b=" + brand + "&c=" + style  + "&t=" + title + "&s=" + s + "&source=" + source;
            if (s === "no" && listitem !== "" && source === "cpr") {
                url += "&i=" + listitem;
            }
            if (source === "riq") {
                url += "&store=" + storename;
            }
            //Gererate text area (copy & paste region)
            embeddedURL = '<iframe scrolling="no" frameborder="0" style="width:' + size[0] + 'px; height:' + size[1] + 'px;" src="' + url + '"></iframe>';
            this.$el.find('textarea').text(embeddedURL);

            //Generate iframe preview src URL
            this.$el.find('iframe').attr('src', url);
        },

        initialize: function() {
            this.render();
        },

        render: function() {
            this.generateColorPicker();
        },

        generateColorPicker: function() {
            var colortheme = $(".colorpicker"),
                colortext = $(".colortext"),
                combined = colortheme.add(colortext);
            $(combined).minicolors({
                control: $(this).attr('data-control') || 'hue',
                defaultValue: $(this).attr('data-defaultValue') || '',
                inline: $(this).attr('data-inline') === 'true',
                letterCase: $(this).attr('data-letterCase') || 'lowercase',
                opacity: $(this).attr('data-opacity'),
                position: $(this).attr('data-position') || 'bottom left',
                change: function(hex, opacity) {
                    var log;
                    try {
                        log = hex ? hex : 'transparent';
                        if( opacity ) log += ', ' + opacity;
                        //console.log(log);
                    } catch(e) {}
                },
                theme: 'default'
            });
        }

    });

    return AdminView;
});
