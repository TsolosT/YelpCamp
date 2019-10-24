//refactor it
#Description
Web App: YelpCamp.
1 minute read.
YelpCamp is a Node.js web application with RESTful routing project from the Udemy course - The Web Developer Bootcamp by Colt Steele

#Live Demo
To see the app in action, go to Yelp Camp Demo .

Login username: Guest1
Login password: abc123

#Features

##Authentication:

*User signup with username, password and invitation code.
*User login with username and password.
*Admin login with admin username and password.

##Authorization:

*One cannot create new posts or view user profile without being authenticated.
*One cannot edit or delete existing posts and comments created by other users.
*Admin can manage all posts and comments.

##Functionalities of campground posts and comments:

*Create, view, edit and delete posts and comments.
*Upload campground photos from local.
*Display campground location on Google Maps.
*Search any campground.
*Flash messages responding to users’ interaction with the app.

##Responsive web design

##Custom Enhancements:
*Added User Profile  with information and all uploaded campgrounds from the  user.
*Added Feature to edit user profile.
*Embedded comment show page in single campground show page to look more user friendly.
*Used Google Fonts and Font Awesome instead default fonts.
*Used momentJS to show post and comment creation and update timestamp.





##Built with :

#Front-end :
Google Fonts
Font Awesome
Bootstrap 4

#Back-end:
express
mongoDB
mongoose
ejs
passport
passport-local
passport-local-mongoose
body-parser
express-session
method-override
moment
connect-flash
node-geocoder
dotenv
cloudinary
multer
Google Maps APIs

##Deployment:
Heroku