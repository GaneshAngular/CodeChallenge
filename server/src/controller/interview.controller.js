import redisClient from "../config/redis.config.js"
import interviewModel from "../models/interview.model.js"

import { io } from "../services/socket.io.service.js"



const createInterview = async (req, res) => {
        const data={...req.body,createdBy:req.user._id}
        const interview = await interviewModel.create(data)
        if (!interview) return res.status(500).json({ message: "Error creating interview" })

        return res.status(201).json({ message: "Interview created", data: interview })
}
const getCount=async (req, res) => {
          const interview = await interviewModel.countDocuments()
          return res.json({count: interview})
}

const getAllInterviews = async (req, res) => {
    const page = parseInt(req.query.page) || 1;  
    const limit = parseInt(req.query.limit) || 10;  
    const skip = (page - 1) * limit;
    const sort=req.query.sort||''
    let searchTitle = req.query.title ? { candidateName: { $regex: req.query.title, $options: "i" } }:{};
       if(sort)searchTitle['status']=sort

   const id=req.user._id;
        // Get total count of filtered results
        const totalPages = await interviewModel.countDocuments(searchTitle);
    
        // Fetch paginated results
        const interviews = await interviewModel.find(searchTitle)
            .skip(skip)
            .limit(limit)
            .populate('sessions');
            const cacheKey=req.originalUrl
           
            const response={
                interviews,
                totalPages,
                totalPages: Math.ceil(totalPages / limit),
                currentPage: page
            }
         await  redisClient.setEx(cacheKey,3600,JSON.stringify(response))
        return res.json(response);
    
       ;
    
}

const getInterview = async (req, res) => {
        const { id } = req.params
        const interview = await interviewModel.findById(id).populate({path:'sessions',populate:{path:'project'}})
        if (!interview) return res.status(404).json({ message: "Interview not found" })
        
            const cacheKey=req.originalUrl
        
         await  redisClient.setEx(cacheKey,3600,JSON.stringify(interview))
        return res.json(interview)
}

const updateInterview = async (req, res) => {
        const { id } = req.query
        const data = req.body
        const interview = await interviewModel.findByIdAndUpdate(id, data, { new: true })
        if (!interview) return res.status(404).json({ message: "Interview not found" })
           io.emit('update-interview', interview)
        return res.status(201).json({ message: "Interview updated", data: interview })
}
const updateInterviewSessions=async(req,res)=>{
    const { id } = req.query
    const data = req.body
    const interview = await interviewModel.findByIdAndUpdate(id, { $push: { sessions: data.sessions } }, { new: true })
    if (!interview) return res.status(404).json({ message: "Interview not found" })

    return res.status(201).json({ message: "Interview sessions updated", data: interview })
}

const deleteInterview=async(req, res) => {
   const { id } = req.query
   const interview = await interviewModel.findByIdAndDelete(id)
   if (!interview) return res.status(404).json({ message: "Interview not found" })
    
    return res.status(201).json({ message: "Interview deleted" })

}

export{createInterview, deleteInterview, updateInterview, getInterview,getAllInterviews,updateInterviewSessions,getCount}