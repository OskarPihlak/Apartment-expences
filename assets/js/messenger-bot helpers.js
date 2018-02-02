// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;
    if (sender_psid == 1657207370991802){ sender_id_name = 'Oskar'}
    else if (sender_psid == 1960253640668852){ sender_id_name = 'Sandra'}
    else if (sender_psid == 1576082319178504){ sender_id_name = 'Uibo'}
    else sender_id_name = sender_psid;
    console.log('handlemessages///////////////////////'+sender_id_name);
    // Checks if the message contains text
    console.log('handle message ' + received_message.text);
    if (((received_message.text).toUpperCase()).startsWith('X')) {
        let message = (received_message.text).slice(1).split(' and ');

        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": `Is this info correct ? ${sender_id_name} bought  ${(message[1])} on the ${date.getDate()}. ${moment(date.getMonth() + 1).format('MMMM')} - ${date.getFullYear()} for ${message[0]} €`,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Yes!",
                            "payload":"good,"+message[0]+','+message[1]
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
            "text": `Hello ${sender_id_name}! You sent the message: "${received_message.text}". Now send me an attachment!`
        }
    }
    // Send the response message
    console.log(response);
    callSendAPI(sender_psid, response)

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    let payload = received_postback.payload.split(',');
    let date = new Date();
    let response;
    let financeRecord = new db.finance({
        name: helpers.capitalizeFirstLetter(sender_id_name),
        amountSpent: payload[1],
        day: date.getDate(),
        month: (date.getMonth() + 1),
        year: date.getFullYear(),
        description: payload[2].toLowerCase()
    });

    if (sender_psid == 1657207370991802){ sender_id_name = 'Oskar'}
    else if (sender_psid == 1960253640668852){ sender_id_name = 'Sandra'}
    else if (sender_psid == 1576082319178504){ sender_id_name = 'Uibo'}
    else sender_id_name = sender_psid;

    console.log('PSID SENDER'+ sender_id_name);
    console.log('postback ///////////////////////////////////// '+received_postback);

    // Set the response based on the postback payload
    if (payload[0] === 'yes') {
        response = {"text": "Thanks, pushing to server!"}

    } else if (payload[0] === 'no') {
        response = {"text": "Oops, try sending it again."}

    } else if (payload[0] === 'good') {
        response = {"text": `Very good, pushing to server:  ${sender_id_name} / ${date.getDate()}. ${moment(date.getMonth() + 1).format('MMMM')} - ${date.getFullYear()} / ${payload[1]} €  / ${payload[2]}`};
        financeRecord.save().then(function (err, post) {
            if (err) { return (err) }
        }).catch(err => { throw err });

    } else if (payload[0] === 'bad') {
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
            console.log(res, err);
            console.log('message sent!');
            console.log('callSendAPI response' + JSON.stringify(response));
        } else {
            console.error("Unable to send message:" + err);
        }
    });

}
