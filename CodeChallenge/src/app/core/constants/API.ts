import { environment } from "../../../environments/environment"

const INTERVIEW_API={
   api:'/api/interview',
   updateSession:'/api/interview/session'
}
const SESSION_API={
   api:'/api/session'
}

const CODE_CHALLENGE_URL=location.origin+'/live/challenge'
const TRACK_CODE_URL=location.origin+'/track-session'
const PROJECT_API={
  api:'/api/project'
}
const AUTH_API={
  login:'https://admin.liveexamcenter.in/api/auth/login',
  register:'/api/auth/register',
  logout:'/api/auth/logout'
}

// const SERVER_URL='https://codechallenge-9dq3.onrender.com'
const SERVER_URL=environment.server_url|| 'http://localhost:8080'


export {INTERVIEW_API, SESSION_API, PROJECT_API,AUTH_API,SERVER_URL,CODE_CHALLENGE_URL,TRACK_CODE_URL}



