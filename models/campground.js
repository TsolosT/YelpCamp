const mongoose = require("mongoose");

const Comment = require('./comment');

const campgroundSchema = new mongoose.Schema({
    name: String,
    price: {type:String,default:"0.01"},
    image: String,
    imageId: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    createdAt:{type:Date,default:Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
////remove campground's comments after deleting the campground with node v8>
//campgroundSchema.pre('remove', async function () {
//    await Comment.remove({
//        _id: {
//            $in: this.comments
//        }
//    });
//});
//or this in routes/campground

module.exports = mongoose.model("Campground", campgroundSchema);
