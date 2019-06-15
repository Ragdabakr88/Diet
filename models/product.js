const mongoose = require('mongoose');
const mongooseSchemaOptions = require('./mongooseSchemaOptions');
const Schema = mongoose.Schema;

const productSchema = new Schema({


  user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    facts:[String]
    ,
    company:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    },
    Discrption:{
        type: String,
        require: true
    },
    createdAt: { type: Date, default: Date.now },
    images:[String]
} , mongooseSchemaOptions);

productSchema.index({
    'company'  : 'text', 
    'title' : 'text'
});

module.exports = Product= mongoose.model('Product', productSchema);


