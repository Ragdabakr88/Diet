const mongoose = require('mongoose');
const mongooseSchemaOptions = require('./mongooseSchemaOptions');
const Schema = mongoose.Schema;

const dietSchema = new Schema({
    user: {
       type: Schema.Types.ObjectId,
       ref:'User'
    },
    isGoal: {
      type: String,
      required: true
    },
    isExercise: {
      type: String,
      required: true
    },
    height:{
      type: Number,
      required: true
    },
    weight:{
      type: Number,
      required: true
    },
    age:{
        type: Number,
        required: true
    },
    isGender:{
     type: String,
      required: true
  },createdAt: { type: Date, default: Date.now },
} , mongooseSchemaOptions);

module.exports = Diet = mongoose.model('Diet', dietSchema);


