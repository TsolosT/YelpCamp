const express = require("express"),
    router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware=require("../middleware"); //automate include index(only in that περιπτωση)
var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
}; 
var geocoder = NodeGeocoder(options);
//mutler-cloudinary
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});



//INDEX - show all campgrounds
router.get("/campgrounds", function (req, res) {
    var noMatch = null;
    if(req.query.search)
    {   
        const regex=new RegExp(escapeRegex(req.query.search),'gi');
        Campground.find({name:regex}, function (err, fcampgrounds) {
            if (err) {
                //temp code
                console.log(err);
            } else {
                if(fcampgrounds.length < 1) {
                    noMatch = "No campgrounds match that query, please try again.";
                }
                res.render("campgrounds/index",{campgrounds:fcampgrounds, noMatch: noMatch});
            }
        });
    }
    else{
        //get all campgrounds from db
        Campground.find({}, function (err, allcampgrounds) {
            if (err) {
                //temp code
                console.log(err);
            } else {
                //render to the page
                res.render("campgrounds/index", {
                    campgrounds: allcampgrounds,page: 'campgrounds',noMatch:noMatch
                });
            }
        });
    }
});
//CREATE - add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, upload.single('image'),function(req, res){
    cloudinary.v2.uploader.upload(req.file.path,{folder:"yelpcamp/campgrounds/"}, function(err,result) {
        var name = req.body.name,
            image = result.secure_url,
            imageId=result.public_id,
            price= req.body.price,
            desc = req.body.description,
            author = {
                        id: req.user._id,
                        username: req.user.username
                    };
            geocoder.geocode(req.body.location, function (err, data) {
            // //   if (err || !data.length) { // If billing acc in google api was enable then use this so to work fine
            //     req.flash('error', 'Invalid address');
            //     return res.redirect('back');
            //   }
            //   var lat = data[0].latitude;
            //   var lng = data[0].longitude ;
            //   var location = data[0].formattedAddress ;
            var lat = 37.489960; //delete foo data value after fix the above problem
            var lng =  -119.661690;
            var location = 'Yosemite National Park, CA';
            var newCampground = {name: name,price:price, image: image,imageId:imageId, description: desc, author:author, location: location, lat: lat, lng: lng};
            // Create a new campground and save to DB
            Campground.create(newCampground, function(err, newlyCreated){
                if(err){
                    console.log(err);
                } else {
                    //redirect back to campgrounds page
                    res.redirect("/campgrounds/"+newlyCreated.id);
                }
            });
            });
        });
  });
//NEW - show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new",{page: 'campgrounds/new'});
});
//SHOW -show more info about a one campground
router.get("/campgrounds/:id", function (req, res) {
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            req.flash("error","Something went wrong...");
            console.log(err);
        } else { //render a template with that campground+comments
            res.render("campgrounds/show", {
                campground: foundCampground
            });
        }
    });
});

//edit campground route
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, fcampground) {
        res.render("campgrounds/edit", {
            campground: fcampground
        });
    });
});
//update campground route
// UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership,upload.single('image'), function(req, res){
    // geocoder.geocode(req.body.location, function (err, data) { // enable google billing acc first
    //   if (err || !data.length) { console.log(err);  
    //     req.flash('error', 'Invalid address');
    //     return res.redirect('back'); }
    // //   req.body.campground.lat = data[0].latitude;
    // //   req.body.campground.lng = data[0].longitude;
    // //   req.body.campground.location = data[0].formattedAddress;
      Campground.findById(req.params.id,async function(err, campground){
          if(err) {req.flash("error", err.message);res.redirect("back");} 
          else {
                if (req.file) 
                {   try {
                            await cloudinary.v2.uploader.destroy(campground.imageId);
                            var result = await cloudinary.v2.uploader.upload(req.file.path,{folder:"yelpcamp/campgrounds/"});
                            campground.imageId = result.public_id;
                            campground.image = result.secure_url;
                        } catch(err) {
                            req.flash("error", err.message);
                            return res.redirect("back");
                        }
                }
                    campground.name=req.body.campground.name;
                    campground.price=req.body.campground.price;
                    campground.description=req.body.campground.description;
                    campground.save();
                    req.flash("success","Successfully Updated!");
                    res.redirect("/campgrounds/" + campground._id);
            }
      });
    // });
  });
//Destroy campground route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id,async function (err, campground) {
        if(err){req.flash("error","Something went wrong..."); return res.redirect("back");}
        else{
            try {
                await cloudinary.v2.uploader.destroy(campground.imageId);
                Comment.deleteMany({_id: {$in: campground.comments} }, (err) => {
                    if (err) {req.flash("error","Something went wrong...");  console.log(err);}
                    else{res.redirect("/campgrounds");}
                 });
                campground.remove();
                req.flash("success","Campground deleted.");
                
                } 
            catch(err){
                    if(err) 
                    {
                        req.flash("error", err.message);
                        return res.redirect("back");
                    }
                }
        }
    });
});
//helpfull function 
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
