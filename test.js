import express from "express";
import Users from "./model/user";

const Router = express.Router();

Router.post("/register",async(req,res)=>{
    try{
        const{name,email}= req.body();
        const existingUser= await Users.findOne({email})
        if(existingUser){
            return res.status(400).json({massage:"User already existed"})
        }
    }

})