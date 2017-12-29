let oskarSpent = parseInt($('.oskar').val());
let sandraSpent = parseInt($('.sandra').val());
let uiboSpent = parseInt($('.uibo').val());
let luizaSpent = parseInt($('.luiza').val());
let totalCashSpent = oskarSpent + sandraSpent + uiboSpent + luizaSpent;
let cashPerPerson = totalCashSpent/4;

let oskarPrecentage = parseInt(((oskarSpent/totalCashSpent)*100).toFixed(2));
let sandraPrecentage = parseInt(((sandraSpent/totalCashSpent)*100).toFixed(2));
let uiboPrecentage = parseInt(((uiboSpent/totalCashSpent)*100).toFixed(2));
let luizaPrecentage = parseInt(((luizaSpent/totalCashSpent)*100).toFixed(2));
let date = new Date();

let oskarGraphDataArray ;
let sandraGraphDataArray;
let uiboGraphDataArray;
let luizaGraphDataArray;










$(function () {
    $('#containerpie').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Cash committed per day'
        },
        subtitle: {
            text: 'Per person'
        },
        xAxis: {
            type: 'datetime',
            labels: {
                overflow: 'justify'
            }
        },
        yAxis: {
            title: {
                text: 'Money Spent',
                stripLines: [{
                    value: 3366500,
                    label: "Average"
                }]
            },
            min: 0,
            minorGridLineWidth: 0,
            gridLineWidth: 0,
            alternateGridColor: null,
            plotBands: []
        },
        tooltip: {
            valueSuffix: '€ spent/day'
        },
        plotOptions: {
            spline: {
                lineWidth: 3,
                states: {
                    hover: {
                        lineWidth: 3
                    }
                },
                marker: {
                    enabled: false
                },
                pointInterval: 86400000,
                pointStart: date.getMonth()
            }
        },
        series: [{
            name: 'Oskar',
            data: [41.3, 5.1, 4.3, 5.2]

        }, {
            name: 'Sandra',
            data: [0.0, 50.0, 40.0, 0.0]
        }, {
            name: 'Uibo',
            data: [10.0, 35.0, 10.0, 28.0]
        }, {
            name: 'Luiza',
            data: [10.0, 30.0, 10.0, 20.0]
        }]
        ,
        navigation: {
            menuItemStyle: {
                fontSize: '15px'
            }
        }
    });
});




















Highcharts.chart('container', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Cash commited'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
            }
        }
    },
    series: [{
        name: 'Cash',
        colorByPoint: true,
        data: [{
            name: 'Oskar',
            y: oskarPrecentage
        }, {
            name: 'Sandra',
            y: sandraPrecentage,
        }, {
            name: 'Uibo',
            y: uiboPrecentage
        }, {
            name: 'Luiza',
            y: luizaPrecentage
        }]
    }]
});




// '.tbl-content' consumed little space for vertical scrollbar, scrollbar width depend on browser/os/platfrom. Here calculate the scollbar width .
$(window).on("load resize ", function() {
    let scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
    $('.tbl-header').css({'padding-right':scrollWidth});
}).resize();


$('#highcharts-2xgcbg1-2 > svg > rect.highcharts-background').css('fill','#f4f4f4');
$('.highcharts-background').css('fill','#f4f4f4');