const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseSchemaOptions = require('./mongooseSchemaOptions');
const mainHelper = require('./../helpers/mainHelper');

const userSchema = new Schema({

  name:{
    type: String,
    required: true 
  },
  email:{ 
    type: String,
    required: true ,
    unique : true,
    index : true
  },
  password:{ 
    type: String,
    required: true 
  },
  isAdmin:{
    type:Boolean,
    default:false
  },
  isPayment:{
    type:Boolean,
    default:false
  },

  isMealplan:{
    type:Boolean,
    default:false
  },
   isResturant:{
    type:Boolean,
    default:false
  },
  isPlan: { 
    type:Boolean,
    default:false},
   
  image: String,
} , mongooseSchemaOptions);

module.exports = UserModel = mongoose.model('User', userSchema);

//Admin username and password
const addDefaultData = async () => {
  if(await UserModel.countDocuments() === 0) {
    UserModel.create(      
        {
          name : 'admin',
          email : 'ahmed@gmail.com',
          password : mainHelper.hashSync('admin2018demo'),
          isAdmin : true,
        }
    )
    .then( admin => {
    })
    .catch( err => {
    });
  }
};
addDefaultData()
