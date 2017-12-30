module.exports = (app) =>{
    const db = require('./db.js');
    const helpers = require('./helpers.js');
    let date = new Date();

    let currentAmountOfDaysInMonth = helpers.daysInMonth(date.getMonth() + 1, date.getYear());

    let dateObjectArray = [];
    let masterObjectArray = [];

    app.get('/', function (req, res) {
        let people ={oskar:{name:'Oskar', spent:0},
                    sandra:{name:'Sandra', spent:0},
                      uibo:{name:'Uibo', spent:0},
                     luiza:{name:'Luiza', spent:0}};

        //get data from database and build an object
        db.finance.find({}).then(result => {
            for (let i = 0; i < result.length; i++) {
                let dateData = result[i].date.toLocaleDateString('en-GB').split('/');
                dateObjectArray.push({
                    name: result[i].name,
                    amount: (result[i].amountSpent),
                    day: dateData[1],
                    month: dateData[0],
                    year: dateData[2]
                });

                //get everyones spending sum
                switch (result[i].name){
                    case people.oskar.name:
                        people.oskar.spent += result[i].amountSpent; break;
                    case people.sandra.name:
                        people.sandra.spent += result[i].amountSpent; break;
                    case people.uibo.name:
                        people.uibo.spent += result[i].amountSpent; break;
                    case people.luiza.name:
                        people.luiza.spent += result[i].amountSpent; break;
                }
            }

            let total_spending = people.oskar.spent + people.sandra.spent + people.uibo.spent + people.luiza.spent;
            people.oskar.precentage = ((people.oskar.spent / total_spending) * 100).toFixed(2);
            people.sandra.precentage = ((people.sandra.spent / total_spending) * 100).toFixed(2);
            people.uibo.precentage = ((people.uibo.spent / total_spending) * 100).toFixed(2);
            people.luiza.precentage = ((people.luiza.spent / total_spending) * 100).toFixed(2);

            res.render('main', {
                data: dateObjectArray,
                people: people
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