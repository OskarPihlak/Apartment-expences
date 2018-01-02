const Handlebars = require('handlebars');
const moment = require('moment');

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

//Month is 1 based
module.exports.daysInMonth = function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
};

module.exports.round = function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
};
module.exports.monthDiff = function monthDiff(date1, date2) {
    let months;
    months = (date2.getFullYear() - date1.getFullYear()) * 12;
    months -= date1.getMonth();
    months += date2.getMonth() +1;
    return months <= 0 ? 0 : months;
};

module.exports.build_main_object = (result)=> {
    let people ={oskar:{name:'Oskar', spent:0},
        sandra:{name:'Sandra', spent:0},
        uibo:{name:'Uibo', spent:0},
        luiza:{name:'Luiza', spent:0}};
    let dateObjectArray=[];

    for (let i = 0; i < result.length; i++) {
        dateObjectArray.push({
            name: result[i].name,
            amount: (result[i].amountSpent), //////////////////////////////////////////////////////////////////////////////////////////////
            day: result[i].day,
            month:result[i].month,
            year: result[i].year,
            description: result[i].description
        });
        //get everyones spending sum
        switch (result[i].name){
            case people.oskar.name:
                people.oskar.spent += result[i].amountSpent; break;
            case people.sandra.name:
                people.sandra.spent += result[i].amountSpent; break;
            case people.uibo.name:
                people.uibo.spent += result[i].amountSpent; break;
            case people.luiza.name:
                people.luiza.spent += result[i].amountSpent; break;
        }
    }
    let total_spending = people.oskar.spent + people.sandra.spent + people.uibo.spent + people.luiza.spent;
    people.oskar.precentage = ((people.oskar.spent / total_spending) * 100).toFixed(2);
    people.sandra.precentage = ((people.sandra.spent / total_spending) * 100).toFixed(2);
    people.uibo.precentage = ((people.uibo.spent / total_spending) * 100).toFixed(2);
    people.luiza.precentage = ((people.luiza.spent / total_spending) * 100).toFixed(2);
    return {array: dateObjectArray, people: people};
};

module.exports.generate_month_selections = ()=>{
    let month_difference_array = [];
    let date = new Date();
    let dateNow = new Date(date.getFullYear(),date.getMonth(),date.getDate());
    let dateStarted = new Date(2017,11); //december 2017
    let difference = exports.monthDiff(dateStarted,dateNow);
    for(let i = 0; i < difference ; i++ ){
        let splitted_date = moment(dateStarted).add(i,'months').format('YYYY-MMMM-MM').split('-');
        month_difference_array.push({year: splitted_date[0],
            month_name: splitted_date[1],
            month_number: splitted_date[2],
        });
    }
    return {month_difference_array: month_difference_array};
};
module.exports.date_now = ()=>{
    let date = new Date();
    return {year :date.getFullYear(), month: exports.pad((date.getMonth()+1),2), day: exports.pad(date.getDate(),2)};
};
module.exports.pad = function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};
module.exports.sendText = (sender, text)=>{
    let token = 'EAAH0ZBiD0bXEBADiJ9hb8TJ6iW9USCTCmO0vXBL8YzBBCfOoNIduyfqe8b7eBUxfPjYmtXqXCefi2L4Inb7E9rSsr5JfHN8dFm3EIKhiELBcnG0Aslz88rJGHb8BZAZAPBYKbbDAdAOs66p1LMAFj7G1y9AQPbJwQZBlDZBV5GgZDZD';
  let messageData = {text: text}
  request({
      url:'https://graph.facebook.com/v2.6/me/messages',
      qs:{access_token : token},
      method: "POST",
      json:{
          recipient:{id: sender},
          message: messageData
      },
  }, (error, response, body)=>{
      if(error){
          console.log('sending error');
      }else if(response.body.error){
          console.log('response body error');
      }
    })

};