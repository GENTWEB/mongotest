var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
const onion= "https://sports.theonion.com/"
const PORT = 3000;
var app = express();

app.use(express.urlencoded({ extended: true}));
//tell express to parse body with json:
app.use(express.json());
//tell express to use public a default
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, {useNewURLPArser: true});

app.get("/scrape", function(req,res) {
    axios.get(onion).then(function(response){
        var $ = cheerio.load(response.data);
        $("h3").each(function(i, element){
            var result = {};
            result.title=$(this)
                .children("a")
                .attr("href");
            db.article.create(result)
                .then(function(dbarticle){
                    console.log(dbarticle);
                })
                .catch(function(err) {
                    console.log(err);
                });
        });
        res.send("scrape complete");
    });
});
app.get("/articles/:id", function(req, res){
    db.article.finOne({_id: req.params.id})
    .populate("note")
    .then(function(dbarticle){
        res.json(dbarticle);
    })
    .catch(function(err){
        res.json(err)
    });
});
app.post("/article/:id", function(req, res){

    db.note.create(req.body)
    .then(function(dbnote){

        db.article.findOneAndUpdate({ _id: req.params.id}, {note: dbnote._id}, {new: true});
    })
    .then(function(dbarticle){
        res.json(dbarticle);
    })
    .catch(function(err){
        res.json(err);
    });
});
app.listen(PORT, function() {
    console.log("listening on port: " + PORT)
});