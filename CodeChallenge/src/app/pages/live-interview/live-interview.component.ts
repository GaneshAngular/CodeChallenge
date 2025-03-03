import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InterviewerService } from '../../core/services/interviewer/interviewer.service';
import { CommonModule } from '@angular/common';
import { CODE_CHALLENGE_URL } from '../../core/constants/API';
import { CHALLENGE_SCORE } from '../../core/constants/type.constant';
import { ProjectService } from '../../core/services/project/project.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionService } from '../../core/services/session/session.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-live-interview',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
templateUrl: './live-interview.component.html',
  styleUrl: './live-interview.component.css'
})
export class LiveInterviewComponent implements OnInit {

   router=inject(Router)
   interview:any
   projects:any
   challengeScore=CHALLENGE_SCORE
   sessionModel=false
   codechallengeUrl=CODE_CHALLENGE_URL
   interviewService=inject(InterviewerService)
   projectService=inject(ProjectService)
   sessionService=inject(SessionService)

  sessionForm=new FormGroup({
      title:new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z0-9\s]{2,}$/)]),
      project:new FormControl('',[Validators.required]),
    })
  ngOnInit(): void {
    document.addEventListener('copy', (event) => event.preventDefault());
document.addEventListener('cut', (event) => event.preventDefault());
document.addEventListener('paste', (event) => event.preventDefault());
 // Disable right-click

     const url=this.router.url.split('/')
     const id:string=url.pop()||''
     this.interviewService.getInterview(id).subscribe((res:any)=>{
       this.interview=res
       this.loadProjects()
     })

  }

  toggleModal(){
    this.sessionModel=!this.sessionModel;
  }

  loadProjects(){
    this.projectService.getProjects().subscribe((res:any)=>{
      this.projects=res
    })
 }

  loadInterview(){
        this.interviewService.getInterview(this.interview?._id).subscribe((res:any)=>{
          this.interview=res
        })
  }

  createSession(){
    if(this.sessionForm.invalid) return alert("Invalid Details..!")

    this.sessionService.createSession(this.sessionForm.value).subscribe((res:any)=>{
      alert(res.message)
      this.toggleModal()
      const params=new HttpParams().set('id',this.interview._id)
      this.interviewService.updateSession({sessions:[res.data._id]},params).subscribe((res:any)=>{
        this.loadInterview()
      })
      this.sessionForm.reset()
    })

  }

  endSession(){
    if(!confirm('Are you sure to end session?')) return
    const params=new HttpParams().set('id',this.interview._id)
    this.interviewService.updateInterview({status:"completed"},params).subscribe((res:any)=>{
      alert(res.message)
      this.router.navigate(['/api/dashboard/interviews'])
    })
  }

  copyLink(url:string){
    navigator.clipboard.writeText(url);
    alert("link copied to clipboard")
  }

}
