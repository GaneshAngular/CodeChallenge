
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
    const page = req.query.page ? parseInt(req.query.page) : null;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const skip = page && limit ? (page - 1) * limit : 0;
    const searchQuery = req.query.title
        ? { title: { $regex: req.query.title, $options: "i" } }
        : {};


    try {
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

        return res.json({
            projects,
            totalItems,
            totalPages: limit ? Math.ceil(totalItems / limit) : 1, // Avoid division by zero
            currentPage: page || 1
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }

}

const getProject = async (req, res) => {
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

        return res.status(201).json({ message: "Project Updated", data: newProject })
    } catch (error) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const searchTitle = req.query.title ? { candidateName: { $regex: req.query.title, $options: "i" } } : {};

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

export { createProject, getProjects, updateProject, deleteProject, getProject }