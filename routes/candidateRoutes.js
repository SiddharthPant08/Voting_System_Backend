const express = require ("express");
const router = express.Router()
const User = require('../models/user');
const Candidate = require('../models/candidate');
const {jwtAuthMiddleware, generateToken}= require('../jwt');


const checkAdminRole = async(userId)=>{
try {
    const user = await User.findById(userId);
    return user.role === "admin";

} catch (error) {
    return false;
}
}

//POST route to add a candidate

router.post('/',jwtAuthMiddleware,async(req,res)=>{
try{
    if(! await checkAdminRole(req.user.id)){
        return res.status(403).json({message:"User doesn't have admin role"});
    }

const data = req.body   

const newCandidate= new Candidate(data);


const response = await newCandidate.save();
console.log('Data Saved');

res.status(200).json({response:response});

}catch(err){

console.log(err);
res.status(500).json({error:"Internal Server Error"});
}
})


router.delete('/profile/candidateID',jwtAuthMiddleware,async(req,res)=>{
    try {
            if(!checkAdminRole(req.user.id)){
        return res.status(403).json({message:"User doesn't have admin role"});
    }
        const candidateId = req.params.candidateID;  //Extract id from the url parameter
        const updatedCandidateData = req.body   //Update data for the person

        const response = await Candidate.findByIdAndUpdate(candidateId,updatedCandidateData,{
            new:true,   //Return the updated document
            runValidators:true   //Run mongoose validation
        })

if(!response){
    return res.status(400).json({error:"Candidate Not Found"});
}

console.log("Candidate Data Updated");
res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal server error"});
    }
})

router.put('/profile/:candidateID',jwtAuthMiddleware,async(req,res)=>{
    try {
            if(!checkAdminRole(req.user.id)){
        return res.status(403).json({message:"User doesn't have admin role"});
    }
        const candidateId = req.params.candidateID;  //Extract id from the url parameter
       

        const response = await Candidate.findByIdAndDelete(candidateId);
          

if(!response){
    return res.status(400).json({error:"Candidate Not Found"});
}

console.log("Candidate Deleted");
res.status(200).json(response)
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal server error"});
    }
})

router.get('/vote/count', async(req,res)=>{
    try {

        const candidates = await Candidate.find()
            .sort({ voteCount: -1 });

        const voteRecord = candidates.map((data)=>({
            party: data.party,
            count: data.voteCount
        }));

        return res.status(200).json(voteRecord);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:"Internal server error"
        });
    }
});


//Lets start voting
router.post("/vote/:candidateID",jwtAuthMiddleware,async(req,res)=>{
    //no admin can vote
    //user can only vote once

   const candidateID = req.params.candidateID;
    const userId = req.user.id;

    try {
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
            return res.status(404).json({message:"Candidate not found"});

        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message:"user not found"});
        }

        if(user.isVoted){
           return res.status(400).json({message:"you have already voted"});
        }

        if(user.role == "admin"){
           return res.status(403).json({message:"admin is not allowed to vote"});
        }

        candidate.votes.push({user:userId})
        candidate.voteCount++;

        await candidate.save();

        //update the user document
        user.isVoted = true;
        await user.save();

        res.status(200).json({message:"vote recorded successfully"})


    } catch (error) {
         console.log(error);
        res.status(500).json({error:"Internal server error"});
    }
})

router.get('/', async(req,res)=>{
    try {
        //List of candidates
        const candidates = await Candidate.find();
        res.status(200).json(candidates)

    } catch (error) {
       console.log(error);
        res.status(500).json({error:"Internal server error"});
    }
})



module.exports = router