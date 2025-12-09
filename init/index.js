const mongoose=require("mongoose");
const Listing=require("../models/listing.js");

const initData=require("./data.js");


main().then((res)=>{
    console.log("connection established")
}).catch((err)=>{
    console.log(err);
})

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');



}


// create an Asynchronous function

const initDB = async () =>{
     await Listing.deleteMany({});
     initData.data=initData.data.map((obj)=>({
      ...obj,owner:'68cbb2af2f133fff965a8ea4'
     }))





// create an Asynchronous function

     Listing.insertMany(initData.data);
     console.log("data is initilized");

}


initDB();