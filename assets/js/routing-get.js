module.exports = (app) =>{
    const db = require('./db.js');
    const helpers = require('./helpers.js');
    let date = new Date();
    let currentAmountOfDaysInMonth = helpers.daysInMonth(date.getMonth() + 1, date.getYear());
    let dateObjectArray = [];
    let masterObjectArray = [];
    let sandra = 0;
    let oskar = 0;
    let uibo = 0;
    let luiza = 0;

    app.get('/', function (req, res) {

        //get sum of every persons spendings
        db.finance.find({}).then(result => {
            for (let i = 0; i < result.length; i++) {
                let dateData = result[i].date.toLocaleDateString('en-GB').split('/');
                dateObjectArray.push({
                    name: result[i].name,
                    amount: result[i].amountSpent,
                    day: dateData[1],
                    month: dateData[0],
                    year: dateData[2]
                });

                switch (result[i].name){
                    case 'Oskar':
                        oskar += result[i].amountSpent; break;
                    case 'Sandra':
                        sandra += result[i].amountSpent; break;
                    case 'Uibo':
                        uibo += result[i].amountSpent; break;
                    case 'Luiza':
                        luiza += result[i].amountSpent; break;
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
            }


            let totalSpending = oskar + sandra + uibo + luiza;
            let individualSpendings = {
                oskar: {spent: oskar.toFixed(2), precentage: Math.round((oskar / totalSpending) * 100, 2).toFixed(2)},
                sandra: {spent: sandra.toFixed(2), precentage: Math.round((sandra / totalSpending) * 100, 2).toFixed(2)},
                uibo: {spent: uibo.toFixed(2), precentage: Math.round((uibo / totalSpending) * 100, 2).toFixed(2)},
                luiza: {spent: luiza.toFixed(2), precentage: Math.round((luiza / totalSpending) * 100, 2).toFixed(2)},
            };
            console.log(individualSpendings.uibo);
            res.render('main', {
                data: dateObjectArray,
                peoplespent: individualSpendings
            });
        });
    });
    app.get('/history', (req, res)=> {
        db.finance.find({}).then(result => {
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

};