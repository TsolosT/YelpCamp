
# Description
Web App: YelpCamp. <br>
YelpCamp is a Node.js web application with RESTful routing project from the Udemy course - The Web Developer Bootcamp by Colt Steele.<br>

# Live Demo
To see the app in action, go to <a href="https://yelpcamp-tsol.herokuapp.com/">Yelp Camp Demo</a> . <br>

Login username: Potato <br>
Login password: guest123 <br>

## Installation & Dependencies :
* Clone project
* Just install if you done have <a href="https://nodejs.org/en/">node.js</a> ->
```
npm install --save 
```
* Check packages from package.json ->section: "dependencies" {}

# Features
<hr>

## Authentication:
* User signup with username, password and invitation code.<br>
* User login with username and password.<br>
* Admin login with admin username and password.<br>
* User can reset his password. <br>

## Authorization:
* User cannot create new posts or view user profile without being authenticated.<br>
* User cannot edit or delete existing posts and comments created by other users.<br>
* Admin can manage all posts and comments.<br>

## Functionalities of campground posts and comments:

* Create, view, edit and delete posts and comments.<br>
* Upload campground photos from local.<br>
* Display campground location on Google Maps.<br>
* Search any campground.<br>
* Flash messages responding to users’ interaction with the app.<br>

## Custom Enhancements:
* Added User Profile  with information and all uploaded campgrounds from the  user.<br>
* Added Feature to edit user profile.<br>
* Embedded comment show page in single campground show page to look more user friendly.<br>
* Used Google Fonts and Font Awesome instead default fonts.<br>
* Used momentJS to show post and comment creation and update timestamp.<br>
* Responsive web design.<br>

# Built with :

## Front-end :
<a href="https://fonts.google.com/"> Google Fonts</a><br>
<a href="https://fontawesome.com/?from=io">Font Awesome </a><br>
<a href="https://getbootstrap.com/">Bootstrap 4 </a><br>
## Back-end:
<a href="https://www.npmjs.com/package/express">express</a><br>
<a href="http://mongodb.com/">mongoDB</a><br>
<a href="https://www.npmjs.com/package/mongoose">mongoose</a><br>
<a href="https://www.npmjs.com/package/ejs">ejs</a><br>
<a href="https://www.npmjs.com/package/passport"> passport</a><br>
<a href="https://www.npmjs.com/package/passport-local"> passport-local</a><br>
<a href="https://www.npmjs.com/package/passport-local-mongoose">passport-local-mongoose </a><br>
<a href="https://www.npmjs.com/package/body-parser"> body-parser</a><br>
<a href="https://www.npmjs.com/package/express-session"> express-session</a><br>
<a href="https://www.npmjs.com/package/method-override"> method-override</a><br>
<a href="https://www.npmjs.com/package/moment">moment </a><br>
<a href="https://www.npmjs.com/package/connect-flash">connect-flash </a><br>
<a href="https://www.npmjs.com/package/node-geocoder">node-geocoder</a><br>
<a href="https://www.npmjs.com/package/dotenv">dotenv </a><br>
<a href="https://cloudinary.com/">cloudinary </a><br>
<a href="https://www.npmjs.com/package/multer"> multer</a><br>
<a href="https://developers.google.com"> Google Maps APIs</a><br>
## Deployment:
<a href="https://www.heroku.com"> Heroku</a><br>
