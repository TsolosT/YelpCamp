require('dotenv').config();
//local server port
const port = process.env.PORT || 3000;
//requires
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose"),
    flash =require("connect-flash"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user");
//foo seed class
const seedDB = require("./seeds");
//requiring routes
const campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");

//connect to db
mongoose.connect(process.env.DATABASURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=>{
    console.log("Connected to DB!");
}).catch(err=>{
    console.log("ERROR:",err.message);
});
//sets
app.set("view engine", "ejs");
//uses
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment=require("moment");
//seedDB(); //seed the database

//Passport Config.
app.use(require("express-session")({
    secret: "Ermhs my best buddy",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

//Basic routes
app.get("/", function (req, res) {
    res.render("landing");
});
//bad route request
app.get("*", function (req, res) {
    res.render("lostpage"); 
});
//Server Start Point
app.listen(port,process.env.IP,function () {
     console.log("YelpCamp server has started on 3000 port ...press ctrl+C to stop!");
})
