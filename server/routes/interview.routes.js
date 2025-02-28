
import { Router } from 'express';
import { createInterview, deleteInterview, getAllInterviews, getInterview, updateInterview } from '../controller/interview.controller.js';
const interviewRoute=Router()
interviewRoute.get('/',getAllInterviews);
interviewRoute.get('/:id',getInterview);
interviewRoute.post('/',createInterview);
interviewRoute.put('/',updateInterview);
interviewRoute.delete('/',deleteInterview);

export default interviewRoute;