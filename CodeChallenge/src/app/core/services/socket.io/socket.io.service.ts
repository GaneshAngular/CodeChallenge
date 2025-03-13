import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { SERVER_URL } from '../../constants/API';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  socket:Socket
  constructor() {
    this.socket=io(SERVER_URL)
   }

   getResponse(event:string){
    return new Observable(observer => {
      this.socket.on(event, (data: string) => {
        observer.next(data);
      });
    });
   }

   sendData(event:string,data:any){
    this.socket.emit(event,data,(response:any)=>{
      console.log(response)
      alert("")
    })
   }
}
