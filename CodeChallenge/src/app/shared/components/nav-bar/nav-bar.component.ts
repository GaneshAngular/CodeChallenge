import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink,FormsModule,CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
    isDarkTheme: boolean = false;

  isLogged=false;
  router=inject(Router)
     ngOnInit(): void {
      localStorage.getItem('token')?this.isLogged=true:''
       if(localStorage.getItem('theme')=='dark'){
             this.isDarkTheme = true;
             this.toggleTheme(this.isDarkTheme);
       }else if(localStorage.getItem('theme')=='light'){
          this.isDarkTheme = false;
          this.toggleTheme(this.isDarkTheme);
       }else{
        if(window.matchMedia('(prefers-color-scheme: dark)').matches){
         localStorage.setItem('theme', 'dark');
         this.isDarkTheme=true
         this.toggleTheme(this.isDarkTheme);

        } else {
          localStorage.setItem('theme', 'light');
          this.isDarkTheme=false;
          this.toggleTheme(this.isDarkTheme);

        }
       }

     }

     changeTheme(){
       this.isDarkTheme =!this.isDarkTheme;
       localStorage.setItem('theme', this.isDarkTheme?'dark':'light');
       this.toggleTheme(this.isDarkTheme)
     }
     toggleTheme(theme:boolean){
      document.querySelector('html')?.classList.toggle('bg-gray-900', theme);
       document.querySelector('html')?.classList.toggle('text-white', theme);
     }

     logout(){
      localStorage.removeItem('token')
      this.isLogged=false
      this.router.navigate(['/login'])
     }
}
