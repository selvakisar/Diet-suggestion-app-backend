
import express from "express";
import { Bmi } from "../models/Bmi.js";

const router = express.Router();


// Get user specific BMI details
router.get("/item/:id", async (req, res) => {
    try {
        const getBmi= await Bmi.find( {userId: req.params.id} )
        if(!getBmi){
          return res.status(400).json({ message: "bmi detail not found"})
        }
        res.status(200).send({ message: "Bmi detail deleted successfully", data: getBmi})
      } catch (error) {
        console.log(error);
        res.status(500).send({ error: "error on  server" });
      }
});

//  Add BMI detail
router.post("/add", async (req, res) => {
  try {
    const bmi = await new Bmi({ ...req.body }).save();

    if (!bmi) {
      return res.status(400).json({ message: "Error in adding bmi" });
    }
    res.status(200).send({ message: "Bmi detail added successfully", data: bmi });
  } catch (error) {
    // error handle
    console.log(error);
    res.status(500).send({ error: "error on  server" });
  }
});

// Delete BMI detail
router.delete("/del/:id", async (req, res) => {
  try {
    const deleteBmi= await Bmi.findByIdAndDelete({_id:req.params.id})
    if(!deleteBmi){
      return res.status(400).json({ message: "bmi detail not found"})
    }
    res.status(200).send({ message: "Bmi detail deleted successfully"})
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "error on  server" });
  }
});
export const bmiRouter =router;

















