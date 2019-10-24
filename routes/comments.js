const express = require("express"),
    router = express.Router();
//    router = express.Router({mergeParams:true});
const Campground = require("../models/campground"),
    Comment = require("../models/comment");
    const middleware=require("../middleware"); //automate include index(only in that περιπτωση)

//Comments new
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {
                campground: campground
            });
        }
    });

});
//Comments Create & Save
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function (req, res) {
    /*
        >find campground by id -> create new comment 
        ->connect new comment to campground ->redirect to campground show page
    */
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error","Something went wrong...");
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Comment added successfully.");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });

});
//Comment Update route
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            req.flash("error","Something went wrong...");
            res.redirect("back");
        } else {
            req.flash("success","Comment updated successfully.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//Comment Destroy route
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err, campgroundRemoved) {
        if (err) {
            req.flash("error","Something went wrong...");
            res.redirect("back");
        } else {
            req.flash("success","Comment deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;
