import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { AUTH_API } from '../../constants/API';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   http=inject(HttpClient)

  constructor() {

   }

   login(data:any){
    return this.http.post(AUTH_API.login,{...data,skipCaptcha:true})
   }
}
