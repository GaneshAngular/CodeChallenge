import sessionModel from "../models/session.model.js"
import { io } from "../services/socket.io.service.js"





const createSession=async(req,res)=>{
    try {
        const data=req.body
        const session=await  sessionModel.create(data)
        if(!session) return res.status(500).json({message:"Error creating session"})

        return res.status(201).json({message:"Session created",data:session})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server Error"})
    }
}

const getSessions=async(req,res)=>{
    try {
        const sessions=await sessionModel.find({}).populate('project')
        if(sessions.length===0) return res.status(404).json({message:"No sessions found"})
        return res.status(200).json(sessions)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server Error"})
    }
}
const getSession=async (req, res) => {
        try {
             const {id}=req.params
             const session=await sessionModel.findById(id).populate('project')
             
             if(!session) return res.status(404).json({message:"Session not found"})
             return res.status(200).json(session)
        } catch (error) {
            console.log(error)
            return res.status(500).json({message:"Server Error"})
        }
    }


const updateSession=async(req,res)=>{
    try {
        const data=req.body
        const {id}=req.query
        const session=await sessionModel.findByIdAndUpdate(id,data)
        if(!session) return res.status(404).json({message:"Session not found"})

        // const newSession=await sessionModel.findById(id)
        // if(!newSession) return res.status(500).json({message:"Error updating session"})
         
         io.emit('update-interview',"Session updated")
        return res.status(201).json({message:"Session updated",data:session})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server Error"})
    }
}

const deleteSession=async(req,res)=>{
    try {
        const {id}=req.query
        const session=await sessionModel.findByIdAndDelete(id)
        if(!session) return res.status(404).json({message:"Session not found"})

        return res.status(201).json({message:"Session deleted"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server Error"})
    }
}

export {createSession,getSessions,updateSession,deleteSession,getSession}