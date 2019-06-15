const mongoose = require('mongoose');
const mongooseSchemaOptions = require('./mongooseSchemaOptions');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
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
    },

 createdAt: { type: Date, default: Date.now }

} , mongooseSchemaOptions);



module.exports = Comment= mongoose.model('Comment', commentSchema);


