
import redisClient from '../config/redis.config.js';
import projectModel from '../models/project.model.js';

const createProject = async (req, res) => {
        const data = { ...req.body, createdBy: req.user._id }
        const project = await projectModel.create(data)
        if (!project) return res.status(500).json({ message: "Error creating project" })

        return res.status(201).json({ message: "Project created" })

}

const getProjects = async (req, res) => {
        const page = req.query.page ? parseInt(req.query.page) : null;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const skip = page && limit ? (page - 1) * limit : 0;
        const searchQuery = req.query.title
                ? { title: { $regex: req.query.title, $options: "i" } }
                : {};


        // Get total count of filtered results
        const totalItems = await projectModel.countDocuments(searchQuery);

        // Fetch all data if no pagination params are provided
        let query = projectModel.find(searchQuery);

        if (page && limit) {
                query = query.skip(skip).limit(limit);
        }

        const projects = await query;

        if (!projects.length) {
                return res.status(404).json({ message: "No projects found" });
        }

        const cacheKey = req.originalUrl
        console.log("---->", req.originalUrl)
        const response = {
                projects,
                totalItems,
                totalPages: limit ? Math.ceil(totalItems / limit) : 1, // Avoid division by zero
                currentPage: page || 1
        }
        await redisClient.setEx(cacheKey, 120, JSON.stringify(response))

        return res.json(response);


}
const getCount = async (req, res) => {

        const project = await projectModel.countDocuments()

        return res.json({ count: project })

}

const getProject = async (req, res) => {
        const { id } = req.params
        const project = await projectModel.findById(id)
        if (!project) return res.status(404).json({ message: "Project not found" })

        const cacheKey = req.originalUrl
        console.log("---->", req.originalUrl)

        await redisClient.setEx(cacheKey, 120, JSON.stringify(project))
        return res.json(project)
}

const updateProject = async (req, res) => {

        const data = req.body
        const { id } = req.query
        const project = await projectModel.findById(id)
        if (!project) return res.status(404).json({ message: "Project not found" })

        const newProject = await projectModel.findByIdAndUpdate(id, data)
        if (!newProject) return res.status(500).json({ message: "Error updating project" })

        return res.status(201).json({ message: "Project Updated", data: newProject })


}

const deleteProject = async (req, res) => {
        const { id } = req.query
        const project = await projectModel.findByIdAndDelete(id)
        if (!project) return res.status(404).json({ message: "Project not found" })

        return res.status(201).json({ message: "Project Deleted" })
}

export { createProject, getProjects, updateProject, deleteProject, getProject, getCount }