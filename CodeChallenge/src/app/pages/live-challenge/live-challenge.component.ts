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
import { CanDeactivatePage } from '../../core/guards/challengePage/restrict-challenge-page.guard';
import { SessionService } from '../../core/services/session/session.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-live-challenge',
  standalone: true,
  templateUrl: './live-challenge.component.html',
  styleUrl: './live-challenge.component.css',
})
export class LiveChallengeComponent implements OnInit, AfterViewInit,CanDeactivatePage {
  hasUnsavedChanges: boolean = true;
  projectUrl: SafeResourceUrl = '';
  activeSession:any
  projectService = inject(ProjectService);
  sessionService=inject(SessionService)
  router = inject(Router);
  sanitizer = inject(DomSanitizer);

  @ViewChild('editor', { static: false }) iframe!: ElementRef<HTMLIFrameElement>;

  ngOnInit(): void {
    const id: string = this.router.url.split('/').pop() || '';

    this.sessionService.getSession(id).subscribe((res: any) => {
         this.activeSession=res
         if(this.activeSession.status=='completed') this.router.navigate(['/response/ResponseSubmited'])
      this.projectUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.project.url);
    },(err:any)=>{
      this.router.navigate(['/notFound'])
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

  submitChallenge(){
    if(!confirm('sure to submit challenge')) return

    const params=new HttpParams().set('id',this.activeSession?._id)
     this.sessionService.updateSession({status:'completed'},params).subscribe((res:any)=>{
      alert(res.message)
      this.router.navigate(['/response/Thank You'])
     })

  }

  // ✅ Add this method for the CanDeactivate guard
  canDeactivate(): boolean {
     if(this.activeSession.status=='completed') return true
    return window.confirm('Are you sure you want to leave? Unsaved changes may be lost.');
  }
}
