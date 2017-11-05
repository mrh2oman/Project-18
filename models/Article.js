const mongoose = require("mongoose"),
    Schema = mongoose.Schema,

 ArticleSchema = new Schema({

    title: {
        type: String,
        required: true,
        unique: true
    },

    summary: {
        type: String,
        required: true
    },

    saved: {
        type: Boolean,
        required: true,
        default: false
    },

    deleted: {
        type: Boolean,
        required: true,
        default: false
    },

    link: {
        type: String,
        required: true
    },

    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;