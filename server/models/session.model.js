import mongoose from "mongoose";
import { SESSION_STATUS } from "../constants/type.constant.js";

const sessionSchema=new mongoose.Schema({
    name:{type:String, required:true},
    project:{type:mongoose.Schema.Types.ObjectId,ref:'project',required:true},
    status:{type:String,required:true,enum:SESSION_STATUS,default:'Not Assigned'},
    timetaken:{type:Number},
    score:{type:String},
    createdAt:{type:Date,default:Date.now}
})

const sessionModel=new mongoose.model('session',sessionSchema)
export default sessionModel