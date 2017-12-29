const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const Handlebars = require('handlebars');
const urlEncodedParser = bodyParser.urlencoded({extended: false});
let date = new Date();
let currentAmountOfDaysInMonth = daysInMonth(date.getMonth() + 1, date.getYear());
let masterObjectArray = [];


Handlebars.registerHelper("math", function (lvalue, operator, rvalue, options) {
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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//Month is 1 based
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://finance_admin:data@ds133127.mlab.com:33127/apartment-finance', {
    useMongoClient: true
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Load Idea Model
const Schema = mongoose.Schema;

// Create Schema
const financeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    amountSpent: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    description:{
         type: String,
        required: true}
});

const finance = mongoose.model('finance', financeSchema);

//app init
let app = express();

app.use(express.static(path.join(__dirname, 'assets')));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//templating engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layouts'}));
app.set('view engine', 'handlebars');

//set routing
app.get('/', function (req, res) {
///////////////////////////////////////////////////////////////////////////////////

let sandra = 0;
let oskar = 0;
let uibo = 0;
let luiza = 0;
finance.find({}).then(result => {
    let dateObjectArray = [];
    for (let i = 0; i < result.length; i++) {
        let dateData = result[i].date.toLocaleDateString('en-GB').split('/');

        dateObjectArray.push({
            name: result[i].name,
            amount: result[i].amountSpent,
            day: dateData[1],
            month: dateData[0],
            year: dateData[2]
        });


        if (result[i].name === 'Oskar') {
            oskar += result[i].amountSpent;
        }
        else if (result[i].name === 'Sandra') {
            sandra += result[i].amountSpent
        }
        else if (result[i].name === 'Uibo') {
            uibo += result[i].amountSpent
        }
        else if (result[i].name === 'Luiza') {
            luiza += result[i].amountSpent
        }
    }

    for (let i = 1; i <= currentAmountOfDaysInMonth; i++) {
        masterObjectArray.push({
            id: i,
            amount: 0,
            day: i,
            month: dateObjectArray[0].month,
            year: dateObjectArray[0].year
        });
    }

    for (let y = 0; y < dateObjectArray.length; y++) {

        //if database holds values with name Oskar
        if (dateObjectArray[y].name === 'Oskar') {

            //loops through the days of the current month
            for (let i = 1; i <= currentAmountOfDaysInMonth; i++) {

                //if day is equal to object day
                if (i === parseInt(dateObjectArray[y].day)) {
                    masterObjectArray[i].amount += dateObjectArray[y].amount;
                    masterObjectArray[i].name = 'Oskar';
                    console.log(i, masterObjectArray[i].amount, 'oskar')
                }
            }
        }
        if (dateObjectArray[y].name === 'Sandra') {
            for (let i = 1; i <= currentAmountOfDaysInMonth; i++) {
                if (i === parseInt(dateObjectArray[y].day)) {
                    masterObjectArray[i].amount += dateObjectArray[y].amount;
                    masterObjectArray[i].name = 'Sandra';
                    console.log(i, masterObjectArray[i].amount, 'sandra')
                }
            }
        }
        /* if (dateObjectArray[y].name === 'Uibo') {
             masterObjectArray[i].amount += dateObjectArray[y].amount;
             masterObjectArray[i].name = 'Uibo';
             console.log(i,masterObjectArray[i],'uibo')
         }
         if (dateObjectArray[y].name === 'Luiza') {
             masterObjectArray[i].amount += dateObjectArray[y].amount;
             masterObjectArray[i].name = 'Luiza';
             console.log(i,masterObjectArray[i], 'luiza')
         }*/
    }


    let totalSpending = oskar + sandra + uibo + luiza;
   let individualSpendings = {
        oskar: {spent: oskar, precentage: Math.round((oskar / totalSpending) * 100, 2)},
        sandra: {spent: sandra, precentage: Math.round((sandra / totalSpending) * 100, 2)},
        uibo: {spent: uibo, precentage: Math.round((uibo / totalSpending) * 100, 2)},
        luiza: {spent: luiza, precentage: Math.round((luiza / totalSpending) * 100, 2)},
    };
    res.render('main', {
        data: dateObjectArray,
        peoplespent: individualSpendings
    });
});
});
app.get('/history', (req, res)=> {
    finance.find({}).then(result => {
        let dateObjectArray = [];
        for (let i = 0; i < result.length; i++) {
            let dateData = result[i].date.toLocaleDateString('en-GB').split('/');

            dateObjectArray.push({
                name: result[i].name,
                amount: result[i].amountSpent,
                date: dateData[1] +'/'+ dateData[0] +'/'+ dateData[2],
                day: dateData[1],
                month: dateData[0],
                year: dateData[2],
                description: result[i].description
            });
        }
        console.log(dateObjectArray);
        res.render('history', {
            data: dateObjectArray
        });
    }).catch(err => {
        throw err
    });
});

app.post('/post/payment', urlEncodedParser, function (req, res) {
    console.log(capitalizeFirstLetter(req.body.name));
    let financeRecord = new finance({
        name: capitalizeFirstLetter(req.body.name),
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

//set port
app.set('port', (process.env.PORT) || 3333);
app.listen(app.get('port'), function () {
    console.log('Server started on port ' + app.get('port'))
});
