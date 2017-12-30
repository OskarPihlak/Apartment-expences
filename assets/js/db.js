let mongoose = require('mongoose');

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

module.exports.finance = mongoose.model('finance', financeSchema);

