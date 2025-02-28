
import projectModel from '../models/project.model.js';

const createProject = async (req, res) => {
    try {
        const data = req.body
        const project = await projectModel.create(data)
        if (!project) return res.status(500).json({ message: "Error creating project" })

        return res.status(201).json({ message: "Project created" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Servr Error" })
    }
}

const getProjects = async (req, res) => {
    try {
        const projects = await projectModel.find({})
        if (projects.length == 0) return res.status(404).json({ message: "No projects found" })
        return res.json(projects)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Servr Error" })
    }
}

const getProject=async(req,res)=>{
    try {
        const { id } = req.params
        const project = await projectModel.findById(id)
        if (!project) return res.status(404).json({ message: "Project not found" })
        return res.json(project)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Servr Error" })
    }
}

const updateProject = async (req, res) => {

    try {
        const data = req.body
        const { id } = req.query
        const project = await projectModel.findById(id)
        if (!project) return res.status(404).json({ message: "Project not found" })

        const newProject = await projectModel.findByIdAndUpdate(id, data)
        if (!newProject) return res.status(500).json({ message: "Error updating project" })

        return res.status(201).json({ message: "Project Updated", data: newProject})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Servr Error" })
    }
}

const deleteProject = async (req, res) => {
    try {
        const { id } = req.query
        const project = await projectModel.findByIdAndDelete(id)
        if (!project) return res.status(404).json({ message: "Project not found" })

        return res.status(201).json({ message: "Project Deleted" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Servr Error" })
    }
}

export { createProject, getProjects, updateProject, deleteProject,getProject }