import { Component, inject, OnInit, Sanitizer } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../core/services/project/project.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-live-challenge',
  imports: [],
  templateUrl: './live-challenge.component.html',
  styleUrl: './live-challenge.component.css'
})
export class LiveChallengeComponent implements OnInit {
   projectUrl:SafeResourceUrl=''
   projectService=inject(ProjectService)
   router=inject(Router)
   sanitizer=inject(DomSanitizer)
  ngOnInit(): void {
      const id:string=this.router.url.split('/').pop()||''
     this.projectService.getProject(id).subscribe((res:any)=>{
       this.projectUrl=this.sanitizer.bypassSecurityTrustResourceUrl(res.url);
     })
  }
}
