import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { SessionService } from '../../core/services/session/session.service';
import sdk, { VM } from '@stackblitz/sdk';
import { SocketIoService } from '../../core/services/socket.io/socket.io.service';
import { HttpParams } from '@angular/common/http';
import { SweetAlertService } from '../../core/services/sweet-alert/sweet-alert.service';
@Component({
  selector: 'app-track-session',
  imports: [],
  templateUrl: './track-session.component.html',
  styleUrl: './track-session.component.css',
})
export class TrackSessionComponent {
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;
  sessionService = inject(SessionService);
  activeSession: any;
  alertService=inject(SweetAlertService);
  socketService=inject(SocketIoService)
  vm!: VM;
  files={};
  ngAfterViewInit() {
    const id = location.href.split('/').pop() || '';
    this.loadSession(id);
    console.log(this.iframe.nativeElement);

  }

  loadSession(id: string) {
    this.sessionService.getSession(id).subscribe((res: any) => {
      console.log(res);
      this.activeSession = res;
      this.files=res.code
      this.socketService.getResponse(this.activeSession._id).subscribe(async(data:any)=>{
        this.files=data
        // console.log(Object.keys(this.files))
        await  this.vm.applyFsDiff({create:data,destroy:[]})
      })
      this.embbedProject(this.activeSession.code);
    });
  }

  async embbedProject(files: any) {
    //  this.files=this.activeSession.code
    this.vm = await sdk.embedProject(
      "iframe",
      {
        files,
        title: this.activeSession.title,
        description: 'Track Session',
        template:this.detectProjectTemplate(files),
      },
      {
        forceEmbedLayout: true,
        // openFile: 'package.json',
        height: 700,
        width: '100%',
      }
    );
  }

  async saveProject() {
    const params=new HttpParams().set('id', this.activeSession._id)
    const newFiles:any=await this.vm.getFsSnapshot()
       this.sessionService.updateSession({code:newFiles},params).subscribe((res:any)=>{
           this.alertService.toast("success","saved ")
           this.files={...newFiles}
       },(err:any)=>{

       })
  }

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
