import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InterviewerService } from '../../core/services/interviewer/interviewer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-live-interview',
  imports: [CommonModule],
  templateUrl: './live-interview.component.html',
  styleUrl: './live-interview.component.css'
})
export class LiveInterviewComponent implements OnInit {

   router=inject(Router)
   interview:any
   interviewService=inject(InterviewerService)
  ngOnInit(): void {
     const url=this.router.url.split('/')
     const id:string=url.pop()||''
     this.interviewService.getInterview(id).subscribe((res:any)=>{
       this.interview=res
     })
  }

  loadInterview(){
        this.interviewService.getInterview(this.interview?._id).subscribe((res:any)=>{
          this.interview=res
        })
  }

  copyLink(url:string){
    navigator.clipboard.writeText(url);
    alert("link copied to clipboard")
  }

}
