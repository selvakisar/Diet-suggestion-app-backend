import  express  from "express";
import   bcrypt from "bcrypt"; 
import nodemailer from "nodemailer";
import {User,generateToken} from "../models/usersM.js"
const router=express.Router();
const {EMAIL_ID,EMAIL_PASSWORD}=process.env

// create user
router.post("/signup",async (req, res)=>{
   

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





router.post("/forgetpass",async(req,res)=>{
    try {
        const {email}=req.body;

        const user = await User.findOne({email})
        if(!user){
            res.status(404).json({message:"User not found"})
        }

        const resetToken = Math.random().toString(36).substring(2,5);

        const resetLink =
        `https://654d29dd9cf0020008b774b6--melodic-marigold-b38d5e.netlify.app/${resetToken}`;

        user.resetToken=resetToken;

        const updatepassword = await User.findByIdAndUpdate(user._id,user);
        if(updatepassword){
            res.status(201).json({message:"  To update password  link sent to your email",resetToken,resetLink})
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.zoho.com",
             port: 465, 
             secure: true, // use SSL auth: { user: youremail@yourdomain.com, pass: yourpassword, }, })
            secure: true, // use SSL
            providerauth:{
                user:"selvamern@zohomail.in",
                pass:"923813114048@Mech",
            }
        })
        const sendMail=async () =>{
            const info = await transporter.sendMail({
                from:"selvamern@zohomail.in",
                to:user.email,
                subject:"reset password",
                text:resetLink
            })
            console.log(`Mail successfully sent${info.messageId}`)
        }
        sendMail().catch(console.error)
    } catch (error) {
        console.log(error);
        res.status(500).send({ error:"Internal Server Error"});
    }
})



//Route for reset password
router.post("/resetpass/:token",async(req,res)=>{
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






// module.exports.resetPassword = async (req, res) => {
//     const { email } = req.body;
//     const user = await UserModel.findOne({ email })
//     if (!user) {
//         res.status(404).json({ Message: "User not exist" })
//     }
//     const randomString =
//         Math.random().toString(36).substring(2, 15) +
//         Math.random().toString(36).substring(2, 15);

//     const link = `https://lovely-figolla-4dd39a.netlify.app/passwordreset/${randomString}`;

//     user.resettoken = randomString;
//     const updated = await UserModel.findByIdAndUpdate(user._id, user);
//     if (updated) {
//         res.status(201).json({ Message: "Password reset link send to your mail id, Kindly check" })
//     }
//     //send an email to reset/particular user   

//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: Email_Id,
//             pass: Email_Pass
//         }
//     });

//     const sendMail = async () => {
//         const info = await transporter.sendMail({
//             from: `"username " <${Email_Id}>`,
//             to: user.email,
//             subject: "Reset Password",
//             text: link
//         });
//         console.log(`Mail set to ${info.messageId}`);
//     };

//     sendMail().catch(console.error);
// }


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





// forgot password
// router.post("/forgetpass",async(req, res)=>{
//     try {
//         find by email 
//         const user=await User.findOne({email:req.body.email});
//         if(!user)
//         {
//             return res.status(404).send({error:"User not Exists"})
//         }

//         gen Token 
//         const resetToken =Math.random().toString(36).slice(2);
//         Store the reset Token
//         user.resetToken=resetToken;
//         await user.save();

//         res.status(200).send({message:"reset Token saved successfully",resetToken})

//         sending link by email

//         const transporter=nodemailer.createTransport({
//             service:"gmail",
          
//             auth:{
//                 user:EMAIL_ID,
//                 password:EMAIL_PASSWORD,

//             }
           
//         })
//         verify connection configuration
//         transporter.verify(function (error, success) {
//         if (error) {
//         console.log(error);
//         } else {
//         console.log(success + "Server is ready to take our messages");
//         }
//         });
  
//         const resetLink =
//          `https://654d29dd9cf0020008b774b6--melodic-marigold-b38d5e.netlify.app/?token=${resetToken}`;
        
//          const mailOptions ={
//             from :EMAIL_ID,
//             to:user.email,
//             subject:"password reset" ,
//             text:`Click the link for your password reset: ${resetLink}`,
//         };

//         transporter.sendMail(mailOptions, function (error,info) {
//             if(error){
//                 console.log("Error sending email:",error);
//                 return res.status(500).send({error:"failed to send mail"})
//             }
//             console.log("email sent:",info.response);
//             res.status(200).send({message:"password reset email sent successfully"})
//         })
//     } 
//     catch (error) {
//         console.log(error);
//         res.status(500).send({ error:"Internal Server Error"});
//     }
// })

