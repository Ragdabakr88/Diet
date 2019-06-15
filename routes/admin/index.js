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
router.get('/', function (req, res) {
    res.render('admin/index');
});
module.exports = router;