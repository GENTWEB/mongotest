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

<<<<<<< Updated upstream
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, {useNewURLPArser: true});
=======
// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/NprArts", { useNewUrlParser: true });

//Function for checking db for articles that have been scraped
app.get('/', function (req, res) {
    res.render('index');
  });
// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.npr.org/sections/arts/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log("no new articles");
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
        res.send("scrape complete");
    });
=======
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

app.get('/articles', function (req, res, next) {
  db.Article.find(function (err, article) {
    if (err) return res.sendStatus(500);
    res.render('articles', {  article : article });
  });
>>>>>>> Stashed changes
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