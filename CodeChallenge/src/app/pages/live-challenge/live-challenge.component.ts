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
import sdk, { VM } from '@stackblitz/sdk';
import { PreventCopyPasteDirective } from '../../shared/directives/prevent-copy-paste.directive';
import { SafeurlPipe } from '../../shared/pipes/safeurl/safeurl.pipe';

@Component({
  selector: 'app-live-challenge',
  standalone: true,
  imports: [TimePipe, SafeurlPipe],
  templateUrl: './live-challenge.component.html',
  styleUrl: './live-challenge.component.css',
})
export class LiveChallengeComponent
  implements OnInit, AfterViewInit, CanDeactivatePage, OnDestroy
{
  hasUnsavedChanges: boolean = true;
  projectUrl = '';
  activeSession: any;
  time: number = 0;
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  timerInterval: any;
  warningCount: number = 0;
  isChallengeCompleted: boolean = false;
  isSessionEnded: boolean = false;
  stackblitzVm: any;
  projectService = inject(ProjectService);
  sessionService = inject(SessionService);
  router = inject(Router);
  sanitizer = inject(DomSanitizer);
  socketService = inject(SocketIoService);
  @ViewChild('editor', { static: false })
  iframe!: ElementRef<HTMLIFrameElement>;
  vm!: VM;
  files: any;
  projectMeta: any;
  stackblitzData: any;
  stream:any


  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   if ((event.ctrlKey || event.metaKey) && event.key === 's') {
  //     this.saveProject();
  //   }
  // }

  // @HostListener('window:beforeunload', ['$event'])
  // onBeforeUnload(event:BeforeUnloadEvent): void {
  //   event.preventDefault()
  //      this.saveProject()
  //      alert("bbjfdfdfdvf")
  // }

  ngOnInit(): void {

   this.getVideoStream()
    const id: string = this.router.url.split('/').pop() || '';
    this.warningCount = 1;

    this.loadChallengeSession(id);
    this.socketService.getResponse('update-interview').subscribe((response) => {

      this.loadChallengeSession(id);
    });

  }
     getVideoStream(){
      navigator.mediaDevices.getUserMedia({
        video: { width: 300, height: 300 },
        audio: false
      })
      .then((stream: MediaStream) => {
        this.stream = stream;
        console.log(stream)

       this.sendVideoFrames(stream)
        const video = this.videoElement?.nativeElement;

        if (video) {
          video.srcObject = stream;

        } else {
          console.error("Video element not found");
        }
      })
      .catch(error => {
        console.error('Error accessing media devices:', error);
      });
     }

     sendVideoFrames(stream: MediaStream) {
       const video = this.videoElement?.nativeElement;
       if (!video) return;


      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const sendFrame = () => {
        if (!ctx) return;

        // Set canvas size same as video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw current video frame onto canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert frame to Base64
        const frameData = canvas.toDataURL("image/webp");
        console.log(frameData)
        this.socketService.sendData("stream", frameData);

        // Repeat every 100ms

        const frameLoad=setTimeout(sendFrame,33);
        if(this.activeSession.status=='completed'){
          clearTimeout(frameLoad)
        }
      };

      sendFrame()
    }

   loadChallengeSession(id: string) {
    this.sessionService.getSession(id).subscribe(
      async(res: any) => {
        this.activeSession = res;
        if (this.activeSession.status == 'completed') {
          this.isSessionEnded = true;
          this.router.navigate(['/response/ResponseSubmited']);
        } else {
          this.projectUrl = res.project.url;
          if (res.code) {
            await this.loadProject(res.code);
          } else {
            this.createNewProject(this.getProjectId(this.projectUrl));
          }

          // this.updateSession(id)
        }
      },
      (err: any) => {
        this.router.navigate(['/notFound']);
      }
    );
  }
 async loadProject(files: any) {
    this.files = files;
    console.log(this.files);
   this.vm=await sdk.embedProject(
      'editor',
      {
        files,
        title: this.activeSession.title,
        description: 'Dynamically forked from StackBlitz',
        template: this.detectProjectTemplate(this.files), // Set the correct template dynamically
      },
      {
        // forceEmbedLayout: true,
        // openFile: 'package.json',
        height: 672,
      }
    )

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

    // this.iframe.nativeElement.onload = () => {
    //   const iframeDoc = this.iframe.nativeElement;
    //   if (iframeDoc) {
    //     iframeDoc.addEventListener('copy', (event) => event.preventDefault());
    //     iframeDoc.addEventListener('cut', (event) => event.preventDefault());
    //     iframeDoc.addEventListener('paste', (event) => event.preventDefault());
    //     iframeDoc.addEventListener('contextmenu', (event) =>
    //       event.preventDefault()
    //     );
    //   }
    // };

    // document.addEventListener("visibilitychange", this.preventPageChange);
    this.timerInterval = setInterval(() => {
      this.time++;
    }, 1000);
  }

  submitChallenge() {
    if (!confirm('sure to submit challenge')) return;

    const params = new HttpParams().set('id', this.activeSession?._id);
    this.sessionService
      .updateSession({ status: 'completed', timetaken: this.time }, params)
      .subscribe((res: any) => {
        alert(res.message);
        this.isChallengeCompleted = true;
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
    return true;
  }

  ngOnDestroy() {
    // window.removeEventListener('beforeunload', (event: any) =>
    //   event.preventDefault()
    // );

  }

  getProjectId(url: string) {
    return url.split('/').pop()?.split('?')[0] || '';
  }

  getProjectFIles(projectID: string) {
    sdk
      .embedProjectId('editor', projectID)
      .then((vm: any) => {
        this.vm = vm;

        //  localStorage.setItem(projectID, JSON.stringify(this.files))
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  async createNewProject(projectId: string) {

    this.vm=await sdk
      .embedProjectId('editor', projectId, {
        forceEmbedLayout: true,
        openFile: 'package.json',
        height: 672,
      })


        this.files= await this.vm.getFsSnapshot()
          // Extract template dynamically based on project files or StackBlitz settings
          // const detectedTemplate = this.detectProjectTemplate(files);

          this.stackblitzData = {
            files:this.files,
            title: 'Forked StackBlitz Project',
            description: 'Dynamically forked from StackBlitz',
            template: this.detectProjectTemplate(this.files), // Set the correct template dynamically
          };




  }

  async saveProject() {
    let lastOpenFile = '';
   let file=await  this.vm.getFsSnapshot()
    // sdk
    //   .connect(document.getElementById('editor') as HTMLIFrameElement)
    //   .then((editor) => {
    //     this.vm=editor
    //     return editor.getFsSnapshot(); // Get latest files from the editor
    //   })
    //   .then((files) => {
    //     this.stackblitzData = {
    //       files,
    //       title: 'Updated StackBlitz Project',
    //       description: 'Project with latest changes',
    //       template:'node', // Ensure correct template
    //     };

    console.log('Saving updated files:', file); // Debugging
    const params = new HttpParams().set('id', this.activeSession._id);
     if(this.vm)
    this.sessionService
      .updateSession({ code:file }, params)
      .subscribe((res: any) => {
        console.log(res);
      },(err:any)=>console.log(err));
  }

  // Function to detect StackBlitz template
  detectProjectTemplate(files: any): any {
    if (files['angular.json']) return 'angular-cli';
    if (files['package.json'] && files['package.json'].includes('"react"'))
      return 'create-react-app';
    if (files['index.html'] && files['script.js']) return 'html';
    if (files['index.js']) return 'javascript';
    if (files['server.js'] || files['index.ts']) return 'node';
    if (files['tsconfig.json']) return 'typescript';
    if (files['polymer.json']) return 'polymer';
    if (files['vue.config.js']) return 'vue';
    return 'javascript'; // Default fallback
  }
}
