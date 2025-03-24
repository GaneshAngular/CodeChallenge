import { CommonModule } from '@angular/common';
import { Component, inject, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InterviewerService } from '../../core/services/interviewer/interviewer.service';
import { HttpParams } from '@angular/common/http';
import { TimePipe } from '../../shared/pipes/timeconverter/time.pipe';
import { PaginationComponent } from "../../shared/components/pagination/pagination.component";
import { TRACK_CODE_URL } from '../../core/constants/API';
import { SessionService } from '../../core/services/session/session.service';
import { ProjectService } from '../../core/services/project/project.service';

@Component({
  selector: 'app-reports',
  imports: [FormsModule, CommonModule, TimePipe, PaginationComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  searchText: string = '';

  interviews:any
  interviewService=inject(InterviewerService)
  sessionService=inject(SessionService)
  projectService=inject(ProjectService)
  limit=5
  trackSessionUrl=TRACK_CODE_URL
  page=1
  totalpages=1
  projects:any
  sessions:any
  sort:'completed'|'in-progress'|'inactive'|'All'='All'

  ngOnInit() {
    this.loadInterviews();
    this.getCounts()
  }
  getCounts(){
    this.projectService.getCount().subscribe((res:any) => {
      this.projects = res.count;
    });
    this.sessionService.getCount().subscribe((res:any) => {
      this.sessions = res.count;
    });
  }
  // Filter interviews based on search input
  loadInterviews(){
     let params=new HttpParams().set('limit', this.limit).set('page', this.page)

     if (this.searchText) {
      params = params.set('title', this.searchText);
    }
    if (this.sort!=='All') {
      params = params.set('sort', this.sort);
    }
    this.interviewService.getInterviewes(params).subscribe((res:any) => {
      this.interviews = res.interviews;
      this.totalpages = res.totalPages;
      this.page = res.currentPage;
    });
  }
  filteredInterviews() {

  }
  pageChange(value:any){
     this.page=value
  }


  // Sort interviews by title
  sortInterviews() {

  }
}
