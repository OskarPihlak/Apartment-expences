module.exports = (app) =>{
    const db = require('./db.js');
    const express = require('express');
    const bodyParser = require('body-parser');
    const helpers = require('./helpers.js');
    const moment = require('moment');
    let month_selection = helpers.generate_month_selections();
    let dates = helpers.date_now();

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
    // Handles messages events
    function handleMessage(sender_psid, received_message) {

    }

// Handles messaging_postbacks events
    function handlePostback(sender_psid, received_postback) {

    }

// Sends response messages via the Send API
    function callSendAPI(sender_psid, response) {

    }

    app.post('/bot/webhook', (req, res) => {

        // Parse the request body from the POST
        let body = req.body;

        // Check the webhook event is from a Page subscription
        if (body.object === 'page') {

            // Iterate over each entry - there may be multiple if batched
            body.entry.forEach(function(entry) {

                // Gets the body of the webhook event
                let webhook_event = entry.messaging[0];
                console.log(webhook_event);

                // Get the sender PSID
                let sender_psid = webhook_event.sender.id;
                console.log('Sender PSID: ' + sender_psid);

            });

            // Return a '200 OK' response to all events
            res.status(200).send('EVENT_RECEIVED');

        } else {
            // Return a '404 Not Found' if event is not from a page subscription
            res.sendStatus(404);
        }

    });

};