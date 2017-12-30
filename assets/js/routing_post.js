const db = require('./db.js');
const helpers = require('./helpers.js');
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({extended: false});


module.exports = app => {
    app.post('/post/payment', urlEncodedParser, function (req, res) {
        console.log(helpers.capitalizeFirstLetter(req.body.name));
        let financeRecord = new db.finance({
            name: helpers.capitalizeFirstLetter(req.body.name),
            amountSpent: req.body.amount,
            date: req.body.date,
            description: (req.body.description).toLowerCase()
        });
        financeRecord.save().then(function (err, post) {
            if (err) {
                return (err)
            }
        }).catch(err => {
            throw err
        });
        res.redirect('/');
    });
};