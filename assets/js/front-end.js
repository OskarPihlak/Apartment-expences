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

$('.highcharts-background').css('fill','#f4f4f4');


let date = new Date();
console.log(date.getFullYear() +'-'+ date.getMonth()+1+'-'+ date.getDate());
$('#date').val(date.getFullYear() +'-'+ date.getMonth()+1+'-'+ date.getDate());
$('.'+ date.getFullYear()+'-'+ date.getMonth()+1).attr('selected','selected');

dateControl = document.querySelector('input[type="date"]');