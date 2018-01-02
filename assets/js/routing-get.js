module.exports = (app) => {
    const db = require('./db.js');
    const express = require('express');
    const bodyParser = require('body-parser');
    const helpers = require('./helpers.js');
    const moment = require('moment');
    let month_selection = helpers.generate_month_selections();
    let dates = helpers.date_now();
    let request = require('request');

    app.get('/', function (req, res) {
        res.redirect('/' + dates.year + '-' + dates.month);
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

    app.get('/history', (req, res) => {
        db.finance.find({}).then(result => {
            let build_main = helpers.build_main_object(result);

            res.render('history', {
                data: build_main.array
            });
        }).catch(err => {
            throw err
        });
    });

    // Handles messages events
    function handleMessage(sender_psid, received_message) {
        let response;

        // Checks if the message contains text
        console.log('handle message '+received_message.text);
        if ((received_message.text).startsWith('#')) {
            let message = (received_message.text).slice(1).split('-');


            response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Is this info correct ? {name: ${message[0]}, date: ${dates.day_number}-${dates.month_number}-${dates.year}, amount: ${message[1]}}`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "good",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "bad",
                            }
                        ],
                    }
                }
            };
        } else if (received_message.text) {
            // Create the payload for a basic text message, which
            // will be added to the body of our request to the Send API
            response = {
                "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
            }
        } else if (received_message.attachments) {
            // Get the URL of the message attachment
            let attachment_url = received_message.attachments[0].payload.url;
            response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Is this the right picture?",
                            "subtitle": "Tap a button to answer.",
                            "image_url": attachment_url,
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Yes!",
                                    "payload": "yes",
                                },
                                {
                                    "type": "postback",
                                    "title": "No!",
                                    "payload": "no",
                                }
                            ],
                        }]
                    }
                }
            }
        }

        // Send the response message
        callSendAPI(sender_psid, response);
    }

// Handles messaging_postbacks events
    function handlePostback(sender_psid, received_postback) {
        console.log(sender_psid);
        console.log(received_postback);

        let response;

        // Get the payload for the postback
        let payload = received_postback.payload;
        let dates = helpers.generate_month_selections();
        // Set the response based on the postback payload
        if (payload === 'yes') {
            response = {"text": "Thanks, pushing to server!"}
        } else if (payload === 'no') {
            response = {"text": "Oops, try sending it again."}
        } else if (payload === 'good') {
            response = {"text": `Very good, pushing to server { date ${dates.day_number}-${dates.month_number}-${dates.year}}`};
        } else if (payload === 'bad') {
            response = {"text": "Oops, try sending it again."}
        }
        // Send the message to acknowledge the postback
        callSendAPI(sender_psid, response);
    }

// Sends response messages via the Send API
    function callSendAPI(sender_psid, response) {
        // Construct the message body
        let request_body = {
            "recipient": {
                "id": sender_psid
            },
            "message": response
        };

        // Send the HTTP request to the Messenger Platform
        request({
            "uri": "https://graph.facebook.com/v2.6/me/messages",
            "qs": {"access_token": 'EAAH0ZBiD0bXEBAJZBU6UHWyZBKk8shvJCkLjXZCTv5797tZAcxg0WrR1biZBLQZCC4W69ZAh8H3hUbu8CgeQY9PbA2ySHMGJCvhfXfsD2qhGLfenWBk2y2f5vO7GDQfO6iWeC1djqomczvbFJXi0mwCVPpDPYZAMgQVDN1YkkerVnpAZDZD'},
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            if (!err) {
                console.log('message sent!')
            } else {
                console.error("Unable to send message:" + err);
            }
        });
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

                // Check if the event is a message or postback and
                // pass the event to the appropriate handler function
                if (webhook_event.message) {
                    handleMessage(sender_psid, webhook_event.message);
                } else if (webhook_event.postback) {
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