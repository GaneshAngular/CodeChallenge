import { Router } from "express";
import { createSession, deleteSession, getSession, getSessions, updateSession,getCount } from "../controller/session.controller.js";


const sessionRoute=Router()

sessionRoute.post('/',createSession)
sessionRoute.get('/count',getCount)
sessionRoute.get('/:id',getSession) 
sessionRoute.get('/',getSessions)
sessionRoute.put('/',updateSession)
sessionRoute.delete('/',deleteSession)

export default sessionRoute