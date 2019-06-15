const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Resturant= require('../../models/resturant');
const Comment = require('../../models/comment');
const nodemailer = require('nodemailer');
const async = require('async');
const expressFileupload = require('express-fileupload');
const smtpTransport = require('nodemailer-smtp-transport');
const authGuard = require("../../helpers/authGuard");
const mainHelper = require('./../../helpers/mainHelper');
const messages = require('./../../databases/messages/en.json');


const fs = require('fs');

// ---------------- Redirect to home layout ---------------- 
router.all("/*" ,function(req,res,next){
    res.app.locals.layout = "layout";
    next();
});



router.post("/", function(req, res, next) {
    async.waterfall([
      function(callback) {
        var comment = new Comment();
        comment.user = req.user._id;
        comment.resturant = req.body.resturantId;
        comment.comment = req.body.comment;

       comment.save(function(err) {
          callback(err, comment);
        });
      },

      function(comment, callback) {
       Resturant.update(
          {
            _id: req.body.resturantId
          },{
            $push: { comments:{
        user : req.user._id,
        resturant : req.body.resturantId,
        comment : req.body.comment
            }}
          }, function(err, count) {
            res.redirect('/resturant/'+ req.body.resturantId);
          }
        )
      }
    ]);
  });






router.delete('/delete/:id',async function (req, res,next){
  var commentId = req.params.id;
  var resturantId = req.body.resturantId;
  console.log("commentId" + commentId);
  console.log("resturantId" + resturantId);
  async.waterfall([
    function(callback) {
      Comment.findOne({ _id:commentId}, function(err, comment) {
        console.log("comment" + comment);
        callback(err, comment);
        
      })

    },

    function(comment, callback) {
      Resturant.update(
        {
          _id:req.body.resturantId
        },
        {
          $pull: { comments: commentId}
        }, function(err, count) {

           req.flash('success_message', 'Comment removed');
           res.redirect('/resturant/'+ req.body.resturantId);

        }
      );
    }
  ]);
});



module.exports = router;

