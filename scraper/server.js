var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
var methodOverride = require("method-override");

var request = require("request");
var cheerio = require("cheerio");

var Comment = require("./models/Comment.js");
var Article = require("./models/Article.js");

mongoose.Promise = Promise;

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));


app.use(express.static("public"));


app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");



db.on("error", function(err) {
    console.log("Mongoose Error: ", err);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
});


var router = require("./controllers/controller.js");
app.use("/", router);


var PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log("App Server Running on port: " + PORT);
});