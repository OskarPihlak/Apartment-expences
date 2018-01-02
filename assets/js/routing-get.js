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
    // Adds support for GET requests to our webhook
    app.get('/webhook', (req, res) => {

        // Your verify token. Should be a random string.
        let VERIFY_TOKEN = "ourApartmentStuff";

        // Parse the query params
        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];

        // Checks if a token and mode is in the query string of the request
        if (mode && token) {

            // Checks the mode and token sent is correct
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {

                // Responds with the challenge token from the request
                console.log('WEBHOOK_VERIFIED');
                res.status(200).send(challenge);

            } else {
                // Responds with '403 Forbidden' if verify tokens do not match
                res.sendStatus(403);
            }
        }
    });

    // Creates the endpoint for our webhook
    app.post('/webhook', (req, res) => {

        let body = req.body;

        // Checks this is an event from a page subscription
        if (body.object === 'page') {

            // Iterates over each entry - there may be multiple if batched
            body.entry.forEach(function(entry) {

                // Gets the message. entry.messaging is an array, but
                // will only ever contain one message, so we get index 0
                let webhookEvent = entry.messaging[0];
                console.log(webhookEvent);
            });

            // Returns a '200 OK' response to all requests
            res.status(200).send('EVENT_RECEIVED');
        } else {
            // Returns a '404 Not Found' if event is not from a page subscription
            res.sendStatus(404);
        }

    });


};