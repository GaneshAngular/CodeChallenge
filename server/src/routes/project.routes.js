import { Router } from "express";
import { createProject, deleteProject, getCount, getProject, getProjects, updateProject } from "../controller/project.controller.js";
import asyncHandler from "../middleware/asyncHandler.middleware.js";

const projectRoute=Router()

projectRoute.post('/',asyncHandler(createProject))
projectRoute.get('/',asyncHandler(getProjects))
projectRoute.get('/count',asyncHandler(getCount))
projectRoute.get('/:id',asyncHandler(getProject))  
projectRoute.put('/',asyncHandler(updateProject))
projectRoute.delete('/',asyncHandler(deleteProject))


export default projectRoute
