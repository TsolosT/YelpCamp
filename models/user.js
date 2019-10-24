const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: {type:String,unique:true,required:true},
    password: String,
    firstName: String,
    lastName: String,
    email: {type:String,unique:true,required:true},
    resetPasswordExpires: Date,
    resetPasswordToken:String,
    avatarId:String,
    avatar: {type: String,default:process.env.DEFAULT_AVATAR_USER_URL},
    description: String,
    isAdmin:{type:Boolean,default:false}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
