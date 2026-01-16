import mongoose from "mongoose";

 export const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://dharmendrabehera680:Dharama123@cluster0.qyzus59.mongodb.net/food-del').then(()=>{
        console.log("DB connected");
    })
}