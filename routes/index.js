const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      User = require("../models/user"),
      Campground=require("../models/campground"),
      async =require("async"),
      nodemailer=require("nodemailer"),
      crypto=require("crypto");
const middleware=require("../middleware");
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

//register route
router.get("/register", function (req, res) {
    res.render("users/register",{page: 'register'});
});
//sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email
    }); //add avatar
    //Check if is new admin
    if(req.body.invitationCode===process.env.YELPCAMP_ADMIN_CODE){
        newUser.isAdmin=true;
    }
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error",err.message);
            res.redirect("back");
        } else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success","Welcome to YelpCamp "+user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

//login route
router.get("/login", function (req, res) {
    res.render("users/login",{page: 'login'});
});
//login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash:"Invalid username or password.",
    successFlash:"Welcome to YelpCamp."
}), function (req, res) {});
//logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success","You successfully logged out,See you later!");
    res.redirect("/campgrounds");
});
//forgot  password
router.get("/forgot",function(req,res){
    res.render("users/forgot");
});
router.post("/forgot",function(req,res){
    async.waterfall([
        function(done){
            crypto.randomBytes(20,function(err,buf){
                var token=buf.toString("hex");
                done(err,token);
            });
        },function(token,done){
            User.findOne({email:req.body.email},function(err,user){
                if(!user){
                    req.flash("error","No account with that email address exists.");
                    return res.redirect("/forgot");
                }
                else{
                    user.resetPasswordToken=token;
                    user.resetPasswordExpires=Date.now()+3600000;//1hour
                    user.save(function(err){
                        done(err,token,user);
                    });
                }
            });
        },function(token,user,done){
            var smtpTransport=nodemailer.createTransport({
                service:'Gmail',
                auth:{ user:process.env.MAIL,pass:process.env.GMAILPW}
            });
            var mailOptions={
                to: user.email,
                from: process.env.MAIL,
                subject: 'YelpCamp Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions,function(err){
                console.log('mail sent');
                req.flash("success",'An e-mail has been sent to '+user.mail+' with further instrunctions.');
                done(err,'done');
            });
        }
    ],function(err)
        {
            if(err){
                return next();
                res.redirect("/forgot");
            }
        });
    
});
router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('users/reset', {token: req.params.token});
    });
  });

  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'learnwithdevtsol@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'learnwithdevtsol@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/campgrounds');
    });
  });
//user show profile
router.get("/users/:id",function(req,res){
    User.findById(req.params.id,function(err,fuser){
        if(err)
        {
            req.flash("error","Something went wrong...");
            res.redirect("back");
        }
        else
        {   
            Campground.find().where("author.id").equals(fuser._id).exec(function(err,campgrounds){
               if(err){
                req.flash("error","Something went wrong...");
                res.redirect("back");
               }
               else{
                    res.render("users/show",{user:fuser,campgrounds:campgrounds});
               }
            });
        }
    });
});
//user edit profile 
router.get("/users/:id/edit",middleware.checkEditAuth,function(req,res){
  User.findById(req.params.id,function(err,user){
    if(err){
      req.flash("error","Something went wrong...");
      res.redirect("back");
    }
    else{
      res.render("users/edit",{user:user,page:"edit"}); 
    }
  })
  
});
//user update profile
router.put("/users/:id",middleware.checkEditAuth,upload.single('image'),function(req,res){
  User.findById(req.params.id, async function(err,user){
    if(err){req.flash("error", err.message);res.redirect("back");}
    else{
      if(req.file)
      { 
        if(user.avatar!==process.env.DEFAULT_AVATAR_USER_URL)
        {
          try{await cloudinary.v2.uploader.destroy(user.avatarId);}
          catch(err){ req.flash("error", "Something went wrong..."); return res.redirect("back");}
        }
        try{ var result = await cloudinary.v2.uploader.upload(req.file.path,{folder:"yelpcamp/users_avatar/"});
            user.avatarId = result.public_id;
            user.avatar = result.secure_url; }
        catch(err){ req.flash("error", err.message);return res.redirect("back");}
      }
      user.firstName=req.body.firstName;
      user.lastName=req.body.lastName;
      user.email=req.body.email;
      user.description=req.body.description;
      user.save();
      req.flash("success","Successfully Updated!");
      res.redirect("/users/" + user._id);
    }
  });
});


module.exports = router;
