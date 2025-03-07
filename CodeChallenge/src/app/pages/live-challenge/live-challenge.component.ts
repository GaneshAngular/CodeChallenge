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
import { DatePipe } from '@angular/common';
import { TimePipe } from '../../shared/pipes/timeconverter/time.pipe';
import stackblitz from '@stackblitz/sdk';

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
  modifiedProjectUrl: string = '';
  projectService = inject(ProjectService);
  sessionService = inject(SessionService);
  router = inject(Router);
  sanitizer = inject(DomSanitizer);
  socketService = inject(SocketIoService);
  @ViewChild('editor', { static: false })
  iframe!: ElementRef<HTMLIFrameElement>;

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
    event.returnValue = ''; // This triggers the browser's confirmation dialog
  }

  ngOnInit(): void {
    const id: string = this.router.url.split('/').pop() || '';
    this.warningCount = 1;
    this.loadChallengeSession(id);
    this.socketService.getResponse('update-interview').subscribe((response) => {
      this.loadChallengeSession(id);
    });
    // window.addEventListener('message', this.handleStackBlitzChanges);
  }

  loadChallengeSession(id: string) {
    this.sessionService.getSession(id).subscribe(
      (res: any) => {
        this.activeSession = res;
        if (this.activeSession.status == 'completed') {
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

  // handleStackBlitzChanges = async (event: MessageEvent) => {
  //   if (event.origin.includes('stackblitz.com')) {
  //     console.log('Candidate made changes:', event.data);

  //     // Fork the project and get a new link
  //     this.getFilesFromStackBlitz();
  //   }
  // };

  // async getFilesFromStackBlitz() {
  //   try {
  //     const vm = await stackblitz.embedProject('your-project-id', {
  //       openFile: 'src/main.ts',
  //       height: 600,
  //       width: '100%'
  //     });

  //     const files = await vm.getFsSnapshot(); // Get modified files
  //     this.projectFiles = files;
  //     console.log('Modified Files:', files);

  //     // Create a new project with the modified files
  //     this.createNewProject(files);
  //   } catch (error) {
  //     console.error('Error fetching project files:', error);
  //   }
  // }

  // async createNewProject(files: any) {
  //   const newProject = {
  //     files: files,
  //     title: 'Candidate Modified Project',
  //     description: 'This project contains modifications made by the candidate.',
  //     template: 'javascript'
  //   };

  //   const newProjectInstance = await stackblitz.openProject(newProject);
  //   this.modifiedProjectUrl = newProjectInstance.url;
  //   console.log('New Project Link:', this.modifiedProjectUrl);
  // }

  updateSession(id: string) {
    const params = new HttpParams().set('id', id);
    this.sessionService
      .updateSession({ status: 'in-progess' }, params)
      .subscribe((res: any) => {});
  }

  ngAfterViewInit() {
    window.addEventListener('beforeunload', (event: any) =>
      event.preventDefault()
    );

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
    // document.addEventListener("visibilitychange", this.preventPageChange);
    this.timerInterval = setInterval(() => {
      this.time++;
      console.log(this.time);
    }, 1000);
  }

  // preventPageChange() {
  //   if (document.hidden) {
  //     alert('hellololo');
  //     // this.submitChallenge()
  //   }
  // }

  submitChallenge() {
    if (!confirm('sure to submit challenge')) return;

    const params = new HttpParams().set('id', this.activeSession?._id);
    this.sessionService
      .updateSession({ status: 'completed', timetaken: this.time }, params)
      .subscribe((res: any) => {
        alert(res.message);
        this.loadChallengeSession(this.activeSession._id);
        this.router.navigate(['/response/Thank You']);
      });
    clearInterval(this.timerInterval);
  }

  // ✅ Add this method for the CanDeactivate guard
  canDeactivate(): boolean {
    if (this.activeSession.status == 'completed') return true;
    return window.confirm(
      'Are you sure you want to leave? Unsaved changes may be lost.'
    );
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', (event: any) =>
      event.preventDefault()
    );
  }
}
