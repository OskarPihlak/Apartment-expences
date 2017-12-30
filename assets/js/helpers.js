const Handlebars = require('handlebars');

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