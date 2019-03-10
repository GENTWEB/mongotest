var mongoose = require("mongoose");
var schema = mongoose.schema;
var  articleschema = new schema({
    title: {

        type: String,
        require: true
    },
    link: {
        type: String,
        requires: true
    },
    note: {
        type: schema.Types.ObjectID,
        ref: "note"
    }
});
var article = mongoose.model("article", articleschema);
module.exports = article;