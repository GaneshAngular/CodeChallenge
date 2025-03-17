import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { AuthService } from '../../core/services/auth/auth.service';
import { SocketIoService } from '../../core/services/socket.io/socket.io.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule, NavBarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  socketService=inject(SocketIoService)

authService=inject(AuthService)
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private router:Router) {

  }

  onSubmit() {
    if (this.loginForm.valid) {
         this.authService.login(this.loginForm.value).subscribe((res:any)=>{
                localStorage.setItem('token',res.token);
                this.router.navigate(['/dashboard']);
                this.socketService.sendData('join',res.user._id)
         },(err:any)=>{
              console.log(err)

         })
    }
  }
}
