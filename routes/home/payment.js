const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Product = require('../../models/product');

// Stripe payments
const keyPublishable = 'pk_test_iY8A2porPnfELljsUhTWHnSW';
const keySecret = 'sk_test_afivWC2JCupTa4odyxFzO5dQ';
const stripe = require('stripe')(keySecret);

// ---------------- Redirect to home layout ---------------- 
router.all("/*" ,function(req,res,next){
    res.app.locals.layout = "layout";
    next();
});

// ---------------- Add basic paln ---------------- 

router.get('/pay',function(req,res){
    res.render('home/addproduct');
});
router.post("/pay1",  function(req, res) {
  var chargeAmount = req.body.chargeAmount;
  var token = req.body.stripeToken;
  var email = req.body.stripeEmail;


     stripe.customers.create({
      email: email,
      source:token,

    },function(err,customer){
      console.log('err' , err);
      console.log('customer' , customer);
      if(err){
          res.send({
            success:false,
            message:err
          });
      }else{
           const {id} = customer;
          
        stripe.subscriptions.create({
          customer: id,
          items: [{
          plan: "basic",
          }],
   
  
}, function(err, subscription) {
  console.log(err);
  console.log('subscription',subscription);
      if(err){
          res.send({
            success:false,
            message:err
          });
        }else{
        console.log("success");
    
        User.findByIdAndUpdate(req.body.user_id, { isPayment: true ,isPlan:true})
                .exec()
                .then(user => {
                    console.log("isPayment success");
                    res.redirect("/payment/pay")
                })
                .catch(error => res.redirect("/payment/pay1"));
        res.redirect('/payment/pay');
        }
 
      });
    }
 });

});


// ---------------- Add selver paln ---------------- 

router.post("/pay2",  function(req, res) {
  var chargeAmount = req.body.chargeAmount;
  var token = req.body.stripeToken;
  var email = req.body.stripeEmail;


     stripe.customers.create({
      email: email,
      source:token,

    },function(err,customer){
      console.log('err' , err);
      console.log('customer' , customer);
      if(err){
          res.send({
            success:false,
            message:err
          });
      }else{
           const {id} = customer;
          stripe.subscriptions.create({
         customer: id,
         items: [
       {
       plan: "selver",
        },
  ]
}, function(err, subscription) {
  console.log(err);
  console.log(subscription);
      if(err){
          res.send({
            success:false,
            message:err
          });
        }else{
        console.log("success");
        User.findByIdAndUpdate(req.body.user_id, { isPayment: true })
                .exec()
                .then(user => {
                    console.log("isPayment success");
                    res.redirect("/payment/pay")
                })
                .catch(error => res.redirect("/payment/pay2"));
        res.redirect('/payment/pay');
        }
 
      });
    }
 });



});


// ---------------- Add Gold paln ---------------- 


router.post("/pay3",  function(req, res) {
  var chargeAmount = req.body.chargeAmount;
  var token = req.body.stripeToken;
  var email = req.body.stripeEmail;


     stripe.customers.create({
      email: email,
      source:token,

    },function(err,customer){
      console.log('err' , err);
      console.log('customer' , customer);
      if(err){
          res.send({
            success:false,
            message:err
          });
      }else{
           const {id} = customer;
          stripe.subscriptions.create({
         customer: id,
         items: [
       {
          plan: "gold",
          
        },
  ]
}, function(err, subscription) {
  console.log(err);
  console.log(subscription);
      if(err){
          res.send({
            success:false,
            message:err
          });
        }else{
        console.log("success");
        User.findByIdAndUpdate(req.body.user_id, { isPayment: true })
                .exec()
                .then(user => {
                    console.log("isPayment success");
                    res.redirect("/payment/pay")
                })
                .catch(error => res.redirect("/payment/pay3"));
        res.redirect('/payment/pay');
        }
 
      });
    }
 });



});



// ---------------- Add Resturant payment ---------------- 
router.get('/resturantPay',function(req,res){
    res.render('home/resturantPay');
});

router.post("/resturantPay",  function(req, res) {
  var chargeAmount = req.body.chargeAmount;
  var token = req.body.stripeToken;
  var email = req.body.stripeEmail;


     stripe.customers.create({
      email: email,
      source:token,

    },function(err,customer){
      console.log('err' , err);
      console.log('customer' , customer);
      if(err){
          res.send({
            success:false,
            message:err
          });
      }else{
           const {id} = customer;
          stripe.subscriptions.create({
         customer: id,
         items: [
       {
          plan: "resturant",
        },
  ]
}, function(err, subscription) {
  console.log(err);
  console.log(subscription);
      if(err){
          res.send({
            success:false,
            message:err
          });
        }else{
        console.log("success");
        User.findByIdAndUpdate(req.body.user_id, { isResturant: true })
                .exec()
                .then(user => {
                    console.log("isPayment success");
                    res.redirect("/payment/resturant")
                })
                .catch(error => res.redirect("/payment/pay"));
        res.redirect('/resturant/addResturant');
        }
 
      });
    }
 });



});
module.exports = router;
