//this file will only be executed when we have to add new data into DB

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("db connected");
});

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];//passing generated random number as index for passed array
}//that is either descriptor or places array

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 100);
        const price = Math.floor(Math.random()*50);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus soluta maxime praesentium ipsum, sequi vero quos ullam. Saepe similique, ratione ab, sunt qui ipsum veniam at quaerat maiores amet voluptate.",
            price
        })
        console.log(camp);
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});

