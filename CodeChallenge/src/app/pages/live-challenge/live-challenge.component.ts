import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../core/services/project/project.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-live-challenge',
  standalone: true,
  templateUrl: './live-challenge.component.html',
  styleUrl: './live-challenge.component.css',
})
export class LiveChallengeComponent implements OnInit, AfterViewInit {
  hasUnsavedChanges: boolean = false;
  projectUrl: SafeResourceUrl = '';
  projectService = inject(ProjectService);
  router = inject(Router);
  sanitizer = inject(DomSanitizer);

  @ViewChild('editor', { static: false }) iframe!: ElementRef<HTMLIFrameElement>;

  ngOnInit(): void {
    const id: string = this.router.url.split('/').pop() || '';
    this.projectService.getProject(id).subscribe((res: any) => {
      this.projectUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);
    });
  }

  ngAfterViewInit() {
    this.iframe.nativeElement.onload = () => {
      const iframeDoc = this.iframe.nativeElement.contentDocument;
      if (iframeDoc) {
        iframeDoc.addEventListener('copy', (event) => event.preventDefault());
        iframeDoc.addEventListener('cut', (event) => event.preventDefault());
        iframeDoc.addEventListener('paste', (event) => event.preventDefault());
        iframeDoc.addEventListener('contextmenu', (event) =>
          event.preventDefault()
        );
      }
    };
  }

  // ✅ Add this method for the CanDeactivate guard
  canDeactivate(): boolean {
    console.log('🚀 canDeactivate() called in LiveChallengeComponent'); // Debugging log
    return confirm('Are you sure you want to leave? Unsaved changes may be lost.');
  }
}
