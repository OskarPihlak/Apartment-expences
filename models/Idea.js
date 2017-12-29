const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const IdeaSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  amountSpent:{
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
}
});

mongoose.model('ideas', IdeaSchema);