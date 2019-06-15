const express = require('express');
const router = express.Router();
const Resturant = require('../../models/resturant');
const User = require('../../models/user');
const async = require('async');
const expressFileupload = require('express-fileupload');
const messages = require('./../../databases/messages/en.json');
const mainHelper = require('./../../helpers/mainHelper');
const fs = require('fs');

// ---------------- Direct to home page--------------- 

router.all("/*" ,function(req,res,next){
    res.app.locals.layout = "layout";
    next();
});


// ---------------- Add resturants page---------------- 

router.get('/addResturant',function(req,res){
    res.render('home/addResturant');
});
// ---------------- Post producs page ---------------- 

router.post('/addResturant',expressFileupload(), async function (req, res, next) {

try{
    req.checkBody('title' , messages.title_required ).notEmpty();     
    req.checkBody('phone' , messages.Phone_required ).notEmpty();
    req.checkBody('phone', messages.Phone_invlid).isMobilePhone('any');
    req.checkBody('address' , messages.Address_required ).notEmpty();     
    req.checkBody('link' , messages.link_required ).notEmpty();
    req.checkBody('Discrption' , messages.Discrption_required ).notEmpty();

  const errors = await req.validationErrors();
  if (errors) {
    res.render('home/addResturant', {
      errors,
    });

  } else {

    let images = [];

    if (Array.isArray(req.files.images)) {

      for (let i = 0; i < req.files.images.length; ++i) {
        const file = req.files.images[i];
        let __filename = Date.now() + '-' + file.name;
        file.mv('./public/uploads/' + __filename, (err) => {
          if (err) throw err;
        });
        images.push(__filename);
      };

    } else if (typeof req.files.images !== 'undefined') {

      const file = req.files.images
      let __filename = Date.now() + '-' + file.name;
      file.mv('./public/uploads/' + __filename, (err) => {
        if (err) throw err;
      });

      images.push(__filename);

    } else {
      images.push('no-image.jpg');
    };



        let video = [];

    if (Array.isArray(req.files.video)) {

      for (let i = 0; i < req.files.video.length; ++i) {
        const file = req.files.video[i];
        let __filename = Date.now() + '-' + file.name;
        file.mv('./public/uploads/' + __filename, (err) => {
          if (err) throw err;
        });
        video.push(__filename);
      };

    } else if (typeof req.files.video !== 'undefined') {

      const file = req.files.video
      let __filename = Date.now() + '-' + file.name;
      file.mv('./public/uploads/' + __filename, (err) => {
        if (err) throw err;
      });

     video.push(__filename);

    } ;

    var resturant = new Resturant();
    resturant.user = req.user._id;
    resturant.title = req.body.title;
    resturant.address = req.body.address;
    resturant.phone = req.body.phone;
    resturant.link = req.body.link;
    resturant.Discrption = req.body.Discrption;
    resturant.images = images;
    resturant.video = video;
    resturant.save(function (err, resturant) {
      if (err) {
        console.log(err);
      }
      req.flash('success_message', ' resturant added!');
      res.redirect('/resturant');
    });

  };
}
  catch (err) {
    console.error("There was an error:", err.message);
  }
});

// ---------------- Find all reaturants page --------------- 

router.get('/',async  function (req, res) {
try{
    const perPage = 8;
    const page = req.query.page;

    if(isNaN(page) || page == '0') {
        return res.redirect('/resturant/?page=1');
    };
    const resturantCount = await Resturant.countDocuments().exec();
    const resturants = await Resturant.find()
    .populate('user')
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort({ _id: -1 })
    .exec();

    if(page > 1 && resturants.length === 0) {
        return res.redirect('/resturant/?page=1');
    } else {
        res.render('home/resturants', {
            resturants,
            current: parseInt(page),
            pages: Math.ceil(resturantCount / perPage)
        });
    }

}
  catch (err) {
    console.error("There was an error:", err.message);
  }
});

// ---------------- Find single reaturant page --------------- 
router.get('/:id',async function(req,res){
  try{
    const resturants = await Resturant.find()
    .limit(4)
    .exec()

     const comments = await Comment.find().populate('user').populate('resturant')
    .limit(12)
    .exec()

    const resturant = await Resturant.findOne({ _id:req.params.id }).populate('comments')
    .populate('user').populate('resturant')
    .exec()

    res.render('home/single-resturant',{resturant,resturants,comments});
}
 catch (err) {
    console.error("There was an error:", err.message);
  }
});

// ---------------- Edit resturant -------------- 

router.get('/edit/:id',function (req, res) {
  Resturant.findOne({ _id: req.params.id }).populate('user').exec(function(err,resturant){
  if(err){
    console.log(err);
  }
  res.render('home/editresturant',{resturant:resturant});
  });
});


router.post('/edit/:id',expressFileupload(), async function (req, res, next) {

try{
    req.checkBody('title' , messages.title_required ).notEmpty();     
    req.checkBody('phone' , messages.Phone_required ).notEmpty();
    req.checkBody('phone', messages.Phone_invlid).isMobilePhone('any');
    req.checkBody('address' , messages.Address_required ).notEmpty();     
    req.checkBody('link' , messages.link_required ).notEmpty();
    req.checkBody('Discrption' , messages.Discrption_required ).notEmpty();

  const errors = await req.validationErrors();
  if (errors) {
    res.render('home/editresturant', {
      errors,
    });

  } else {

    let images = [];

    if (Array.isArray(req.files.images)) {

      for (let i = 0; i < req.files.images.length; ++i) {
        const file = req.files.images[i];
        let __filename = Date.now() + '-' + file.name;
        file.mv('./public/uploads/' + __filename, (err) => {
          if (err) throw err;
        });
        images.push(__filename);
      };

    } else if (typeof req.files.images !== 'undefined') {

      const file = req.files.images
      let __filename = Date.now() + '-' + file.name;
      file.mv('./public/uploads/' + __filename, (err) => {
        if (err) throw err;
      });

      images.push(__filename);

    } else {
      images.push('no-image.jpg');
    };



        let video = [];

    if (Array.isArray(req.files.video)) {

      for (let i = 0; i < req.files.video.length; ++i) {
        const file = req.files.video[i];
        let __filename = Date.now() + '-' + file.name;
        file.mv('./public/uploads/' + __filename, (err) => {
          if (err) throw err;
        });
        video.push(__filename);
      };

    } else if (typeof req.files.video !== 'undefined') {

      const file = req.files.video
      let __filename = Date.now() + '-' + file.name;
      file.mv('./public/uploads/' + __filename, (err) => {
        if (err) throw err;
      });

     video.push(__filename);

    } ;

 Resturant.findOne({_id: req.params.id},function(err,resturant){
    resturant.user = req.user._id;
    resturant.title = req.body.title;
    resturant.address = req.body.address;
    resturant.phone = req.body.phone;
    resturant.link = req.body.link;
    resturant.Discrption = req.body.Discrption;
    resturant.images = images;
    resturant.video = video;
    resturant.save(function (err, resturant) {
      if (err) {
        console.log(err);
      }
      req.flash('success_message', ' Resturant edited!');
      res.redirect('/my-resturants');
    });
  });

  };
}

  catch (err) {
    console.error("There was an error:", err.message);
  }


});
// ---------------- Delete resturant -------------- 
router.delete('/delete/:id',async function (req, res,next){
  try {

    const resturant = await Resturant.findOneAndDelete({
      _id: req.params.id
    })
    .exec();
    
    if(resturant) {
      resturant.images.forEach( src => {
        fs.unlink(`./public/uploads/${src}` , () => {});
      });
    };


    req.flash('success_message', 'Resturant removed');
    res.redirect('/my-resturants');

  } catch ( err ) {
    next(err);
  };

});

module.exports = router;