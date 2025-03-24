import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { HttpParams } from '@angular/common/http';
import { INTERVIEW_API } from '../../constants/API';

@Injectable({
  providedIn: 'root'
})
export class InterviewerService {

  constructor() { }
  httpService=inject(HttpService)

  getInterviewes(params?:HttpParams) {
    return this.httpService.get(INTERVIEW_API.api,params);
  }
  getInterview(id:string){
    return this.httpService.get(INTERVIEW_API.api+"/"+id)
  }
  createInterview(data:any){
    return this.httpService.post(INTERVIEW_API.api,data)
  }
  updateSession(data:any,params:HttpParams){
     return this.httpService.put(INTERVIEW_API.updateSession,data,params)
  }
  updateInterview(data:any,params:HttpParams){
     return this.httpService.put(INTERVIEW_API.api,data,params)
  }
  deleteInterview(params:HttpParams){
     return this.httpService.delete(INTERVIEW_API.api,params)
  }
  getCount(){
    return this.httpService.get(INTERVIEW_API.api+"/count")
  }
}
