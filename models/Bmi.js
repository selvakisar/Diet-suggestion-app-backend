// import mongoose from "mongoose";

// const bmiItemSchema = new mongoose.Schema({
//     bmi:{
//       type:Number,
//     },
//     date: {
//         type: Date, 
//         default: Date.now,
//         get: (date)=> date.toLocaleDateString("sp-MX") // getter
//        },
//         weight:{
//           type:Number,
//           required:true,
//         },
//         height:{
//           type:Number,
//           required:true,
//         },
//         user:{
//             type:mongoose.Schema.Types.ObjectId,
//             ref:"User",
//             required:true
//         }

// })
// bmiItemSchema.pre('save',async function (next){
// if(!this.bmi){
//     const bmi = (weight / Math.pow(height / 100, 2)).toFixed(2)
//     this.bmi= bmi
// }
// next()
// })

// const BmiItem = mongoose.model("BmiItem",bmiItemSchema)


// const BmiDataSchema = new mongoose.Schema({
//     items:[bmiItemSchema],
//     user:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User",
//         required:true
//     }
// })

// const BmiData = mongoose.model("BmiData",BmiDataSchema)

// export {BmiItem,BmiData}