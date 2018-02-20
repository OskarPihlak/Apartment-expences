const db = require('./db.js');
const helpers = require('./helpers.js');
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({extended: false});
const moment = require('moment');

module.exports = app => {
    app.post('/post/payment', urlEncodedParser, function (req, res) {
        console.log(req.body.amount);
        console.log(helpers.capitalizeFirstLetter(req.body.name));
        let divided_date = (req.body.date).split('-');
        let year = divided_date[0];
        let month = divided_date[1];
        let day = divided_date[2];
        let financeRecord = new db.finance({
            name: helpers.capitalizeFirstLetter(req.body.name),
            amountSpent: req.body.amount,
            day: day,
            month: month,
            year: year,
            description: (req.body.description).toLowerCase()
        });
        financeRecord.save().then(function (err, post) {
            if (err) {
                return (err)
            }
        }).catch(err => {
            throw err
        });
        res.redirect('/' + dates.year +'-'+ dates.month);
    });
    app.post('/filter/update', urlEncodedParser, (req,res)=>{
        console.log(moment(req.body.description).format('YYYY-MM'));
        let selection = moment(req.body.description).format('YYYY-MM');
        res.redirect('/'+selection);
    });

    app.post('add-user',urlEncodedParser, (req,res)=>{
        let userRecord = new db.finance({
            name: req.body.name
        });
        userRecord.save().then((err, post) => {
            if (err) return (err)
        }).catch(err => {throw err} );
    });
};