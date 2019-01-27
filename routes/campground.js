var express = require("express");
var routes = express.Router();
var campground = require("../models/campground.js");
var middleware = require("../middleware/index.js");


//Index to show all campgrounds
routes.get("/campgrounds", function(req,res){
    campground.find({},function(err , allcampgrounds){
        if(err){
            req.flash("error",err.message);
            res.redirect("/campgrounds/"+req.params.id);
        }
        else{
            res.render("campground/index.ejs",{campgrounds: allcampgrounds, currentuser: req.user});
        }
    });
       
    //   res.render("campgrounds.ejs", {campgrounds: campgrounds});
});
//create to create new campground
routes.post("/campgrounds",middleware.isLoggedIn, function(req,res){
   // get data from form and add to the campground array
   var name = req.body.name, 
       image_url = req.body.image_url, 
       desc = req.body.description;
    var add= { name: name , 
        image: image_url, 
        description: desc}; 
    campground.create(add, function(err,camp){
        if(err){
            req.flash("error",err.message);
            res.redirect("/campgrounds");
        }
        else{
            camp.user.id = req.user._id;
            camp.user.username = req.user.username;
            camp.save();
            req.flash("success","Your campground was added successfully");
            res.redirect("/campgrounds");
        }
    });
    // res.redirect("/campgrounds");
});
//new the route which has the form for creating a new route
routes.get("/campgrounds/new",middleware.isLoggedIn, function(req,res){
   res.render("campground/new.ejs",{currentuser: req.user}); 
});

//shows more info about one campground
routes.get("/campgrounds/:id", function(req, res){
    //find the campground and show more details
    campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
        if(err){
            req.flash("error",err.message);
            res.redirect("/campgrounds");
        }
        else{
            res.render("campground/show.ejs", { campground:foundCampground,currentuser: req.user});
        }
    });
});
//--------------------middleware-------------------

//---------------Edit Campground--------------

routes.get("/campgrounds/:id/edit",middleware.isLoggedIn, middleware.isAutherised, function(req,res){
    campground.findById(req.params.id, function(err , campground){
        if(err){
            req.flash("error",err.message);
            res.redirect("/campgrounds");
        }
        res.render("campground/edit.ejs" , {campground: campground, currentuser: req.user});
    });
});

//---------------Update Campgroud----------------

routes.put("/campgrounds/:id/edit",middleware.isLoggedIn, middleware.isAutherised, function(req,res){
    var data = {name: req.body.name , image: req.body.image_url, description: req.body.description};
    campground.findById(req.params.id,function(err, foundcamp){
        if(err){
            req.flash("error",err.message);
            res.redirect("/campgrounds/"+req.params.id);
        }
        else{
            foundcamp.name = req.body.name;
            foundcamp.image = req.body.image_url;
            foundcamp.description = req.body.description;
            foundcamp.save();
            req.flash("success","Campground has been updates successfully");
            res.redirect("/campgrounds/"+foundcamp._id);
        }
    });
});

//--------------------delete----------------------
routes.delete("/campgrounds/:id",middleware.isLoggedIn,middleware.isAutherised, function(req,res){
    // isAutherised( req.params.id,req, res);
    campground.deleteOne({_id:req.params.id},function(err){
        if(err){
            req.flash("error",err.message);
            res.redirect("/campgrounds/"+req.params.id);
        }
        else{
            req.flash("success","Campground was deleted successfully");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = routes;