const express = require('express');
const router = express.Router();
const Diet = require('../../models/diet');
const User = require('../../models/user');
const Product = require('../../models/product');
const expressFileupload = require('express-fileupload');
const authGuard = require('../../helpers/authGuard');
const messages = require('./../../databases/messages/en.json');
const fs = require('fs');

// ---------------- Redirect to admin layout ---------------- 
router.all("/*"  , function(req,res,next){
	res.app.locals.layout = "admin";
	next();
});

// ---------------- Admin---------------- 
router.get('/',async  function (req, res) {
try{
    const perPage = 12;
    const page = req.query.page;

    if(isNaN(page) || page == '0') {
        return res.redirect('/admin/product/?page=1');
    };
    const productCount = await Product.countDocuments().exec();
    const products = await Product.find()
    .populate('user')
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort({ _id: -1 })
    .exec();

    if(page > 1 && products.length === 0) {
        return res.redirect('/admin/product/?page=1');
    } else {
        res.render('admin/allproducts', {
            products,
            current: parseInt(page),
            pages: Math.ceil(productCount / perPage)
        });
    }

}
  catch (err) {
    console.error("There was an error:", err.message);
  }
});

// ---------------- Edit product -------------- 


router.get('/edit/:id',function (req, res) {
  Product.findOne({ _id: req.params.id }).populate('user').exec(function(err,product){
  if(err){
    console.log(err);
  }
  res.render('home/editproduct',{product:product});
  });
});

router.post('/edit/:id',expressFileupload(), async function (req, res, next) {

try{
    req.checkBody('title' , messages.title_required ).notEmpty();
     
    req.checkBody('company' , messages.company_required ).notEmpty();
     
    req.checkBody('link' , messages.link_required ).notEmpty();

    req.checkBody('Discrption' , messages.Discrption_required ).notEmpty();

  const errors = await req.validationErrors();
  if (errors) {
    res.render('admin/editproduct', {
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



        let facts = [];

    if (Array.isArray(req.files.facts)) {

      for (let i = 0; i < req.files.facts.length; ++i) {
        const file = req.files.facts[i];
        let __filename = Date.now() + '-' + file.name;
        file.mv('./public/uploads/' + __filename, (err) => {
          if (err) throw err;
        });
        facts.push(__filename);
      };

    } else if (typeof req.files.facts !== 'undefined') {

      const file = req.files.facts
      let __filename = Date.now() + '-' + file.name;
      file.mv('./public/uploads/' + __filename, (err) => {
        if (err) throw err;
      });

     facts.push(__filename);

    } else {
     facts.push('no-image.jpg');
    };

 Product.findOne({_id: req.params.id},function(err,product){
    product.user = req.user._id;
    product.title = req.body.title;
    product.company = req.body.company;
    product.link = req.body.link;
    product.Discrption = req.body.Discrption;
    product.images = images;
    product.facts= facts;
    product.save(function (err, product) {
      if (err) {
        console.log(err);
      }
      req.flash('success_message', ' Product added!');
      res.redirect('/admin/product');
    });
  });

  };
}

  catch (err) {
    console.error("There was an error:", err.message);
  }


});
// ---------------- Add products page---------------- 

router.get('/add',function(req,res){
    res.render('admin/addproduct');
});

// ---------------- Add product page ---------------- 


router.post('/add',expressFileupload(), async function (req, res, next) {

try{
    req.checkBody('title' , messages.title_required ).notEmpty();
     
    req.checkBody('company' , messages.company_required ).notEmpty();
     
    req.checkBody('link' , messages.link_required ).notEmpty();

    req.checkBody('Discrption' , messages.Discrption_required ).notEmpty();

  const errors = await req.validationErrors();
  if (errors) {
    res.render('admin/addproduct', {
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



        let facts = [];

    if (Array.isArray(req.files.facts)) {

      for (let i = 0; i < req.files.facts.length; ++i) {
        const file = req.files.facts[i];
        let __filename = Date.now() + '-' + file.name;
        file.mv('./public/uploads/' + __filename, (err) => {
          if (err) throw err;
        });
        facts.push(__filename);
      };

    } else if (typeof req.files.facts !== 'undefined') {

      const file = req.files.facts
      let __filename = Date.now() + '-' + file.name;
      file.mv('./public/uploads/' + __filename, (err) => {
        if (err) throw err;
      });

     facts.push(__filename);

    } else {
     facts.push('no-image.jpg');
    };

    var product = new Product();
    product.user = req.user._id;
    product.title = req.body.title;
    product.company = req.body.company;
    product.link = req.body.link;
    product.Discrption = req.body.Discrption;
    product.images = images;
    product.facts= facts;
    product.save(function (err, product) {
      if (err) {
        console.log(err);
      }
      req.flash('success_message', ' Product added!');
      res.redirect('/admin/product');
    });

  };
}
  catch (err) {
    console.error("There was an error:", err.message);
  }


});

// ---------------- Remove product -------------- 

 // ---------------- Delete Product and it's images ---------------- 
router.delete('/delete/:id',async function (req, res,next){

  try {

    const product = await Product.findOneAndDelete({
      _id: req.params.id
    })
    .exec();
    
    if(product) {
      product.images.forEach( src => {
        fs.unlink(`./public/uploads/${src}` , () => {});
      });
    };

    req.flash('success_message', 'Product remove');
    res.redirect('/admin/product');

  } catch ( err ) {
    next(err);
  };

});
module.exports = router;