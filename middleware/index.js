//imports
const Campground = require("../models/campground"),
      Comment = require("../models/comment");
//All middleware functions goes here
const middlewareObj={};

middlewareObj.checkCampgroundOwnership=function(req, res, next) {
        //is logged?
        if (req.isAuthenticated()) {
            Campground.findById(req.params.id, function (err, fcampground) {
                if (err) {
                    req.flash("error","Campground not found.");
                    res.redirect("back");
                } else {
                    //does user own the campground?
                    if (fcampground.author.id.equals(req.user._id) || req.user.isAdmin) {
                        next();
                    } else {
                        req.flash("error","You don't have permission to do that.");
                        res.redirect("back");
                    }
                }
            });
        } else {
            res.flash("error","You need to be logged to do that.");
            res.redirect("back");
        }
    
}
middlewareObj.checkCommentwnership=function (req, res, next) {
    //is logged?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, fcomment) {
            if (err) {
                req.flash("error","Comment not found.");
                res.redirect("back");
            } else {
                //does user own the comment?
                if (fcomment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error","You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}
middlewareObj.isLoggedIn=function isLoggedIn(req, res, next) 
{
    if (req.isAuthenticated()) 
    {
        return next();
    } 
    else 
    {
        req.flash("error","You need to be logged in to do that.");
        res.redirect("/login");
    }
}

middlewareObj.checkEditAuth=function checkEditAuth(req,res,next){
    if(req.isAuthenticated())
    {
       if(req.user._id.equals(req.params.id)){
           return next();
       }
       else{
        req.flash("error","You do not have permission to do that.");
        res.redirect("/campgrounds");
       }
    }
    else
    {
        req.flash("error","You need to be logged in to do that.");
        res.redirect("/login");
    }
}
module.exports=middlewareObj;