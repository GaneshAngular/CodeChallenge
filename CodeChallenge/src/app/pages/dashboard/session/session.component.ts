import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../../core/services/project/project.service';
import { SessionService } from '../../../core/services/session/session.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-session',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css'
})
export class SessionComponent implements OnInit {
  sessionModel=false
 projects:any[] = [];
 sessions:any[] = [];
 session:any
 isUpdateSession=false
  sessionForm=new FormGroup({
    title:new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z0-9\s]{2,}$/)]),
    project:new FormControl('',[Validators.required]),

  })
  ngOnInit(): void {
    this.loadProjects()
    this.loadSessions()
  }
  sessionService=inject(SessionService)
projectService=inject(ProjectService)
  loadProjects(){
     this.projectService.getProjects().subscribe((res:any)=>{
       this.projects=res
     })
  }

  loadSessions(){
    this.sessionService.getSessions().subscribe((res:any)=>{
      this.sessions=res
    })
  }
  toggleModal(){
    this.isUpdateSession=false
    this.sessionForm.reset()
    this.sessionModel=!this.sessionModel;
  }

  createSession(){
    if(this.sessionForm.invalid) return alert("Invalid Details..!")

    this.sessionService.createSession(this.sessionForm.value).subscribe((res:any)=>{
      alert(res.message)
      this.toggleModal()
      this.sessionForm.reset()
      this.loadSessions()
    })

  }
  editSession(index:number){
    this.session=this.sessions[index]
    this.sessionModel=true
    this.isUpdateSession=true
    this.sessionForm.patchValue({
      title:this.session.title,
      project:this.session.project._id
    })
  }
  deleteSession(id:string){
    const params=new HttpParams().set('id',id)
    if(confirm('Are you sure'))
    this.sessionService.deleteSession(params).subscribe((res:any)=>{
      alert(res.message)
      this.loadSessions()
    })
  }

  updateSession(id:string){
     if(this.sessionForm.invalid) return alert("Invalid Details..!")
     const params=new HttpParams().set('id',id)
     this.sessionService.updateSession(this.sessionForm.value,params).subscribe((res:any)=>{
       alert(res.message)
       this.toggleModal()
       this.sessionForm.reset()
       this.loadSessions()
     })

  }
}
