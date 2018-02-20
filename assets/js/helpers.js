const Handlebars = require('handlebars');
const moment = require('moment');
const express = require('express');
const bodyParser = require('body-parser');

module.exports.math = Handlebars.registerHelper("math", function (lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});

module.exports.capitalizeFirstLetter = function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports.round = (value, decimals) => {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
};
module.exports.monthDiff = function monthDiff(date1, date2) {
    let months;
    months = parseInt((moment(date2).format('YYYY') - moment(date1).format('YYYY')) * 12)
        - parseInt(moment(date1).format('M'))
        + parseInt(moment(date2).format('M'));
    return months <= 0 ? 0 : months;
};

module.exports.build_main_object = (result) => {
    let masterArray = [];
    masterArray.oskar = [];
    masterArray.sandra = [];
    masterArray.uibo = [];
    masterArray.keity = [];
    let spending_sum = 0;
    let dateObjectArray = [];
    let people = [{name: 'Oskar', spent: 0},
        {name: 'Sandra', spent: 0},
        {name: 'Uibo', spent: 0},
        {name: 'Keity', spent: 0}];

    result.map(data => {
        dateObjectArray.push({
            name: data.name,
            amount: data.amountSpent,
            day: data.day,
            month: data.month,
            year: data.year,
            description: data.description
        });
    });
    let chartMaster = [];
    let unique_dates = [];
    dateObjectArray.forEach((object) => {
        let date = `${object.day}-${object.month}-${object.year}`;
        if (unique_dates.includes(date) !== true) {
            unique_dates.push(date);
            console.log('');
            let date_data_array = dateObjectArray.filter(k => `${k.day}-${k.month}-${k.year}` === date);
            let temporaryObject = {date: date, oskar:0, sandra:0, uibo:0, keity:0};
            for (let i = 0; i < date_data_array.length; i++) {
                console.log(date_data_array[i], 'miu');
                if(date_data_array[i].name === 'Oskar') temporaryObject.oskar += Math.round(date_data_array[i].amount);
                if(date_data_array[i].name === 'Sandra') temporaryObject.sandra += Math.round(date_data_array[i].amount);
                if(date_data_array[i].name === 'Uibo') temporaryObject.uibo += Math.round(date_data_array[i].amount);
                if(date_data_array[i].name === 'Keity') temporaryObject.keity += Math.round(date_data_array[i].amount);
            }
           // console.log(temporaryObject);
            chartMaster.push(temporaryObject);

        }
    });
   // console.log(chartMaster);

    //get everyones spending sum
    result.forEach(result => {
        for (let i = 0; i < people.length; i++) {
            if (result.name === people[i].name) people[i].spent += result.amountSpent;
        }
    });
    console.log(people);
    people.forEach(people => spending_sum += people.spent);
    console.log(spending_sum);
    people.forEach(people => (people.precentage = (people.spent / spending_sum) * 100).toFixed(2));


    return {array: dateObjectArray, people: people, chart: chartMaster}
};

module.exports.generate_month_selections = () => {
    let month_difference_array = [];
    let difference = exports.monthDiff(moment('11-2017', 'MM-YYYY'), moment(new Date()));
    for (let i = 0; i < difference; i++) {
        let splitted_date = moment('12-2017', 'MM-YYYY').add(i, 'months').format('YYYY-MMMM-MM-DD').split('-');
        month_difference_array.push({
            year: splitted_date[0],
            month_name: splitted_date[1],
            month_number: splitted_date[2],
        });
    }
    return month_difference_array;
};
module.exports.pad = function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};
module.exports.sendText = (sender, text) => {
    let token = 'EAAH0ZBiD0bXEBADiJ9hb8TJ6iW9USCTCmO0vXBL8YzBBCfOoNIduyfqe8b7eBUxfPjYmtXqXCefi2L4Inb7E9rSsr5JfHN8dFm3EIKhiELBcnG0Aslz88rJGHb8BZAZAPBYKbbDAdAOs66p1LMAFj7G1y9AQPbJwQZBlDZBV5GgZDZD';
    let messageData = {text: text};
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: "POST",
        json: {
            recipient: {id: sender},
            message: messageData
        },
    }, (error, response, body) => {
        if (error) {
            console.log('sending error');
        } else if (response.body.error) {
            console.log('response body error');
        }
    })
};