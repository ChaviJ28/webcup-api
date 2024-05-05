mongoose = require('mongoose');
// ziQd47gzK4KKeSf7
// mongodb+srv://surujbhalichavi:<password>@mapbox-local-test.nrrcqrs.mongodb.net/?retryWrites=true&w=majority
// mongoUrl = "mongodb://localhost:27017/mapbox-test";


// mongoUrl = "mongodb://localhost:27017/webcup";
mongoUrl = "mongodb+srv://admin:admin@webcup.6smvrdh.mongodb.net/"
const options = {
};

mongoose.connect(mongoUrl, options)
    .then(() => console.log("connection successful"))
    .catch(err => console.log(err))

module.exports = mongoose