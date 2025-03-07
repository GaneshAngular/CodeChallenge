import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../../core/services/project/project.service';
import { HttpParams } from '@angular/common/http';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-project',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {
  projectModal=false
 projects:any=[]
 project:any
 page:number = 1
  totalPages=0
  limit=2
  searchTitle=''
 isProjectUpdate=false
  projectService=inject(ProjectService)
  projectForm=new FormGroup({
    title:new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z\s]{2,}$/)]),
    skills:new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z\,\s]{2,}$/)]),
    url:new FormControl('',[Validators.required])
  })
  ngOnInit(): void {
    this.loadProjects()
  }


  loadProjects(){
    let params=new HttpParams().set('limit',this.limit).set('page',this.page)
  if (this.searchTitle) {
    params = params.set('title', this.searchTitle);
  }
    this.projectService.getProjects(params).subscribe((res:any)=>{
      this.projects=res.projects
      this.totalPages=res.totalPages
    })
  }

  changePage(page:any){
    this.page=page
    this.loadProjects()
 }

  editProject(index:number){
    this.isProjectUpdate=true
     this.projectModal=true
     this.project=this.projects[index]
     this.projectForm.patchValue(this.project)
  }

  toggleModal(){
    this.isProjectUpdate=false
    this.projectModal=!this.projectModal;
  }
  updateProject(id:string){
    if(this.projectForm.invalid) return alert("Invalid Details..!")
      const params=new HttpParams().set('id',id)
    if(confirm('Are you sure'))
      this.projectService.updateProject(this.projectForm.value,params).subscribe((res:any)=>{
        alert(res.message)
        this.toggleModal()
        this.projectForm.reset()
        this.projectModal=false
        this.isProjectUpdate=false
        this.loadProjects()
      })
  }
  deleteProject(id:string){
    const params=new HttpParams().set('id',id)
    if(confirm('Are you sure '))
    this.projectService.deleteProject(params).subscribe((res:any)=>{
      alert(res.message)
      this.loadProjects()
    })
  }

  createProject(){
    if(this.projectForm.invalid) return alert("Invalid Details..!")

      this.projectService.createProject(this.projectForm.value).subscribe((res:any)=>{
        alert(res.message)
        this.toggleModal()
        this.projectForm.reset()
        this.loadProjects()
      })
  }

}
