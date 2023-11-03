import  express  from "express";
import   bcrypt from "bcrypt"; 
import nodemailer from "nodemailer";
import {User,generateToken} from "../models/usersM.js"
const router=express.Router();


// create user
router.post("/signup", async (req, res)=>{
   

    try {
         // find user of exsist
         let user = await User.findOne({email: req.body.email});
         if (user){
            return res.status(400).send({error:"email already exists"});
         }
        //  hash the password
        const salt =await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);

        // add the user to the database
        user = await new User({...req.body,password:hashedPassword}).save();
        // generate token and get response 
        const token = generateToken(user._id);
        res.status(201).send({message:"successfully created", token});
    } catch (error) {
        // error handle
        console.log(error);
        res.status(500).send({error:"error creatingon server"});
    }

})

// login user 
router.post("/login",async (req,res)=>{
try {
    // find the user
    const user= await User.findOne({email:req.body.email});

    if(!user){
        return res.status(404).send({error:"invalid email or password"});
    }


    // validate password

const validatePassword = await bcrypt.compare(
    req.body.password,
    user.password
    );
    if(!validatePassword){
        return res.status(404).send({error:"invalid email or password"});
    }

    // genrate token
const token = generateToken(user._id);
res.status(200).send({message:"sucessfully loged in",token})

} catch (error) {
    // error handle
        console.log(error);
        res.status(500).send({error:"error creatingon server"}); 
}
})



// forgot password
router.post("/forgetpass",async(req, res)=>{
    try {
        // find by email 
        const user=await User.findOne({email:req.body.email});
        if(!user)
        {
            return res.status(404).send({error:"User not Exists"})
        }

        // gen Token 
        const resetToken =Math.random().toString(36).slice(2);
        // Store the reset Token
        user.resetToken=resetToken;
        await user.save();

        res.status(200).send({message:"reset Token saved successfully",resetToken})

        // sending link by email

        const transport=nodemailer.createTransport({
            service:"Gmail",auth:{
                user:process.env.EMAIL_ID,
                password:process.env.PASSWORD,

            }
        })
        const resetLink = `http://netlify.app/?token=${resetToken}`;
        const mailOptions ={
            from :process.env.EMAIL_ID,
            to:user.email,
            subject:"password reset" ,
            text:`Click the link for your password reset: ${resetLink}`,
        };

        transport.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log("Error sending email:",error);
                return res.status(500).send({error:"failed to send mail"})
            }
            console.log("email sent:",info.response);
            res.status(200).send({message:"password reset email sent successfully"})
        })
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({ error:"Internal Server Error"});
    }
})


//Route for reset password
router.post("/reset-password/:token",async(req,res)=>{
    try {
        const {token} = req.params;

        // find by token for user
        const user = await User.findOne({resetToken: token});
        if(!user){
            return res.status(404).send({error:"invalid token"})
        }
        if(token!==user.resetToken){
            return res.status(400).json({error:"cant find  token on server"})
        }

        // update password reset token

        const salt=await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(req.body.password,salt);

        user.password = hashedPassword,
        await user.save();
        res.status(200).json({ message: 'Password updated successfully'});
    } catch (error) {
        
        //error handling
        console.log(error);
        res.status(500).send({ error:"Internal Server Error"});
    }

})
export const userRouter= router;



// router.post('/signup', async(req, res) => {
//     const {name,email,password}=req.body;
//     try{  
//         const existingUser=await User.findOne({email})
//         if (existingUser){
//             return res.status(400).json({message:"User already exists"})
//         }
//         // hash password
//         const hashedPassword = await bcrypt.hash(password,10);

//         const newUser=new User({
//             name,email,password:hashedPassword,
//         })
//         // save to database
//         await newUser.save()    
//         res.status(200).json({message:"User saved successfully"})
       
//     } 
//     catch(err) {
//             console.error('error registering user',err);
//             res.status(500).json({message:"An error occurred"})
//     }
// }) ;

