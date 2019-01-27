var express = require("express");
var routes = express.Router();
var campground = require("../models/campground.js");
var comments = require("../models/comments.js");
var middleware = require("../middleware/index.js");


routes.get("/campgrounds/:id/comments/new",middleware.isLoggedIn, function(req,res){
    campground.findOne({_id: req.params.id}, function(err,foundcampground){
        if(err){
            req.flash("error",err.message);
            res.redirect("back");
        }
        else{
            res.render("comments/comments.ejs", { campground: foundcampground,currentuser: req.user});
        }
        
    });
});

routes.post("/campgrounds/:id/comments",middleware.isLoggedIn, function(req,res){
    // console.log("entered");
    var comm = req.body.newcomment;
    var id = req.body.id;
    var newcomm = { text: comm};
    console.log(newcomm);
        campground.find({_id: req.params.id}, function(err,foundcampground){
           if(err){console.log(err);}
             else{
                comments.create(newcomm, function(err,newcomment){
                    if(err){
                        req.flash("error","Erroe while creating comment");
                        res.redirect("/campgrounds/"+req.params.id);
                        
                    }
                    else{
                        // console.log(foundcampground);
                        newcomment.author.id = req.user._id;
                        newcomment.author.username = req.user.username;
                        newcomment.save();
                        foundcampground[0].comments.push(newcomment);
                        foundcampground[0].save();
                        var redirect = "/campgrounds/"+req.params.id;
                        req.flash("success","Comment added succesfully!!!");
                        res.redirect("/campgrounds/"+req.params.id);
                    }
                
            });
        }
    });
});
//----------------------middleware------------------


//--------------------------edit comment---------------
routes.get("/campgrounds/:id/comments/:id2/edit" ,middleware.isLoggedIn , middleware.isAutherisedcomment , function(req,res){
    campground.findById(req.params.id , function(err,foundCampground){
        if(err){
            req.flash("error",err.message);
            res.redirect("back");
        }
        else{
            res.render("comments/edit.ejs",{campground: foundCampground, currentuser: req.user, id2:req.params.id2});
        }
    });
});


routes.put("/campgrounds/:id/comments/:id2",middleware.isLoggedIn , middleware.isAutherisedcomment, function(req,res){
    comments.findById(req.params.id2 , function(err,foundcomment){
        if(err){
            req.flash("error",err.message);
            res.redirect("/campgrounds/"+req.params.id);
        }
        else{
            foundcomment.text = req.body.newcomment;
            foundcomment.save();
            req.flash("success","Comment Updated Succesfully");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
//------------------------------------delete comment--------------------------------------------
routes.delete("/campgrounds/:id/comments/:id2/delete", middleware.isLoggedIn, middleware.isAutherisedcomment, function(req,res){
    campground.findById(req.params.id , function(err,foundCampground){
            if(err){
                req.flash("error",err.message);
                res.redirect("/campgrounds/"+req.params.id);
            }
            else{
                // console.log(campground.comments[0]);
                // campground.comments.splice(campground.comments.indexOf(req.params.id2),1);
                comments.deleteOne({_id:req.params.id2},function(err){
                    if(err){
                        req.flash("error",err.message);
                        res.redirect("/campgrounds/"+req.params.id);
                    }
                    else{
                        req.flash("success","Comment was deleted Seccesfully");
                        res.redirect("/campgrounds/"+req.params.id);
                    }
                });
            }
        });
    
});

module.exports = routes;

