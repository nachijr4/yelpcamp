var middlewareobj={};
var campground = require("../models/campground.js");
var comments = require("../models/comments.js")

middlewareobj.isLoggedIn = function (req,res,next){
    // console.log(req.isAuthenticated());
    if(req.isAuthenticated()){
        // console.log("authenticate");
        return next();
    }
    else{
        req.flash("error","Please Login first");
        res.redirect("/login");
    }
}

middlewareobj.isAutherisedcomment = function(req , res,next){
    // console.log(req.params.id.toString()+" "+req.user._id.toString());
    campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error","Campground Not found");
            res.redirect("back");
            
        }
        else{
            comments.findById(req.params.id2, function(err, foundcomment){
                if(foundcomment.author.id.toString() === req.user.id){
                return next();
            }
            else{
                req.flash("error","You are not authorised to make changes in the comments");
                res.redirect("back");
            }
                
            });
                // console.log("no");
        }
    });
}

middlewareobj.isAutherised = function (req , res,next){
    // console.log(req.params.id.toString()+" "+req.user._id.toString());
    campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error","Campground Not found");
            res.redirect("back");
            
        }
        else{
            if(foundCampground.user.id.toString() === req.user._id.toString()){
                // console.log("no");
                return next();
            }
            else{
                req.flash("error","You are not authorized to make Changes to the campground");
                res.redirect("back");
            }
        }
    });
}

module.exports = middlewareobj;