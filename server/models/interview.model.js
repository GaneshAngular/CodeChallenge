import  {Schema, model} from "mongoose";

const interviewSchema=new Schema({
    interviewerId:{type:String, required:true},
    candidateName:{type:String, required:true},
    sessions:[{type:Schema.Types.ObjectId,ref:'session',required:true}],
    status:{type:String,enum:["active","inactive","completed"]},
    createdAt:{type:Date,default:Date.now}
})

const interviewModel=new model('interview',interviewSchema)
export default interviewModel