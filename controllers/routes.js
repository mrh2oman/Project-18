var express = require('express'),
request = require('request'),
cheerio = require('cheerio'),
db = require("../models"),
Article = require('../models/Article');
router = express.Router(),


router.get('/', function(req, res, next) {
    res.render('home', { layout: false });
});

router.get('/scrape', function(req, res, next) {
    request('https://www.gizmodo.com', function(error, response, html) {
        let $ = cheerio.load(html);
        let results = [];
        $("div.post-wrapper").each(function(i, element) {
            let title = $(element).children().find("h1").text();
            let link = $(element).children().find("a").attr("href");
            let summary = $(element).children().find("p").text();
            result = {};
            if (link !== undefined && link.includes('http') && title !== '') {
                result = {
                    title: title,
                    link: link,
                    summary: summary
                };
                let newArticle = new Article(result);
                newArticle.save(function(err, entry) {
                });
            }
        });
        next();
    });
}, function(req, res) {
    res.redirect('/');
});

router.get("/articles", function(req, res) {
    db.Article
        .find({})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

router.get('/saved', function(req, res) {
    db.Article
        .find({})
        .where('saved').equals(true)
        .where('deleted').equals(false)
        .populate('notes')
        .exec(function(error, entries) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(entries);
            }
        });
});

router.get("/articles/:id", function(req, res) {
    db.Article
        .findOne({
            _id: req.params.id
        })
        .populate("note")
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

router.post("/articles/:id", function(req, res) {
    db.Note
        .create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                note: dbNote._id
            }, {
                new: true
            });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

router.post("/saved/:id", function(req, res) {
    db.Article.findOneAndUpdate({
            "_id": req.params.id
        }, {
            "saved": true
        }, {
            new: true
        })
        .then(function(error, saved) {
            if (error) {
                console.log(error);
            } else {
                res.send(saved);
            }
        });
});

router.post("/delete/:id", function(req, res) {
    db.Article.findOneAndUpdate({
            "_id": req.params.id
        }, {
            "saved": false
        }, {
            new: true
        })
        .then(function(err, deleted) {
            res.redirect("/saved");
            if (err) {
                console.log(err);
            } else {
                res.send(deleted);
            }
        });
});

module.exports = router;