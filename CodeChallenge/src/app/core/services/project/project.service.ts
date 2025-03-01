import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { HttpParams } from '@angular/common/http';
import { PROJECT_API } from '../../constants/API';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor() { }
  httpService=inject(HttpService)

  getProjects(params?:HttpParams) {
    return this.httpService.get(PROJECT_API.api);
  }

  getProject(id:string){
    return this.httpService.get(PROJECT_API.api+"/"+id)
  }

  createProject(data:any) {
      return this.httpService.post(PROJECT_API.api, data);
  }

  updateProject(project:any, params?:HttpParams) {
    return this.httpService.put(PROJECT_API.api, project,params);
  }

  deleteProject(params:HttpParams) {
    return this.httpService.delete(PROJECT_API.api,params);
  }
}
