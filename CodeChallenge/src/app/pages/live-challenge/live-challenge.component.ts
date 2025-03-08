import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
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
import { SocketIoService } from '../../core/services/socket.io/socket.io.service';
import { TimePipe } from '../../shared/pipes/timeconverter/time.pipe';
import sdk from '@stackblitz/sdk';
import { PreventCopyPasteDirective } from '../../shared/directives/prevent-copy-paste.directive';

@Component({
  selector: 'app-live-challenge',
  standalone: true,
  imports: [TimePipe],
  templateUrl: './live-challenge.component.html',
  styleUrl: './live-challenge.component.css',
})
export class LiveChallengeComponent
  implements OnInit, AfterViewInit, CanDeactivatePage, OnDestroy
{
  hasUnsavedChanges: boolean = true;
  projectUrl: SafeResourceUrl = '';
  activeSession: any;
  time: number = 0;
  timerInterval: any;
  warningCount: number = 0;
  isChallengeCompleted: boolean = false;
  isSessionEnded: boolean = false;
  stackblitzVm:any
  projectService = inject(ProjectService);
  sessionService = inject(SessionService);
  router = inject(Router);
  sanitizer = inject(DomSanitizer);
  socketService = inject(SocketIoService);
  @ViewChild('editor', { static: false })
  iframe!: ElementRef<HTMLIFrameElement>;






  ngOnInit(): void {
    const id: string = this.router.url.split('/').pop() || '';
    this.warningCount = 1;
    this.loadChallengeSession(id);
    this.socketService.getResponse('update-interview').subscribe((response) => {
      this.loadChallengeSession(id);
    });
    this.updateSession(id)
    // window.addEventListener('message', this.handleStackBlitzChanges);
  }


  loadChallengeSession(id: string) {
    this.sessionService.getSession(id).subscribe(
      (res: any) => {
        this.activeSession = res;
        if (this.activeSession.status == 'completed') {
          this.isSessionEnded=true
          this.router.navigate(['/response/ResponseSubmited']);
        } else {
          this.projectUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            res.project.url
          );

          // this.updateSession(id)
        }
      },
      (err: any) => {
        this.router.navigate(['/notFound']);
      }
    );
  }


  updateSession(id: string) {
    const params = new HttpParams().set('id', id);
    this.sessionService
      .updateSession({ status: 'in-progess' }, params)
      .subscribe((res: any) => {});
  }

  ngAfterViewInit() {
    // window.addEventListener('beforeunload', (event: any) =>
    //   event.preventDefault()
    // );

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
    sdk.embedProjectId(this.iframe.nativeElement, 'python-pgx4avs1', {
      openFile: 'index.js', // Default file
      height: 800
    }).then(vm => {
      this.stackblitzVm = vm; // Store the VM instance for later use
    });



    // document.addEventListener("visibilitychange", this.preventPageChange);
    this.timerInterval = setInterval(() => {
      this.time++;

    }, 1000);
  }

  //

  submitChallenge() {
    if (!confirm('sure to submit challenge')) return;

    const params = new HttpParams().set('id', this.activeSession?._id);
    this.sessionService
      .updateSession({ status: 'completed', timetaken: this.time }, params)
      .subscribe((res: any) => {
        alert(res.message);
        this.isChallengeCompleted=true
        this.loadChallengeSession(this.activeSession._id);
        this.router.navigate(['/response/Thank You']);
      });
    clearInterval(this.timerInterval);
  }

  // ✅ Add this method for the CanDeactivate guard
  canDeactivate(): boolean {
    // if (this.activeSession.status == 'completed') return true;
    // return window.confirm(
    //   'Are you sure you want to leave? Unsaved changes may be lost.'
    // );
    return true
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', (event: any) =>
      event.preventDefault()
    );
  }





}
