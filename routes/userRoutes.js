const express = require ("express");
const router = express.Router()
const User = require('../models/user');
const {jwtAuthMiddleware, generateToken}= require('../jwt');



//POST route to add person

router.post('/signup',async(req,res)=>{
try{
const data = req.body   

const newUser = new User(data);


const response = await newUser.save();
console.log('Data Saved');

const payload = {
    id:response.id
}
console.log(JSON.stringify(payload));
const token = generateToken(payload);
console.log("Token is :", token);

res.status(200).json({response:response, token:token});

}catch(err){

console.log(err);
res.status(500).json({error:"Internal Server Error"});
}
})

//Login Route

router.post('/login',async(req,res)=>{
    try {
        //Extract AdhaarCard Number and password from request body
        const {adhaarCardNumber , password} = req.body;

        //Find the user by adhaar
        const user = await User.findOne({adhaarCardNumber:adhaarCardNumber});

        //If user does not exist or password does not match, return error
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error:"Invalid username or password"});

        }

        const payload = {
            id:user.id
        }

        const token = generateToken(payload);

    } catch (error) {
        console.log(err);
        res.status(500).json({error:"Internal Server Error"});
    }
})

// Profile Route

router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        const userId = userData.id;

        const user = await User.findById(userId);

        res.status(200).json({ user });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});




router.put('/profile/password',jwtAuthMiddleware,async(req,res)=>{
    try {
        const userId = req.user.id;         //Extract the id from the token

        const {currentPassword, newPassword}     = req.body //extract the new and current pass from req.body

        //Find the user by userId
        const user = await User.findById(userId);

        //if pass doesnt match
           if(!user || !(await user.comparePassword(currentPassword))){
            return res.status(401).json({error:"Invalid username or password"});

        }

        //Update user's password

        user.password = newPassword;
        await user.save();


        console.log("password updated");
        res.status(200).json({message:"Password Updated"});

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal server error"});
    }
})






module.exports = router