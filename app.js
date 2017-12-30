const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const routing_get = require('./assets/js/routing-get');
const routing_post = require('./assets/js/routing_post');
const helpers = require('./assets/js/helpers.js');

//app init
let app = express();

app.use(express.static(path.join(__dirname, 'assets')));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Templating engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layouts'}));
app.set('view engine', 'handlebars');

//Set routing
routing_get(app);
routing_post(app);

//Set port
app.set('port', (process.env.PORT) || 3333);
app.listen(app.get('port'), function () {
    console.log('Server started on port ' + app.get('port'))
});
