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
    const page = req.query.page ? parseInt(req.query.page) : null;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const skip = page && limit ? (page - 1) * limit : 0;
    const status=req.query.status
    let searchQuery = req.query.title 
      ? { sessionName: { $regex: req.query.title, $options: "i" } }
      : {};
      if(status)
      searchQuery.status=status

      
    try {
        // Get total count of filtered results
        const totalItems = await sessionModel.countDocuments(searchQuery);
    
        // Fetch all data if no pagination params are provided
        let query = sessionModel.find(searchQuery).populate('project');
    
        if (page && limit) {
            query = query.skip(skip).limit(limit);
        }
    
        const sessions = await query;
    
        if (!sessions.length) {
            return res.status(404).json({ message: "No sessions found" });
        }
    
        return res.json({
            sessions,
            totalItems,
            totalPages: limit ? Math.ceil(totalItems / limit) : 1, // Avoid division by zero
            currentPage: page || 1
        });
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
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