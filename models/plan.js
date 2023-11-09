import mongoose from 'mongoose';
import { Foods } from './foods';

const foodPlanSchema=new mongoose.Schema({
foodplan:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Foods",
},
quantity:Number,
});

const  PlanSchema = new mongoose.Schema({
    foodsplan:[foodPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
})

const Plan=mongoose.model("plan",PlanSchema)

export {Plan};