import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-session',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css'
})
export class SessionComponent {
  sessionModel=false




  toggleModal(){
    this.sessionModel=!this.sessionModel;
  }
}
