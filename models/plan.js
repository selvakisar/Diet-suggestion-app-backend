import mongoose from 'mongoose';

const FoodItemSchema=new mongoose.Schema({
Foods:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Foods",
},

});



const FoodItem=mongoose.model("FoodItem",FoodItemSchema)


const FoodPlanSchema=new mongoose.Schema({
    items: {type:Array},
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
})

const FoodPlan = mongoose.model("FoodPlan",FoodPlanSchema) 




export { FoodPlan,FoodItem};
