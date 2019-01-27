var express = require("express");
var routes = express.Router();
var campground = require("../models/campground.js");
var user = require("../models/user.js");
var passport = require("passport");

routes.get("/",function(req,res){
    res.render("landing.ejs",{currentuser: req.user});
});

//---------------------authinticate route----------------------------------------
routes.get("/register", function(req,res){
    res.render("register.ejs",{currentuser: req.user});
});

routes.post("/register", function(req,res){
    var newUser = new user({username: req.body.username});
    user.register(newUser, req.body.password, function(err,user){
        if(err){
            req.flash("error",err.message); 
            return res.render("register.ejs",{currentuser: req.user});
        }
        else{
            var authenticate = passport.authenticate("local");
            authenticate(req,res, function(){
                req.flash("success","Welcome to YelpCamp "+user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

// --------login---------------

routes.get("/login", function(req,res){
    res.render("login.ejs",{currentuser: req.user});
});

routes.post("/login",passport.authenticate("local",{successRedirect: "/campgrounds", failureRedirect: "/login"}) ,function(req,res){});

//-------------------logout-------------------------

routes.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "You have been succesfully logged out");
    res.redirect("back");
});

//--------------------authenticated comments------------------------



function isLoggedIn(req,res,next){
    // console.log(req.isAuthenticated());
    if(req.isAuthenticated()){
        console.log("authenticate");
        return next();
    }
    else{
        req.flash("error","Please Login first")
        res.redirect("/login");
    }
}

module.exports = routes;