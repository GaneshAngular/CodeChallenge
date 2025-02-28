import interviewModel from "../models/interview.model.js"



const createInterview = async (req, res) => {
    try {
        const data = req.body
        const interview = await interviewModel.create(data)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server Error" })
    }
}

const getAllInterviews = async (req, res) => {
    try {
        const interviews = await interviewModel.find({})
        return res.json(interviews)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server Error" })
    }
}

const getInterview = async (req, res) => {
    try {
        const { id } = req.params
        const interview = await interviewModel.findById(id)
        if (!interview) return res.status(404).json({ message: "Interview not found" })
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

export{createInterview, deleteInterview, updateInterview, getInterview,getAllInterviews}