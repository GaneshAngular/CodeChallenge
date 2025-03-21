import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../../core/services/project/project.service';
import { HttpParams } from '@angular/common/http';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { SweetAlertService } from '../../../core/services/sweet-alert/sweet-alert.service';
import { Subject, catchError, takeUntil } from 'rxjs';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  projectModal = false;
  projects: any[] = [];
  project: any;
  page = 1;
  totalPages = 0;
  limit = 5;
  searchTitle = '';
  isProjectUpdate = false;

  projectService = inject(ProjectService);
  alertService = inject(SweetAlertService);

  projectForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]{2,}$/)]),
    skills: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z,\s]{2,}$/)]),
    url: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    let params = new HttpParams().set('limit', this.limit.toString()).set('page', this.page.toString());

    if (this.searchTitle) {
      params = params.set('title', this.searchTitle);
    }

    this.projectService.getProjects(params)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error("Error fetching projects:", error);
          this.alertService.toast("error", "Failed to load projects!");
          return [];
        })
      )
      .subscribe((res: any) => {
        this.projects = res.projects || [];
        this.totalPages = res.totalPages || 0;
      });
  }

  changePage(page: number): void {
    this.page = page;
    this.loadProjects();
  }

  editProject(index: number): void {
    this.isProjectUpdate = true;
    this.projectModal = true;
    this.project = { ...this.projects[index] };
    this.projectForm.patchValue(this.project);
  }

  toggleModal(): void {
    this.isProjectUpdate = false;
    this.projectModal = !this.projectModal;
    this.projectForm.reset();
  }

  async updateProject(id: string): Promise<void> {
    if (this.projectForm.invalid) {
      return this.alertService.toast("info", "Invalid Details!", 'top');
    }

    if (await this.alertService.confirm('Are you sure?', "Yes, Update", "No, Later")) {
      const params = new HttpParams().set('id', id);

      this.projectService.updateProject(this.projectForm.value, params)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          this.alertService.toast("success", res.message);
          this.toggleModal();
          this.loadProjects();
        });
    }
  }

  deleteProject(id: string): void {
    this.alertService.confirm('Are you sure?', "Yes, Delete", "No, Cancel").then((confirmed) => {
      if (confirmed) {
        const params = new HttpParams().set('id', id);

        this.projectService.deleteProject(params)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {
            this.alertService.toast("success", res.message);
            this.loadProjects();
          });
      }
    });
  }

  createProject(): void {
    if (this.projectForm.invalid) {
      return this.alertService.toast("info", "Invalid Details!", 'top');
    }

    this.projectService.createProject(this.projectForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.alertService.toast("success", res.message);
        this.toggleModal();
        this.loadProjects();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
