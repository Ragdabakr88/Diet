const express = require('express');
const router = express.Router();
const Diet = require('../../models/diet');
const User = require('../../models/user');
const authGuard = require('../../helpers/authGuard');

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
        return res.redirect('/admin/user/?page=1');
    };
    const userCount = await User.countDocuments().exec();
    const users = await User.find()
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort({ _id: -1 })
    .exec();

    if(page > 1 && users.length === 0) {
        return res.redirect('/admin/user/?page=1');
    } else {
        res.render('admin/allusers', {
            users,
            current: parseInt(page),
            pages: Math.ceil(userCount / perPage)
        });
    }

}
  catch (err) {
    console.error("There was an error:", err.message);
  }
});

// ---------------- Delete user---------------- 
router.delete('/delete/:id',async function (req, res,next){

  try {

    const user = await User.findOneAndDelete({
      _id: req.params.id
    })
    .exec();
    
    req.flash('success_message', 'User remove');
    res.redirect('/admin/user');

  } catch ( err ) {
    next(err);
  };

});

module.exports = router;