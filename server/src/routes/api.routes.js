import { Router } from "express";
import authRoute from "./auth.routes.js";
import projectRoute from "./project.routes.js";
import sessionRoute from "./session.routes.js";
import interviewRoute from "./interview.routes.js";

const apiRoute=Router()

apiRoute.use('/auth',authRoute)
apiRoute.use('/interview',interviewRoute) 
apiRoute.use('/project',projectRoute)
apiRoute.use('/session',sessionRoute)

export default apiRoute