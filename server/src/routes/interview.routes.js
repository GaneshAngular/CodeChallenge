
import { Router } from 'express';
import { createInterview, deleteInterview, getAllInterviews, getCount, getInterview, updateInterview, updateInterviewSessions } from '../controller/interview.controller.js';
const interviewRoute=Router()
interviewRoute.get('/',getAllInterviews);
interviewRoute.get('/count',getCount);
interviewRoute.get('/:id',getInterview);
interviewRoute.post('/',createInterview);
interviewRoute.put('/',updateInterview);
interviewRoute.put('/session',updateInterviewSessions);
interviewRoute.delete('/',deleteInterview);

export default interviewRoute;