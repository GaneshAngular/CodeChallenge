import interviewModel from "../models/interview.model.js"

import { io } from "../services/socket.io.service.js"



const createInterview = async (req, res) => {
    try {
        const data={...req.body,createdBy:req.user._id}
        const interview = await interviewModel.create(data)
        if (!interview) return res.status(500).json({ message: "Error creating interview" })

        return res.status(201).json({ message: "Interview created", data: interview })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server Error" })
    }
}

const getAllInterviews = async (req, res) => {
    const page = parseInt(req.query.page) || 1;  
    const limit = parseInt(req.query.limit) || 10;  
    const skip = (page - 1) * limit;
    const searchTitle = req.query.title ? { candidateName: { $regex: req.query.title, $options: "i" } } : {};
   const id=req.user._id;
    try {
        // Get total count of filtered results
        const totalPages = await interviewModel.countDocuments(searchTitle);
    
        // Fetch paginated results
        const interviews = await interviewModel.find(searchTitle)
            .skip(skip)
            .limit(limit)
            .populate('sessions');
    
        return res.json({
            interviews,
            totalPages,
            totalPages: Math.ceil(totalPages / limit),
            currentPage: page
        });
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
    
}

const getInterview = async (req, res) => {
    try {
        const { id } = req.params
        const interview = await interviewModel.findById(id).populate({path:'sessions',populate:{path:'project'}})
        if (!interview) return res.status(404).json({ message: "Interview not found" })
        
        return res.json(interview)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server Error" })
    }
}

const updateInterview = async (req, res) => {
    try {
        const { id } = req.query
        const data = req.body
        const interview = await interviewModel.findByIdAndUpdate(id, data, { new: true })
        if (!interview) return res.status(404).json({ message: "Interview not found" })
           io.emit('update-interview', interview)
        return res.status(201).json({ message: "Interview updated", data: interview })
    } catch (error) {
       console.log(error)
        return res.status(500).json({ message: "Server Error" })
    }
}
const updateInterviewSessions=async(req,res)=>{
    try {
    const { id } = req.query
    const data = req.body
    const interview = await interviewModel.findByIdAndUpdate(id, { $push: { sessions: data.sessions } }, { new: true })
    if (!interview) return res.status(404).json({ message: "Interview not found" })

    return res.status(201).json({ message: "Interview sessions updated", data: interview })
    } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Server Error" })
    }
}

const deleteInterview=async(req, res) => {
   try {
   const { id } = req.query
   const interview = await interviewModel.findByIdAndDelete(id)
   if (!interview) return res.status(404).json({ message: "Interview not found" })
    
    return res.status(201).json({ message: "Interview deleted" })
   } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Server Error" })
   }

}

export{createInterview, deleteInterview, updateInterview, getInterview,getAllInterviews,updateInterviewSessions}