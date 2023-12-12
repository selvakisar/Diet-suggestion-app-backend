import mongoose from "mongoose";

const bmiSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  bmiInfo: {
    type: String,
    required: true,
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
}
});

const Bmi = mongoose.model("bmis", bmiSchema);

export {Bmi}