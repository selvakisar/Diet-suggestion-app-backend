import express from 'express';
import { FoodItem, FoodPlan } from '../models/plan.js';
import { Foods } from '../models/foods.js';

const router =express.Router();
router.get('/:userId',async(req,res)=>{
    try {
        const userId=req.params.userId;
        const foodPlan= await FoodPlan.findOne({user:userId}).populate("items.Foods")
        if(!foodPlan){
            return res.status(404).json({ message: 'food plan not found' });
        }
        res.json(foodPlan)
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
})


// add food to logged user

router.post("/add/:foodId",async(req,res)=>{
    try {
        const loggedInUserId=req.user._id;
        const foodId=req.params.foodId;
        const addedFood = await Foods.findById({ _id : foodId});

        if(!addedFood){
            return res.status(404).json({ message: "Food not found" });
        }

        const newItem = await FoodItem.create({foods:foodId})
        let loggedInUserPlan= await FoodPlan.findOne({user:loggedInUserId})


        if (!loggedInUserPlan) {
            loggedInUserPlan = await FoodPlan.create({ user: loggedInUserId, items: [newItem] });
        } else {
            loggedInUserPlan.items.push(newItem);
        }

        await loggedInUserPlan.save();

        res.status(201).json({ message: "Food added to cart successfully" });

    } catch (error) {
        res.status(400).json({ error: error.message });

    }
})






router.delete('/delete/:itemId',async (req,res)=>{
    try {
        const loggedInUserId = req.user._id; // Get user ID from the authenticated middleware
        const itemId = req.params.itemId;
        
        let loggedInUserPlan = await FoodPlan.findOne({ user: loggedInUserId });

        if(!loggedInUserPlan){
            return res.status(404).json({ message: "User's Plan not found" }) 
        }

        const itemToDeleteIndex = loggedInUserPlan.items.findIndex(item => item._id.toString() === itemId);
        if (itemToDeleteIndex === -1) {
            return res.status(404).json({ message: "food not found in plan" });
        }

        loggedInUserPlan.items.splice(itemToDeleteIndex, 1);

        await loggedInUserPlan.save();

        res.status(200).json({ message: "Food deleted successfully" });
    } catch (error) {
        res.status(200).json({error: error.message});
    }
})

router.get('/user/my-plan', async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Get user ID from the authenticated middleware

        const loggedInUserPlan = await FoodPlan.findOne({ user: loggedInUserId })
            .populate('items.product');

        if (!loggedInUserPlan) {
            return res.status(404).json({ message: "User's plan not found" });
        }

        res.status(200).json(loggedInUserPlan);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



export const planRouter =router
// router.get("/:userId",async (req,res)=>{
//     try {
//         const userId = req.params.user._id
//         const Plan
//     } catch (error) {
        
//     }
// })
// router.post('/plan-add',async(req,res)=>{
//     try {
//         const {foodId,quantity}=req.body;
//         const foods = await Foods.findById(foodId);
//         if(!foods){
//             return res.status(404).json({message: "foods not found"});
//         }

//         const plan=await Plan.findOne({user:req.user._id});

//         if(!plan){
//             const newPlan = new Plan({
//                 user: req.user._id,
//                 foodsplan:[{foods:foodId,quantity}]
//             })
//             await newPlan.save();
//             return res.status(201).json(newPlan)
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// })



// router.get("/plan-view",async (req,res)=>{
//     try {
//         const plan =await Plan.findOne({user:req.user._id}).populate("foodsplan.foodplan")
//         res.json(plan);
//     } catch (error) {
//         res.status(500).json({ message:"internal server error"})
//     }
// })

