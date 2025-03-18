import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionService } from '../../../core/services/session/session.service';
import { InterviewerService } from '../../../core/services/interviewer/interviewer.service';
import { Router, RouterLink } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { PreventCopyPasteDirective } from '../../../shared/directives/prevent-copy-paste.directive';
import { SweetAlertService } from '../../../core/services/sweet-alert/sweet-alert.service';

@Component({
  selector: 'app-interview',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent,],
  templateUrl: './interview.component.html',
  styleUrl: './interview.component.css'
})
export class InterviewComponent implements OnInit {
  interviewModal=false
  sessions:any=[]
  interviews:any
  interview:any
  page:number = 1
  totalPages=0
  limit=5
  searchTitle=''
  isUpdateInterview=false
  router=inject(Router)
  interviewService=inject(InterviewerService)
  sessionService=inject(SessionService)
  alertService=inject(SweetAlertService)
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
  const params=new HttpParams().set('status',"inactive")
    this.sessionService.getSessions(params).subscribe((res:any)=>{
      this.sessions=res.sessions
    })

}

changePage(page:any){
   this.page=page
   this.loadInterviews()
}
editInterview(index:number){
   this.isUpdateInterview=true
   this.interviewModal=true
   this.interview=this.interviews[index]
   this.interviewForm.patchValue({...this.interview,sessions:this.interview.sessions.map((int:any)=>int._id)})
}

loadInterviews(){
  let params=new HttpParams().set('limit',this.limit).set('page',this.page)
  if (this.searchTitle) {
    params = params.set('title', this.searchTitle);
  }
    this.interviewService.getInterviewes(params).subscribe((res:any)=>{
      this.interviews=res.interviews
      this.totalPages=res.totalPages

    })

}
updateInterview(){
   if(this.interviewForm.invalid) return alert("Invalid Details..!")
   const params=new HttpParams().set('id',this.interview._id)
   this.interviewService.updateInterview(this.interviewForm.value,params).subscribe((res:any)=>{
     this.alertService.toast("success",res.message)
     this.toggleInterviewModal()
     this.interviewForm.reset()
     this.loadInterviews()
   })
}

async deleteInterview(id:string){
  const params=new HttpParams().set('id',id)
  if(await this.alertService.confirm('Are you sure ',"Yes,Delete","Cancal"))
  this.interviewService.deleteInterview(params).subscribe((res:any)=>{
    this.alertService.toast("success",res.message)
    this.loadInterviews()
  },(err:any)=>{
    this.alertService.toast("error",err.error.message)
  })
}

sheduleInterview(){
  console.log(this.interviewForm.value)
  if(this.interviewForm.invalid) return this.alertService.toast("warning","Invalid Details..!","center")

  this.interviewService.createInterview(this.interviewForm.value).subscribe((res:any)=>{
    this.alertService.toast("success",res.message)
    this.toggleInterviewModal()
    this.interviewForm.reset()
    this.loadInterviews()
  })
}
async startInterview(id:string){
   if(! await this.alertService.confirm("Are you sure you want to start","Yes","No,Later")) return
 this.router.navigate(['/live/interview/'+id])
}

  toggleInterviewModal(){
    this.isUpdateInterview=false
    this.interviewModal=!this.interviewModal;
  }
  generateSessionTitles(sessions:any){
    return sessions.map((int:any)=>int.title).join(" , ")
  }
}
