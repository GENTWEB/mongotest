var mongoose = require("mongoose");
var schema = mongoose.schema;
vare noteschema = new schema({
    title: String,
    body: String
});
var note = mongoose.model("note", noteschema);
module.exports = note;