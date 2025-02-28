import mongoose from "mongoose";

const projectSchema=new mongoose.Schema({
    title:{type:String,required:true},
    skills:[{type:String,required:true}],
     url:{type:String,required:true},
    createdAt:{type:Date,default:Date.now}
})

const projectModel=new mongoose.model('project',projectSchema)
export default projectModel