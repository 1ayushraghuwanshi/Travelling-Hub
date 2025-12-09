const Listing = require("../models/listing.js");

const Review = require("../models/review.js")

const {reviewSchema} = require("../schema.js");

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{ allListings });
}

module.exports.renderNewForm = (req,res)=>{
   console.log(req.user);
   
    //  console.log("Working");
     res.render("listings/new.ejs");
    }

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
  
    let listing =  await Listing.findById(id).populate({
        path:"reviews",

        populate: {
            path:"author",

        }}).populate("owner");
    if( !listing){
        req.flash("error","The listing you requested is not found");
        res.redirect("/listings");

    }
 
     res.render("listings/show.ejs", { listing });
    }    


module.exports.createListing = async(req,res,next)=>{
  
     let url = req.file.path;
     let filename = req.file.filename;
     console.log(url, "..", filename )
    // let{title,description,image,price,location,country}=req.body;

    const newListing =  new Listing(req.body.listing)
    newListing.image = {url,filename};
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New listing added ");
//    console.log(res3);
   res.redirect("/listings");

}    


module.exports.renderEditForm = async (req,res)=>{
     let {id}=req.params;
    
    let listing =  await Listing.findById(id);
 if(!listing){
        req.flash("error","The listing you requested is not found");
        res.redirect("/listings");

    }

    // let mainImage = listing.image.url;
    // mainImage = mainImage.replace("/upload", "/upload/h_300,w_250");
}  


module.exports.updateListing = async (req,res)=>{
    
     let {id} = req.params;
    //  console.log(id);
    //  let{title,description,image,price,location,country}=req.body;
   
     let updatelist = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     if(typeof req.file !== "undefined"){
     let url = req.file.path;
     let filename = req.file.filename;
     updatelist.image = { url,filename };

        await updatelist.save();
         
     }
     
     req.flash("success","Listing Updated");
    //console.log(updatelist)//
     res.redirect(`/listings/${id}`);
    }

module.exports.destroyListing = async (req,res)=>{
    let {id}=req.params;
 let deletedlListing =  await Listing.findById(id).populate({
        path:"reviews",

        populate:{path:"author",

        }}).populate("owner");
    if(! deletedlListing){
        req.flash("error","The listing you requested is not found");
        res.redirect("/listings");

    }
    
     res.render("show.ejs",{ allListings });
    }    


module.exports.createListing = async(req,res,next)=>{
  
     let url=req.file.path;
     let filename=req.file.filename;

    // let{title,description,image,price,location,country}=req.body;

    const newlist=  new Listing(req.body.listing);
    newlist.image={url,filename};
    newlist.owner=req.user._id;
await newlist.save();
    req.flash("success","New listing added ");
//    console.log(res3);
   res.redirect("/listings");

}    


module.exports.renderEditForm=async (req,res)=>{
     let {id}=req.params;
    
    let listing =  await Listing.findById(id);
   if(!listing){
        req.flash("error","The listing you requested is not found");
        res.redirect("/listings");

    }
    res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req,res)=>{
    
     let {id}=req.params;
    //  console.log(id);
    //  let{title,description,image,price,location,country}=req.body;
   
     let updatelist = await Listing.findByIdAndUpdate(id, { ...req.body.listing })
     if(typeof req.file !== "undefined"){
     let url=req.file.path;
     let filename=req.file.filename;
     updatelist.image={url,filename};

        await updatelist.save();
         
     }
     
     req.flash("success","Listing Updated");
    //console.log(updatelist)//
     res.redirect("/listings");
    }

module.exports.destroyListing = async (req,res)=>{
    let {id}=req.params;
    let deletedlListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted ");
    res.redirect("/listings");
}