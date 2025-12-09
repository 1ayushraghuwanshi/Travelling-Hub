if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express=require("express");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const Localstrategy=require("passport-local");
const app=express();
const path=require("path");
const mongoose=require("mongoose");

const { listingSchema, reviewSchema} = require("./schema.js");

const ejsMate = require("ejs-mate");

const Listing = require("./models/listing.js")

const Review = require("./models/review.js")


const User = require("./models/user.js");

 app.use(express.urlencoded({ extended:true }));

app.use(express.static(path.join(__dirname,"/public")))
 
const methodOverride=require("method-override");

const WrapAsync = require("./utils/wrapAsync.js")

const ExpressError = require("./utils/ExpressError.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");

const userRouter = require("./routes/user.js");



const dbUrl = process.env.ATLASDB_URL;


main().then((res)=>{

    console.log("connection successful")
}).catch((err)=>{
    console.log(err);
})

async function main() {

  await mongoose.connect(dbUrl);

 
}


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in Mongo Session Store", err);
})


const sessionoptions={
 store,
 secret: process.env.SECRET,
 resave:false,
 saveUninitialized:true,
 cookie:{
     expires:Date.now() + 7*24*60*60*1000,
     maxAge: 7*24*60*60*1000,
     httpOnly: true
 }

};


app.use(session(sessionoptions));

app.use(flash());

// for login and sign up
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Localstrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.get("/demouser",async(req,res)=>{
    const fakeuser =new User({
        email:"abc@gmail.com",
        username:"abc"
    });
    let registeruser=await User.register(fakeuser,"helloworld");
    res.send(registeruser);
})



app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));

app.engine("ejs",ejsMate);


app.use("/",listingsRouter);

app.use("/listings/:id/reviews",reviewsRouter);

app.use("/",userRouter);


app.get("/",(req,res)=>{
    
    res.send("Root is working");
})

// error Handling
app.all(/(.*)/,(req,res,next)=>{
    next(new  ExpressError(404,"page not found"));
})


// middleware
app.use((err, req, res, next)=>{
    let {status=500,message="Something went wrong"} = err;
     res.status(status).render("error.ejs",{message});
     
})



app.listen(8080,()=>{
    console.log("Server is connected");
})