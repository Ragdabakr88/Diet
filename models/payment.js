const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseSchemaOptions = require('./mongooseSchemaOptions');
const mainHelper = require('./../helpers/mainHelper');

const paymentSchema = new Schema({

    _id: {
        type: ObjectId,
    },
    user_id: {
        type: ObjectId,
        ref: 'user'
    },
    payment: {
        type: Number
    },
} , mongooseSchemaOptions);

module.exports = UserModel = mongoose.model('Payment', paymentSchema);