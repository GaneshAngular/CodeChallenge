import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon }  from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

 async  confirm(title:string,confirmBtnText:string,cancalBtnText:string){
    const result= await Swal.fire({
      title:title,
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: confirmBtnText,
      denyButtonText:cancalBtnText
    })

    return result.isConfirmed

  }
  toast(icon:SweetAlertIcon,title:string,position?:'top-end'|'bottom-end'|'top-start'|'bottom-start'|"center"|"center-start"|"center-end"|"top"){
  const Toast = Swal.mixin({
    toast: true,
    position: position||"top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  Toast.fire({
    icon:icon,
    title:title
  });
}

}

