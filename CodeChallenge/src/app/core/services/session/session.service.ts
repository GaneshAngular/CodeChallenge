import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { SESSION_API } from '../../constants/API';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  httpService=inject(HttpService)

  createSession(session:any) {
      return this.httpService.post(SESSION_API.api, session);
  }
  updateSession(session:any,params:HttpParams) {
    return this.httpService.put(SESSION_API.api, session,params);
  }
  deleteSession(params:HttpParams) {
    return this.httpService.delete(SESSION_API.api, params);
  }
  getSession(id:string) {
    return this.httpService.get(SESSION_API.api+"/"+id);
  }
  getSessions(params?:HttpParams) {
    return this.httpService.get(SESSION_API.api, params);
  }
}
