import redisClient from "../config/redis.config.js"
import sessionModel from "../models/session.model.js"
import { io } from "../services/socket.io.service.js"





const createSession=async(req,res)=>{
        const data={...req.body,createdBy:req.user._id}
        const session=await  sessionModel.create(data)
        if(!session) return res.status(500).json({message:"Error creating session"})

        return res.status(201).json({message:"Session created",data:session})
}

const getSessions=async(req,res)=>{
    const page = req.query.page ? parseInt(req.query.page) : null;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const skip = page && limit ? (page - 1) * limit : 0;
    const status=req.query.status
    let searchQuery = req.query.title 
      ? { title: { $regex: req.query.title, $options: "i" } }
      : {};
      if(status)
      searchQuery.status=status
 
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
        const response={
                sessions,
                totalItems,
                totalPages: limit ? Math.ceil(totalItems / limit) : 1, // Avoid division by zero
                currentPage: page || 1
            }
        const cacheKey=req.originalUrl
       
     await  redisClient.setEx(cacheKey,3600,JSON.stringify(response))

        return res.json(response);
   
    
}
const getSession=async (req, res) => {
  
             const {id}=req.params
             const session=await sessionModel.findById(id).populate('project')
             
             if(!session) return res.status(404).json({message:"Session not found"})

             
                const cacheKey=req.originalUrl
             await  redisClient.setEx(cacheKey,3600,JSON.stringify(session))
             return res.status(200).json(session)
      
    }


const updateSession=async(req,res)=>{

        const data=req.body
        const {id}=req.query
        const session=await sessionModel.findByIdAndUpdate(id,data,{new:true})
        if(!session) return res.status(404).json({message:"Session not found"})

        // const newSession=await sessionModel.findById(id)
        // if(!newSession) return res.status(500).json({message:"Error updating session"})
         if(!data.code)
         io.emit('update-interview',"Session updated")
         else
          io.emit(id,session.code)
        return res.status(201).json({message:"Session updated",data:session})
   
}
const getCount=async (req, res) => {
   
        
        const session = await sessionModel.countDocuments()
     
        return res.json({count: session})
   
 
}

const deleteSession=async(req,res)=>{
    
        const {id}=req.query
        const session=await sessionModel.findByIdAndDelete(id)
        if(!session) return res.status(404).json({message:"Session not found"})

        return res.status(201).json({message:"Session deleted"})
   
}

export {createSession,getSessions,updateSession,deleteSession,getSession,getCount}