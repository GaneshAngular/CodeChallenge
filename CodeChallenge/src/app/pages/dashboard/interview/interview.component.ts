import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-interview',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './interview.component.html',
  styleUrl: './interview.component.css'
})
export class InterviewComponent {
  interviewModal=false




  toggleInterviewModal(){
    this.interviewModal=!this.interviewModal;
  }
}
