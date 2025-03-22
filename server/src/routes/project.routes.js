import { Router } from "express";
import { createProject, deleteProject, getCount, getProject, getProjects, updateProject } from "../controller/project.controller.js";

const projectRoute=Router()

projectRoute.post('/',createProject)
projectRoute.get('/',getProjects)
projectRoute.get('/count',getCount)
projectRoute.get('/:id',getProject)  
projectRoute.put('/',updateProject)
projectRoute.delete('/',deleteProject)


export default projectRoute
