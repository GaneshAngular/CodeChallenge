
import { Router } from 'express';
import { createInterview, deleteInterview, getAllInterviews, getCount, getInterview, updateInterview, updateInterviewSessions } from '../controller/interview.controller.js';
import asyncHandler from '../middleware/asyncHandler.middleware.js';
const interviewRoute=Router()
interviewRoute.get('/',asyncHandler(getAllInterviews));
interviewRoute.get('/count',asyncHandler(getCount));
interviewRoute.get('/:id',asyncHandler(getInterview));
interviewRoute.post('/',asyncHandler(createInterview));
interviewRoute.put('/',asyncHandler(updateInterview));
interviewRoute.put('/session',asyncHandler(updateInterviewSessions));
interviewRoute.delete('/',asyncHandler(deleteInterview));

export default interviewRoute;