const mongoose=require("mongoose");

const Review=require("./review.js")

const{Schema}=mongoose;

const listingSchema = new mongoose.Schema(
    {

        title:{
            type:String,
            required:true,

        },
        description:String,
        image:{
     
        //   default:
        //     "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",

        url:String,
        filename:String
   
        },
        price:Number,
        location:String,
        country:String,

        reviews:[
         
            {
           type: Schema.Types.ObjectId,
            ref:"Review",


            }


        ],
     
        owner:{
             type: Schema.Types.ObjectId,
            ref:"User",
        }


        
    }
)

// Create an post middleware for deleting all review of listing when we dlet an list
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}})
    }
})


const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;