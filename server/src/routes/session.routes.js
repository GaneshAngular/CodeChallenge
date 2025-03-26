import { Router } from "express";
import { createSession, deleteSession, getSession, getSessions, updateSession, getCount } from "../controller/session.controller.js";
import asyncHandler from "../middleware/asyncHandler.middleware.js";


const sessionRoute = Router()

sessionRoute.post('/', asyncHandler(createSession))
sessionRoute.get('/count', asyncHandler(getCount))
sessionRoute.get('/:id', asyncHandler(getSession))
sessionRoute.get('/', asyncHandler(getSessions))
sessionRoute.put('/', asyncHandler(updateSession))
sessionRoute.delete('/', asyncHandler(deleteSession))

export default sessionRoute