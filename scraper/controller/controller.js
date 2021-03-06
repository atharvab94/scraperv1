var express = require("express");
var router = express.Router();
var path = require("path");
var mongoose = require("mongoose");

var request = require("request");
var cheerio = require("cheerio");





    Article.find().sort({_id: -1})

        .populate("comment")

        .exec(function(err, doc){
            if (err){
                console.log(err);
            }
            else {
                var hbsObject = {articles: doc};
                res.render("index", hbsObject);
            }
        });

});


router.get("/scrape", function(req, res) {

    request("https://www.buzzfeed.com/news", function(error, response, html) {

        var $ = cheerio.load(html);

        var titlesArray = [];

        $("article h2").each(function(i, element) {

            var result = {};

            result.title = $(this).children("a").children("h2").text().trim() + ""; 
            result.link = "https://www.buzzfeed.com/news" + $(this).children("header").children("h2").children("a").attr("href").trim();

            result.summary = $(this).children("div").text().trim() + ""; 


            if(result.title !== "" &&  result.summary !== ""){

                if(titlesArray.indexOf(result.title) === -1){

                    titlesArray.push(result.title);

                    Article.count({ title: result.title}, function (err, test){

                        if(test === 0){

                            var entry = new Article (result);

                            entry.save(function(err, doc) {
                                                                                       
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    console.log(doc);
                                }
                            });

                        }
                        else{
                            console.log("Redundant Database Content. Not saved to DB.")
                        }

                    });
                }
                else{
                    console.log("Redundant FML Content. Not Saved to DB.")
                }

            }
            else{
                console.log("Empty Content. Not Saved to DB.")
            }

        });

        res.redirect("/articles");

    });

});


router.post("/add/comment/:id", function (req, res){

    var articleId = req.params.id;

    var commentAuthor = req.body.name;

    var commentContent = req.body.comment;

    var result = {
        author: commentAuthor,
        content: commentContent
    };

    var entry = new Comment (result);

    entry.save(function(err, doc) {
        if (err) {
            console.log(err);
        }
        else {
            Article.findOneAndUpdate({"_id": articleId}, {$push: {"comments":doc._id}}, {new: true})
                .exec(function(err, doc){
                    if (err){
                        console.log(err);
                    } else {
                        res.sendStatus(200);
                    }
                });
        }
    });

});





router.post("/remove/comment/:id", function (req, res){

    var commentId = req.params.id;

    Comment.findByIdAndRemove(commentId, function (err, todo) {

        if (err) {
            console.log(err);
        }
        else {
            res.sendStatus(200);
        }

    });

});


module.exports = router;