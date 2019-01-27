var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    campground = require("./models/campground.js"),
    comments = require("./models/comments.js"),
    seedsdb = require("./seeds.js"),
    passport = require("passport"),
    localstratergy = require("passport-local"),
    user = require("./models/user.js"),
    plm = require("passport-local-mongoose"),
    expressSession = require("express-session"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");
    
var campgroundroutes = require("./routes/campground.js"),
    commentsroutes = require("./routes/comments.js"),
    indexroutes = require("./routes/index.js");
    
//-------------------drying up routes ---------------------------


    
// seedsdb();
//---------------------------------------------------------------------
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use (express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//----------------------Passport configuration---------------------------------------------
passport.use(new localstratergy(user.authenticate()));
app.use(expressSession({
    secret:"This is the secret code",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentuser= req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use(campgroundroutes);
app.use(commentsroutes);
app.use(indexroutes);


// app.use(function(req,res,next){
//     res.locals.currentuser = req.user;
// });
//------------------------------------------------------------------------
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp started");
});









