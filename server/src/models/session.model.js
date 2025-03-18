import mongoose from "mongoose";
import { CHALLENGE_SCORE, SESSION_STATUS } from "../constants/type.constant.js";

const sessionSchema=new mongoose.Schema({
    title:{type:String, required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId, required:true},
    project:{type:mongoose.Schema.Types.ObjectId,ref:'project',required:true},
    status:{type:String,enum:SESSION_STATUS,default:'inactive'},
    timetaken:{type:Number},
    score:{type:String,enum:CHALLENGE_SCORE},
    code:{type:Object},
    createdAt:{type:Date,default:Date.now}
})

const sessionModel=new mongoose.model('session',sessionSchema)
export default sessionModel