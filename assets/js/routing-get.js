module.exports = (app) => {
    const db = require('./db.js');
    const express = require('express');
    const bodyParser = require('body-parser');
    const helpers = require('./helpers.js');
    const moment = require('moment');
    const colors = require('colors/safe');
    let messenger_bot_helpers = ('./assets/js/messenger-bot helpers');
    let month_selection = helpers.generate_month_selections();
    let request = require('request');
    let date = new Date();
    let query_string = {};
    let data;
     db.finance.find(query_string).then(result => { data = helpers.build_main_object(result);  }).catch(err => {throw err} );
    setInterval(()=>{
        db.finance.find(query_string).then(result => { data = helpers.build_main_object(result) }).catch(err => {throw err} );
    },270000);

    app.get('/', (req, res) => {
        data.description = ['Food','Alcohol','Food & Alcohol','Housekeeping stuff','Other stuff'];
        res.render('main', {
            data:data,
            past_months: month_selection,
        });
    });

    app.get('/:id', (req, res) => {
        let query_data = (req.params.id).split('-');
        console.log(' year:' + query_data[0], 'month: ' + query_data[1]);

        let query_string = {};
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
                });
            }).catch(err => {
                throw err
            });
        }
    });

    app.get('/history', (req, res) => {
        db.finance.find({}).then(result => {
            let build_main = helpers.build_main_object(result);
            res.render('history', { data: build_main.array });
        }).catch(err => { throw err });
    });

    app.post('/bot/webhook', (req, res) => {
        // Parse the request body from the POST
        let body = req.body;

        // Check the webhook event is from a Page subscription
        if (body.object === 'page') {

            // Iterate over each entry - there may be multiple if batched
            body.entry.forEach(function (entry) {
            console.log(JSON.stringify(entry));
                // Gets the body of the webhook event
                let webhook_event = entry.messaging[0];
                console.log(webhook_event);


                // Get the sender PSID
                let sender_psid = webhook_event.sender.id;

                console.log('Sender PSID: ' + JSON.stringify(sender_psid));

                // Check if the event is a message or postback and
                // pass the event to the appropriate handler function
                if (webhook_event.message) {
                    console.log(JSON.stringify(webhook_event));
                    module.exports.webhook_message = webhook_event.message;
                    handleMessage(sender_psid, webhook_event.message);
                }else if (webhook_event.postback) {
                        handlePostback(sender_psid, webhook_event.postback);
                }

            });
            // Return a '200 OK' response to all events
            res.status(200).send('EVENT_RECEIVED');

        } else {
            // Return a '404 Not Found' if event is not from a page subscription
            res.sendStatus(404);
        }

    });
};