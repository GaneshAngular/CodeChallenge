import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionService } from '../../../core/services/session/session.service';
import { InterviewerService } from '../../../core/services/interviewer/interviewer.service';
import { Router, RouterLink } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-interview',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './interview.component.html',
  styleUrl: './interview.component.css'
})
export class InterviewComponent implements OnInit {
  interviewModal=false
  sessions:any
  interviews:any
  interview:any
  isUpdateInterview=false
  router=inject(Router)
  interviewService=inject(InterviewerService)
  sessionService=inject(SessionService)
interviewForm=new FormGroup({
  candidateName:new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z\s]{2,}$/)]),
  interviewerId:new FormControl('ffsdfdfjdfjd'),
  sessions:new FormControl([], [Validators.required])
})
ngOnInit(): void {
   this.loadSessions()
   this.loadInterviews()
}

loadSessions(){
    this.sessionService.getSessions().subscribe((res:any)=>{
      this.sessions=res
    })

}
editInterview(index:number){
   this.isUpdateInterview=true
   this.interviewModal=true
   this.interview=this.interviews[index]
   this.interviewForm.patchValue({...this.interview,sessions:this.interview.sessions.map((int:any)=>int._id)})
}

loadInterviews(){
    this.interviewService.getInterviewes().subscribe((res:any)=>{
      this.interviews=res
    })

}
updateInterview(){
   if(this.interviewForm.invalid) return alert("Invalid Details..!")
   const params=new HttpParams().set('id',this.interview._id)
   this.interviewService.updateInterview(this.interviewForm.value,params).subscribe((res:any)=>{
     alert(res.message)
     this.toggleInterviewModal()
     this.interviewForm.reset()
     this.loadInterviews()
   })
}

deleteInterview(id:string){
  const params=new HttpParams().set('id',id)
  if(confirm('Are you sure '))
  this.interviewService.deleteInterview(params).subscribe((res:any)=>{
    alert(res.message)
    this.loadInterviews()
  })
}

sheduleInterview(){
  console.log(this.interviewForm.value)
  if(this.interviewForm.invalid) return alert("Invalid Details..!")

  this.interviewService.createInterview(this.interviewForm.value).subscribe((res:any)=>{
    alert(res.message)
    this.toggleInterviewModal()
    this.interviewForm.reset()
    this.loadInterviews()
  })
}
startInterview(id:string){
   if(!confirm("Are you sure you want to start")) return 
 this.router.navigate(['/live/interview/'+id])
}

  toggleInterviewModal(){
    this.isUpdateInterview=false
    this.interviewModal=!this.interviewModal;
  }
  generateSessionTitles(sessions:any){
    return sessions.map((int:any)=>int.title).join(",")
  }
}
