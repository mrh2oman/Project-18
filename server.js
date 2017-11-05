var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var methodOverride = require('method-override');

mongoose.Promise = Promise;

const PORT = process.env.PORT || 5000;
let app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride('_method'));
app.use(require('./controllers/routes'));


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://heroku_7wgdhjt4:pqmarj5808fr31ku43e4kam2j4@ds239965.mlab.com:39965/heroku_7wgdhjt4";
mongoose.connect(MONGODB_URI, {
    useMongoClient: true
});

var database = mongoose.connection;

database.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

database.once("open", function() {
    console.log("Mongoose connected successfully.");
});

app.listen(PORT);
console.log("Listening on port: " + PORT);

