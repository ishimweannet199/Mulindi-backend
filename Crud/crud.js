import express from 'express'
import mongoose from 'mongoose'
import User from '../user.controller'

const Router = express.Router();

Router.post('/', async (req , res)=>{
    try{
        const user = await user.create(req.body);
        res.status(201).json(user);
    }catch(err){
        res.status(400).json({message: Err . occur });
    }
});
Router.get('/', async(req , res)=>{
    const user = await user.find();
    res.json(users);
});
Router.get('/.id', async(req ,res)=>{
    try{
        const user = await user.findById(req.params.id)
    }catch(err){
        res.status(404).json({message: 'user not found'})
    }
})