const UserModel = require('./../models/user');

class AuthGuard {
    constructor() {};
    isAdmin(req, res, next){
        if(req.isAuthenticated()){
            if(req.user.isAdmin){
                return next();
            } else {
                res.redirect('/');
            }
        } else  {
            res.redirect('/login');
        };
    };

   isAdvertiser(req, res, next){

            if (req.user.isAdvertiser === true){
                return next();
            } else {
                res.redirect('/payment');
            }

    };


};



module.exports = authGuard = new AuthGuard();