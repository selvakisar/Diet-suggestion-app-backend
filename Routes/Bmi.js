// import express from 'express';
// import { BmiData } from '../models/Bmi';

// const router =express.Router();

// router.get('/:userId',async(req,res)=>{
//     try {
//         const userId=req.params.userId;
//         const bmiData= await BmiData.findOne({user:userId}).populate("items.bmi")
//         if(!bmiData){
//             return res.status(404).json({ message: 'bmi not found' });
//         }
//         res.json(bmiData)
//     } catch (error) {
//         res.status(500).json({ error: err.message });
//     }
// })

// // router.post('/add/:productId', async (req, res) => {
// //     try {
// //         const loggedInUserId = req.user._id; // Get user ID from the authenticated middleware
// //         const productId   = req.params.productId;
// //         const Quantity = req.body.quantity;

// //         const addedProduct = await Product.findById({ _id : productId});


// //         if (!addedProduct) {
// //             return res.status(404).json({ message: "Product not found" });
// //         }

// //         const newItem = await CartItem.create({ product: productId, quantity: Quantity });


// //         let loggedInUserCart = await Cart.findOne({ user: loggedInUserId });

// //         if (!loggedInUserCart) {
// //             loggedInUserCart = await Cart.create({ user: loggedInUserId, items: [newItem] });
// //         } else {
// //             loggedInUserCart.items.push(newItem);
// //         }

// //         await loggedInUserCart.save();

// //         res.status(201).json({ message: "Item added to cart successfully" });
// //     } catch (err) {
// //         res.status(400).json({ error: err.message });
// //     }
// // });