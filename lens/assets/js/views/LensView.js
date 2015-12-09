// js/views/LensView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'text!../../templates/lens.html',
    'jquery-ui',
    'highcharts',
    'highcharts-more',
    'highcharts-trendline'
], function($, _, Backbone, lensViewTemplate) {
    var Lens = Backbone.View.extend({
        el: ".lens",
        couponID: "",
        lensKeyData: {},
        lensTrendData: {},
        imgUrl:  "",
        timestamp: "",

        initialize: function(params) {
            var that = this;
            if (params.cid) {
                //console.log(params.cid);
                //backend/coupons.php?define=callback
                //require(["http://vdevusvr82.corp.coupons.com/lens/index.php?define=callback&cid=" + cid],
                that.imgUrl = params.imgURL;
                require(["backend/coupons.php?define=callback&type=key&cid=" + params.cid],
                    function(response) {
                        //JSONP data call
                        that.lensKeyData = response.keyStats;
                        that.timestamp = response.keyStats.lastModified;
                        that.couponID = response.keyStats.offerInfo.cid;
                        that.render(response.keyStats);
                    }
                );
            }
        },

        render: function(response) {
            var that = this,
                length2 = ((response.offerInfo.remainDays)/(response.offerInfo.totalDays)) * 500;

            /**Adding necessary data needed in response for lens view **/
            response.offerInfo.activationLimit = this.numberWithCommas(response.offerInfo.activationLimit);
            response.offerInfo.imgURL = that.imgUrl;
            response.perfInfo.aggrActivations = this.numberWithCommas(response.perfInfo.aggrActivations);
            response.perfInfo.velocity = this.numberWithCommas(response.perfInfo.velocity);
            //modify approprite length for timeline here
            response.offerInfo.length2 = (length2 < 85) ? 85 : length2; //Setting min-length
            response.offerInfo.length1 = 500 - response.offerInfo.length2;

            var lensTemplate = _.template(lensViewTemplate, {response: response});
            //Closing the previous dialog if there is any
            try {
                $(".dialog").dialog("close"); //close old dialog first if it exists
            } catch(ex) {
                //Silent catching error
            }
            $(".dialog").empty();
            $(".dialog").html(lensTemplate);
            $(".dialog").dialog({
                dialogClass: "flyout-outer",
                modal: true,
                position: {
                    my: "center top+30",
                    at: "center top",
                    of: window
                },
                closeText: "&times;",
                width: 796,
                open: function() {
                    /**Hacky way for dialog, should figure out better way **/
                    var dWindow = $(".dialog").closest('.ui-dialog');
                    if( parseInt( dWindow.css('top'), 10) < 50 )  {
                        dWindow.css('top', '50px');
                    }
                    that.handleLensView(that);
                }
            });
        },

        numberWithCommas: function(x) {
            //Utiility function to return number with comma
            if (x === null) {
                return "N/A";
            }
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },

        getArrAverage: function(arr) {
            //Helper function to get Array average:
            var i,
                sum = 0, // try to use informative names, not "num"
                len = arr.length; // cache arr.length because accessing it is usually expensive
            for (i = 0; i < len; i+=1) { // arrays start at 0 and go to array.length - 1
                if (arr[i] === null) {
                    len = len -1;
                } else {
                    sum += arr[i];
                }
            }
            return sum/len;
        },

        getArrMedian: function(values) {
            var arr = [];
            for (i = 0; i < values.length; i+=1) { // arrays start at 0 and go to array.length - 1
                 if (values[i] !== null) {
                     arr.push(values[i]);
                 }
            }
            arr.sort(function(a,b) {
                 return a - b;
            });
            var half = Math.floor(arr.length/2);
            if (arr.length % 2) {
                return arr[half];
            } else {
                return (arr[half-1] + arr[half]) / 2.0;
            }
        },

        handleLensView: function(that) {
            that.handleActivationPieChart();
            that.handleCTRGaugeChart();
            //Click to switch tab
            $(".tab > li").click(function(e) {
                var target = $(e.target),
                    tabname = target.data("tab"),
                    type = target.data("type");
                that.handleTabClick(tabname, type, that);
            });

            //Click to view more
            $(".lens .view-more").click(function(e) {
                $(".lens .overlay-chart").show("slow");
                var target = $(e.target)
                    type = "";
                target = target.hasClass("view-more") ? target : $(target.parents(".view-more")[0]);
                type = target.data("type");
                $(".lens .overlay-chart").show("slow", function() {
                    //Need to re-drawing when div becomes completely visible, otherwise, highchart will try to mess with height/width of the chart-region
                    that.drawTrends(type, that.lensTrendData);
                });
            });

            //Hide overlay chart
            $(".lens .overlay-chart .view-less").click(function(e) {
                $(".lens .overlay-chart").hide("slow", function() {
                    $(".expand-chart").html("");
                });
            });

            //Clicking on printing button, currently, this is a hack, we just enable people to 
            $(".lens-footer .print").click(function(e) {
                that.printLens(e);
            });
        },

        printLens: function(e) {
            var target = $(e.target);
            if(!(target.hasClass("disabled"))) {
                window.print();
            }
        },

        handleTabClick: function(tabname, type, that) {
            var currtab = "";
            that.switchTabData(type);
            $.each($(".tab > li"), function(index, tabelm) {
                currtab = $(tabelm).data("tab");
                if(currtab !== tabname) {
                    $(tabelm).removeClass("active") 
                    $("." + currtab).addClass("hidden");
                } else {
                    $(tabelm).addClass("active") 
                    $("." + currtab).removeClass("hidden");
                }
            });

            if (type === "keys") {
                $(".lens-footer .print").removeClass("disabled");
                this.timestamp = this.lensKeyData.lastModified;
            } else {
                $(".lens-footer .print").addClass("disabled");
            }
            $(".lens-footer .timestamp span").html(this.timestamp);
        },

        switchTabData: function(type) {
            var that = this;
            if((type === "trends") && (typeof this.lensTrendData.trendsInfo === "undefined")) {
                require(["backend/coupons.php?define=callback&type=" + type + "&cid=" + this.couponID],
                    function(response) {
                        //JSONP data call
                        //console.log(response);
                        that.drawTrends("all", response.trendStats);
                    }
                );
            }
        },

        drawTrends: function(type, response) {
            this.lensTrendData = response;
            var arrActivationValues = [],
                arrActivationDays = [],
                arrAvgPageDays = [],
		arrAvgPageValues = [],
                arrCtrDays = [],
                arrCtrValues = [],
                arrVelocityDays = [],
                arrVelocityValues = [],
                pageplacementConfig = {
                    title: "Average Page Placement",
                    color: "#69BC45",
                    divider: 10,
                    multiplier: 10,
                    actualDivider: 1,
                    titleFont: 8,
                    yAxis: "page"
                },
                velocityConfig = {
                    title: "Velocity",
                    color: "#EE5323",
                    divider: 1000,
                    actualDivider: 1000,
                    multiplier: 1,
                    titleFont: 8,
                    yAxis: "000's"
                },
                ctrConfig = {
                    title: "Click-through Rate",
                    color: "#F8AA19",
                    divider: 100,
                    multiplier: 100,
                    actualDivider: 1,
                    titleFont: 10,
                    yAxis: "%"
                };
            $.each(this.lensTrendData.activations, function(index, value) {
                arrActivationValues.push(value.val);
                arrActivationDays.push({
                   'day': index,
                   'showLabel': (value.showLabel) ? value.showLabel : 0
                });
            });
            $.each(this.lensTrendData.aggravgpage, function(index, value) {
                arrAvgPageDays.push({
                   'day': index,
                   'showLabel': (value.showLabel) ? value.showLabel : 0
                });
                arrAvgPageValues.push(value.val);
            });
            $.each(this.lensTrendData.ctr, function(index, value) {
                arrCtrDays.push({
                   'day': index,
                   'showLabel': (value.showLabel) ? value.showLabel : 0
                });
                arrCtrValues.push(value.val);
            });
            $.each(this.lensTrendData.velocity, function(index, value) {
                arrVelocityDays.push({
                   'day': index,
                   'showLabel': (value.showLabel) ? value.showLabel : 0
                });
                arrVelocityValues.push(value.val);
            });
            //Drawing all 4 charts in trends analyses
            if (type === "all") {
                this.handleActivationBarChart(arrActivationDays, arrActivationValues, $(".trend-activation"), true);
                this.handleLineChart(arrVelocityDays, arrVelocityValues, $(".trend-velocity"), true, velocityConfig, true);
                this.handleLineChart(arrAvgPageDays, arrAvgPageValues, $(".trend-pageplacement"), true, pageplacementConfig, false);
                this.handleLineChart(arrCtrDays, arrCtrValues, $(".trend-ctr"), true, ctrConfig, false);
                //Modified time changed
                this.timestamp = response.lastModified;
                $(".lens-footer .timestamp span").html(this.timestamp);
            }
            //Draw specific chart type
            if (type === "activation") {
                this.handleActivationBarChart(arrActivationDays, arrActivationValues, $(".expand-chart"), false);
            }
            if (type === "velocity") { //TODO: need correct data for velocity
                this.handleLineChart(arrVelocityDays, arrVelocityValues, $(".expand-chart"), false, velocityConfig, true);
            }
            if (type === "pageplacement") {
                this.handleLineChart(arrAvgPageDays, arrAvgPageValues, $(".expand-chart"), false, pageplacementConfig, false);
            }
            if (type === "ctr") {
                this.handleLineChart(arrCtrDays, arrCtrValues, $(".expand-chart"), false, ctrConfig, false);
            }
        },

        /**This function will handle any kinde of line chart being drawn **/
        handleLineChart: function(days, values, chartDiv, teaser, dataConfig, trendEnabled) {
            var trendData = [],
                trendSeries = {},
                showKey = true,
                that = this;
            if (trendEnabled && !(teaser) && values.length > 1) { //should not draw trendline with 1 data point
                //TrendsData calculation
                $.each(fitData(values).data, function(index, value) {
                    trendData.push(value);
                });
                trendSeries = {
                    type: 'line',
                    marker: {
                        enabled: false
                    },
                    data: trendData,
                    color: "#696969",
                    dashStyle: 'LongDash',
                    enableMouseTracking: false
                }
            }

            //Decide to show key or not
            if (dataConfig.yAxis === "000's" && that.getArrMedian(values) < 1000 && that.getArrAverage(values) < 1000) {
                showKey = false;
            }

            chartDiv.highcharts({
                chart: {
                    backgroundColor: 'transparent'
                },
                title: {
                    text: dataConfig.title,
                    style: {
                        fontWeight: 'bold',
                        fontSize: (teaser) ? 16 : 22,
                        fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif',
                        color: dataConfig.color
                    }
                },
                xAxis: {
                    categories: days,
                    labels: {
                        enabled: (teaser) ? false : true,
                        rotation: -45,
                        style: {
                            fontWeight: 'bold',
                            fontSize: 8
                        },
                        formatter: function() {
                            return ((this.value.showLabel === 1) ? this.value.day : "");
                        }
                    },
                    tickColor: 'transparent',
                    tickWidth: 0.1
                },
                yAxis: {
                    min: 0,
                    endOnTick: false,
                    labels: {
                        enabled: (teaser) ? false : true,
                        formatter: function() {
                            if (showKey) {
                                return (((this.value * dataConfig.multiplier) % dataConfig.divider === 0) ? (this.value/dataConfig.actualDivider) : "");
                            } else {
                                return this.value;
                            }
                        },
                        style: {
                            fontWeight: 'bold',
                            fontSize: 8
                        }
                    },
                    title: {
                        text: (!teaser && showKey) ? dataConfig.yAxis : "",
                        rotation: 0,
                        align: "high",
                        offset: 5,
                        y: -10, /**Place title on top yAixs **/
                        style: {
                            fontWeight: "bold",
                            fontSize: (dataConfig.titleFont)
                        }
                    },
                    lineWidth: 1,
                    gridLineWidth: 0
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    enabled: (teaser) ? false : true,
                    headerFormat: '<span>{point.key.day}</span><br/>',
                    pointFormat: '<span>{point.y}</span>'
                },
                series: [{
                    data: values,
                    color: dataConfig.color,
                    marker: {
                        enabled: (teaser) ? false : true,
                        states: {
                            hover: {
                                fillColor: '#999',
                                lineColor: '#999'
                            },
                            select: {
                                fillColor: '#999',
                                lineColor: '#999'
                            }
                        }
                    }
                }, trendSeries]
            });
        },

        handleActivationBarChart: function(days, values, chartDiv, teaser) {
            //console.log(trendsData);
            var showKey = true,
                that = this;
            //Decide to show key or not
            if (that.getArrMedian(values) < 1000 && that.getArrAverage(values) < 1000) {
                showKey = false;
            }

            chartDiv.highcharts({
                chart: {
                    backgroundColor: 'transparent'
                },
                title: {
                    text: 'Activations',
                    style: {
                        fontWeight: 'bold',
                        fontSize: (teaser) ? 16 : 22,
                        fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif',
                        color: '#08b4df'
                    }
                },
                xAxis: {
                    categories: days,
                    labels: {
                        enabled: (teaser) ? false : true,
                        rotation: -45,
                        style: {
                            fontWeight: 'bold',
                            fontSize: 8
                        },
                        formatter: function() {
                            return ((this.value.showLabel === 1) ? this.value.day : "");
                        }
                    },
                    tickColor: 'transparent',
                    tickWidth: 0.1
                },
                yAxis: {
                    min: 0,
                    endOnTick: false,
                    title: {
                        text: (!teaser && showKey) ? "000's" : "",
                        rotation: 0,
                        align: "high",
                        offset: 5,
                        y: -10, /**Place title on top yAixs **/
                        style: {
                            fontWeight: "bold",
                            fontSize: 8
                        }
                    },
                    labels: {
                        enabled: (teaser) ? false : true,
                        formatter: function() {
                            if (showKey) {
                                return ((this.value % 1000 === 0) ? (this.value/1000) : "");
                            } else {
                                return this.value;
                            }
                        },
                        style: {
                            fontWeight: 'bold',
                            fontSize: 8
                        }
                    },
                    lineWidth: 1,
                    gridLineWidth: 0
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    enabled: (teaser) ? false : true,
                    headerFormat: '<span>{point.key.day}</span><br/>',
                    pointFormat: '<span>{point.y}</span>'
                },
                series: [{
                    data: values,
                    type: 'column',
                    color: "#08b4df"
                }]
            });
        },

        handleActivationPieChart: function() {
            $(".activation-chart").highcharts({
                colors: ["#55BF3B", "#696969"],
                title: {
                    text: "",
                },
                tooltip: {
                    pointFormat: '{series.name}<br/><b>{point.percentage:.1f}%</b>'
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: " ",
                    data: [
                        ['% Fulfilled', (Math.round((100 - this.lensKeyData.offerInfo.actLimitPct) * 100))/100],
                        ['% Remaining', this.lensKeyData.offerInfo.actLimitPct]
                    ]
                }]
            });
        },

        handleCTRGaugeChart: function() {
            var ctrValue = this.lensKeyData.perfInfo.ctr;
            $(".ctrview-chart").highcharts({
                chart: {
                    type: "gauge",
                    plotBackgroundColor: "transparent",
                },
                plotOptions: {
                    gauge: {
                        dataLabels: {
                            enabled: false
                        }
                    }
                },
                title: {
                    text: ""
                },
                pane: {
                    startAngle: -150,
                    endAngle: 150,
                },
                credits: {
                    enabled: false
                },
                yAxis: {
                    min: 0.1,
                    max: 20,
                    type: 'logarithmic',
                    minorTickInterval: '0.1',
                    minorTickWidth: 1,
                    minorTickLength: 1,
                    minorTickPosition: 'inside',
                    minorTickColor: '#666',
                    tickPixelInterval: 15,
                    tickWidth: 1,
                    tickPosition: 'inside',
                    tickLength: 10,
                    tickColor: '#666',
                    labels: {
                        step: 1,
                        rotation: 'auto'
                    },
                    title: {
	                text: ' CTR %',
                        style: {
                            color: "#444",
                        },
                        y: 60
	            },
                    plotBands: [{
                        from: 0,
	                to: 1,
	                color: '#DF5353' //RED
	            }, {
	                from: 1,
	                to: 5,
	                color: '#DDDF0D' //yellow
	            }, {
	                from: 5,
	                to: 20,
	                color: '#55BF3B' //GREEN
	            }]
                },
                series: [{
                    name: 'CTR',
                    data: (parseFloat(ctrValue) === 0) ? [0.09] : [ctrValue],
                    tooltip: {
                        valueSuffix: '%',
                        pointFormat: (parseFloat(ctrValue) === 0) ? '<b>CTR: {point.y:.0f}</b>' : '<b>CTR: {point.y:.1f}</b>'
                    }
                }],
            }, function(chart) {
                //Init chart
            });
        }
    });

    return Lens;

});
