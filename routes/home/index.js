const express = require('express');
const router = express.Router();
const UserModel = require('../../models/user');
const Diet = require('../../models/diet');
const nodemailer = require('nodemailer');
const Product = require('../../models/product');
const Resturant = require('../../models/resturant');
const smtpTransport = require('nodemailer-smtp-transport');
const authGuard = require("../../helpers/authGuard");
const mainHelper = require('./../../helpers/mainHelper');
const messages = require('./../../databases/messages/en.json');
const {GenerateTime} = require('./../../helpers/hbs-helpers');
var moment = require('moment');
moment().format();

// ---------------- Redirect to home layout ---------------- 
router.all("/*" ,function(req,res,next){
    res.app.locals.layout = "layout";
    next();
});

// ---------------- Register---------------- 
router.get('/register', function (req, res) {
    res.render('home/register');
});
router.post('/register', async function (req, res) {

    req.checkBody('name', messages.name_required).notEmpty()
    req.checkBody('email', messages.email_required).notEmpty()
    req.checkBody('email', messages.email_invlid).isEmail()
    req.checkBody('password', messages.password_required).notEmpty()
    req.checkBody('password', messages.password_not_match).equals(req.body.passwordConfirm);

    const errors = await req.validationErrors();
    if (errors) {

        return res.render('home/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
        });

    } else {

        UserModel.create({
            name: req.body.name,
            email: req.body.email,
            image: 'no-image.jpg',
            password: mainHelper.hashSync(req.body.password),
        })
            .then(user => {
                req.logIn(user, err => {
                    if (err) {
                        req.flash("error_message", messages.server_error);
                    } else {
                        req.session.cookie.expires = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 2));
                        req.flash("success_message", messages.register_success);
                        res.redirect('/dietsteps')
                    };
                });
            })
            .catch((err) => {
                if(mainHelper.isUniqueError(err)) {
                    res.render('home/register', {
                        errors: [ messages.email_used_before ],
                        name: req.body.name,
                        email: req.body.email,
                    });
                } else {
                    req.flash("error_message", messages.server_error);
                    res.redirect('/register')
                }
            });

    };

});

// ---------------- Login---------------- 

router.get('/login',  function (req, res) {
    res.render('home/login');
});

router.post('/login', async function (req, res) {

    req.checkBody('password', messages.password_invlid).notEmpty()
    req.checkBody('email', messages.email_required).notEmpty()

    const errors = await req.validationErrors();
    if (errors) {

        return res.render('home/login', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
        });

    } else {

        UserModel.findOne({
            email : req.body.email
        })
        .then(user => {
            if(user) {
                if(mainHelper.compareSync(req.body.password , user.password)) {
                    req.logIn(user, err => {
                        if (err) {
                            req.flash("error_message", messages.server_error);
                        } else {
                            if(req.body.rememberMe) {
                                req.session.cookie.expires = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 2));
                            } else {
                                req.session.cookie.expires = new Date(new Date().getTime() + (1000 * 60 * 60 * 6));
                            };
                            req.flash("success_message", messages.register_success);
                            res.redirect('/')
                        };
                    });
                } else {
                    res.render('home/login', {
                        errors: [messages.password_not_match],
                        name: req.body.name,
                        email: req.body.email,
                    });
                }
            } else {
                res.render('home/login', {
                    errors: [messages.user_not_found],
                    name: req.body.name,
                    email: req.body.email,
                });
            };
        })
        .catch( err => next(err))

    };

});

// ---------------- Logout ---------------- 
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

// ---------------- Homepage---------------- 
router.get('/',  function (req, res) {
    Product.find({}).limit(4).exec(function(err,products){
    Resturant.find({}).limit(3).exec(function(err,resturants){
    res.render('home/index',{products:products,resturants:resturants});
       });
    });
});

// ---------------- Create new dietsteps get --------------- 

router.get('/dietsteps',function(req,res){
    res.render('home/dietsteps');
});


// ---------------- Create new dietsteps post --------------- 

router.post('/dietsteps', async function(req,res){

     req.checkBody('height' , messages.height_required ).notEmpty();
     req.checkBody('height' , messages.height_invlid ).isNumeric();
     
     req.checkBody('weight' , messages.weight_required ).notEmpty();
     req.checkBody('weight' , messages.weight_invlid ).isNumeric();
     
     req.checkBody('age' , messages.age_required ).notEmpty();
     req.checkBody('age' , messages.age_invlid ).isNumeric();

     req.checkBody('isGoal' , messages.goal_required ).notEmpty();
     req.checkBody('isGender' , messages.gender_required ).notEmpty();
     req.checkBody('isExercise' , messages.ex_required ).notEmpty();

  const errors = await req.validationErrors();
  if (errors) {
    res.render('home/dietsteps', {
      errors,
    });

  } else {


     var diet = new Diet();
     diet.user = req.user._id;
     diet.isGoal = req.body.isGoal;
     diet.isExercise = req.body.isExercise;
     diet.isGender = req.body.isGender;
     diet.height = req.body.height;
     diet.weight = req.body.weight;
     diet.age = req.body.age;
     diet.save(function(err,diet){


     UserModel.findByIdAndUpdate(req.body.user_id, { isMealplan: true })
        .exec()
        .then(user => {

                const dietStart = moment(diet.createdAt).format("DD/MM/YYYY");
                const dietEnd  = moment(diet.createdAt).add(1,'day').format("DD/MM/YYYY");

               if (user.isMealplan === true && diet.createdAt === dietEnd) {

                 User.update({_id: user.id},{isMealplan: false},function(){});
                 console.log("Your meal plan diet is expired so you can get new one");
                 res.redirect("/dietsteps")
                 }

           console.log("isMealplan success");
            res.redirect("/checkout")
        })
        .catch(error => res.redirect("/dietsteps"));

        if(err){console.log(err)}
        req.flash('success_message', 'Plan steps added'); 
        res.redirect('/mealplan'); 
     });
 };

});




// ---------------- Find all mealplans page --------------- 

router.get('/mealplan',async function(req,res){
  try{
    const products = await Product.find().limit(4);
    const diets = await Diet.find({ user: req.user._id })
    .populate('user')
    .sort({ _id: -1 })
    .limit(1)
    .exec()

    res.render('home/mealplan',{diets,products});
}
  catch(err){
    next(err);
  };
});



// // ---------------- Registersponser---------------- 
router.get('/registersponser', function (req, res) {
    res.render('home/registersponser');
});
router.post('/registersponser', async function (req, res) {

    req.checkBody('name', messages.name_required).notEmpty()
    req.checkBody('email', messages.email_required).notEmpty()
    req.checkBody('email', messages.email_invlid).isEmail()
    req.checkBody('password', messages.password_required).notEmpty()
    req.checkBody('password', messages.password_not_match).equals(req.body.passwordConfirm);

    const errors = await req.validationErrors();
    if (errors) {

        return res.render('home/registersponser', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
        });

    } else {

        UserModel.create({
            name: req.body.name,
            email: req.body.email,
            image: 'no-image.jpg',
            password: mainHelper.hashSync(req.body.password),
        })
            .then(user => {
                req.logIn(user, err => {
                    if (err) {
                        req.flash("error_message", messages.server_error);
                    } else {
                        req.session.cookie.expires = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 2));
                        req.flash("success_message", messages.register_success);
                        res.redirect('/payment')
                    };
                });
            })
            .catch((err) => {
                if(mainHelper.isUniqueError(err)) {
                    res.render('home/registersponser', {
                        errors: [ messages.email_used_before ],
                        name: req.body.name,
                        email: req.body.email,
                    });
                } else {
                    req.flash("error_message", messages.server_error);
                    res.redirect('/registersponser')
                }
            });

    };

});

// ---------------- Payment---------------- 

router.get('/payment',function(req,res){
    res.render('home/payment');
});


// ---------------- Find product in search---------------- 

router.get('/search', function (req, res, next) {
    const searchQuery  = req.query.searchQuery;
    const query = {
        $text : { 
            $search : searchQuery 
        },
    }

    Product.find(query)
    .populate('user')
    .exec()
    .then( products => {
        console.log({products})
        res.render('home/search', { 
            products
        });
    })
    .catch( err => next(err))
});

router.post('/search', function (req, res, next) {
    const str = `searchQuery=${req.body.searchQuery}`;
    res.redirect('/search?' + str);
});

// ---------------- Find resturants in search---------------- 

router.get('/searchRes', function (req, res, next) {
    const searchQuery  = req.query.searchQuery;
    const query = {
        $text : { 
            $search : searchQuery 
        },
    }

    Resturant.find(query)
    .populate('user')
    .exec()
    .then( resturants => {
        console.log({resturants})
        res.render('home/searchRes', { 
            resturants
        });
    })
    .catch( err => next(err))
});

router.post('/searchRes', function (req, res, next) {
    const str = `searchQuery=${req.body.searchQuery}`;
    res.redirect('/searchRes?' + str);
});



// ---------------- Find products related to user--------------- 

router.get('/my-products',async function(req,res,next){
  try{
    // var _id = mongoose.Types.ObjectId.fromString(id);
    const products = await Product.find()
    .limit(4)
    .exec()

    const myproducts = await Product.find({user:req.user.id})
    .populate('user')
    .exec()

    res.render('home/myproducts',{myproducts,products});
}
 catch (err) {
    console.error("There was an error:", err.message);
  }
});

// ---------------- Find products related to user--------------- 

router.get('/my-resturants',async function(req,res,next){
  try{
    // var _id = mongoose.Types.ObjectId.fromString(id);
    const resturants = await Resturant.find()
    .limit(4)
    .exec()

    const myresturants = await Resturant.find({user:req.user.id})
    .populate('user')
    .exec()

    res.render('home/myresturants',{myresturants,resturants});
}
 catch (err) {
    console.error("There was an error:", err.message);
  }
});

// ---------------- Find products related to user--------------- 
// function expireDiet(diet,user) {

//   if (user.isMealplan === true) {

//       const DietStart = moment(diet.cratedAt);
//       const DietEnd = DietStart .addMonths(3);

//       console.log("DietStart",DietStart);
//       console.log("DietEnd",DietEnd);

//      if(DietStart === DietEnd){
        

//           }
//      }

//   return isValid;
// }


module.exports = router;
