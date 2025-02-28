import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SERVER_URL } from '../../constants/API';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() { }
  http=inject(HttpClient)

  get(url: string,params?:HttpParams) {
    return this.http.get(SERVER_URL+url,{params});
  }

  post(url: string, data: any) {
    return this.http.post(SERVER_URL+url, data);
  }
  put(url: string, data: any,params?:HttpParams) {
    return this.http.put(SERVER_URL+url, data,{
      params
    });
  }
    delete(url: string, params?:HttpParams) {
      return this.http.delete(SERVER_URL+url,{
        params
      });

  }
}
