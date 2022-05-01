const mongoose = require('mongoose');

//define structure for your application and database that is below mentioned details would be there
//in our application and db, can also be understood as "class"
const CampgroundSchema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
})

//creating model from defined schema or "Object" which would further contain more details 
//with different small objects or instances that will come under this campground object
const Campground = mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;