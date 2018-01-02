module.exports = (app) =>{
    const db = require('./db.js');
    const helpers = require('./helpers.js');
    const moment = require('moment');
    let month_selection = helpers.generate_month_selections();
    let dates = helpers.date_now();
    let s = {};
    let v = {'month':'1', 'year':'2'};
    db.finance.find(s).then(result => {
       console.log(result);
    });


    app.get('/', function (req, res) {
        res.redirect('/' + dates.year +'-'+ dates.month);
    });

    app.get('/:id', (req, res)=> {
        let query_data = (req.params.id).split('-');
        console.log(' year:'+query_data[0],'month: '+ query_data[1]);

        let query_string={};
        if (req.params.id !== 'All time') {
            query_string = {'month': query_data[1], 'year': query_data[0]};
            db.finance.find(query_string).then(result => {
                let build_main = helpers.build_main_object(result);
                console.log(result);
                res.render('main', {
                    data: build_main.array,
                    people: build_main.people,
                    past_months: month_selection.month_difference_array,
                    selected: req.params.id,
                    date: dates
                });
            }).catch(err => {
                throw err
            });
        } else {
            db.finance.find(query_string).then(result => {
                let build_main = helpers.build_main_object(result);

                res.render('main', {
                    data: build_main.array,
                    people: build_main.people,
                    past_months: month_selection.month_difference_array,
                    selected: req.params.id,
                    date: dates
                });
            }).catch(err => {
                throw err
            });
        }
    });

    app.get('/history', (req, res)=> {
        db.finance.find({}).then(result => {
            let build_main = helpers.build_main_object(result);

            res.render('history', {
                data: build_main.array
            });
        }).catch(err => {throw err });
    });
    app.get('/webhook', (req, res)=>{
        if(req.query['hub.verify_token'] === 'izApartmentStuff'){
            res.send(req.query['hub.challenge']);
        }
        res.send('Wrong token');
    });


};