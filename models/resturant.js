const mongoose = require('mongoose');
const mongooseSchemaOptions = require('./mongooseSchemaOptions');
const Schema = mongoose.Schema;

const resturantSchema = new Schema({


  user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    comments: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    resturant:{
        type: Schema.Types.ObjectId,
        ref: 'Resturant'
    },
    comment:{
        type: String,
        required: true
    }
  }],
    phone:{
         type: Number,
        required: true 
    },
    address:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    link:{
        type: String
    },
    Discrption:{
        type: String,
        require: true
    },
    images:[String]
    ,
    video:{
        type: String
    },
 
} , mongooseSchemaOptions);

 resturantSchema.index({
    'title' : 'text',
    'address' : 'text'
});

module.exports = Resturant = mongoose.model('Resturant', resturantSchema);


