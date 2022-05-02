const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const {campgroundSchema} = require('./schemas.js')

const { ppid } = require('process');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("db connected");
});

const app = express();

//For creating templates we will be using ejs express templating
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));//use to post data on server so treat incoming request with data as string or array
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//home route
app.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});//find all camps
    res.render('campgrounds/index', { campgrounds });
})

// app.get('/makecampground', async (req, res) => {
//     const camp = new Campground({title: 'Backyard', description: 'damnn'});
//     await camp.save();
//     res.send(camp);
// })

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});//find all camps
    res.render('campgrounds/index', { campgrounds });
}))

app.get('/campgrounds/new', (req, res) => {//first we need form to fill details for
    //creating a new camp
    res.render('campgrounds/new');
})


app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {//create new camp by passing form data(req.body)
    //into the campground model which will create new campground
    const campground = new Campground(req.body.campground);//idk why we used campground here :((
    await campground.save();//save campground
    console.log(campground);//redirect to show newly created campground
    res.redirect(`/campgrounds/${campground._id}`);//camp._id coming from req.body added in DB
}))


app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);//pass id 
    res.render('campgrounds/show', { campground })
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);//pass id 
    res.render('campgrounds/edit', { campground });
}))

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
    // res.send("WORKS...")
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
} )

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
}) 

//check if app is working
app.listen(8000, () => {
    console.log('App is Listening');
})