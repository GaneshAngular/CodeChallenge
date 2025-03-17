import { Component, ElementRef, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InterviewerService } from '../../core/services/interviewer/interviewer.service';
import { CommonModule } from '@angular/common';
import { CODE_CHALLENGE_URL } from '../../core/constants/API';
import { CHALLENGE_SCORE } from '../../core/constants/type.constant';
import { ProjectService } from '../../core/services/project/project.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionService } from '../../core/services/session/session.service';
import { HttpParams } from '@angular/common/http';
import { io } from 'socket.io-client';
import { SocketIoService } from '../../core/services/socket.io/socket.io.service';
import { TimePipe } from '../../shared/pipes/timeconverter/time.pipe';

@Component({
  selector: 'app-live-interview',
  imports: [CommonModule,FormsModule,ReactiveFormsModule,TimePipe],
templateUrl: './live-interview.component.html',
  styleUrl: './live-interview.component.css'
})
export class LiveInterviewComponent implements OnInit {

   router=inject(Router)
   interview:any
   projects:any
   challengeScore=CHALLENGE_SCORE
   challengeStatus=['in-progress','completed']
   sessionModel=false
   codechallengeUrl=CODE_CHALLENGE_URL
   interviewService=inject(InterviewerService)
   projectService=inject(ProjectService)
   sessionService=inject(SessionService)
   socketService=inject(SocketIoService)
   videoData:any=[]
   stream:any
@ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
@ViewChild('img') img!: ElementRef<HTMLImageElement>;
@ViewChild('canvas') remoteVideoCanvas!: ElementRef<HTMLCanvasElement>;



  sessionForm=new FormGroup({
      title:new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z0-9\s]{2,}$/)]),
      project:new FormControl('',[Validators.required]),
    })
  ngOnInit(): void {
//     document.addEventListener('copy', (event) => event.preventDefault());
// document.addEventListener('cut', (event) => event.preventDefault());
// document.addEventListener('paste', (event) => event.preventDefault());
 // Disable right-click


    const url=this.router.url.split('/')
    const id:string=url.pop()||''
    this.loadInterview(id)
    this.socketService.getResponse('update-interview').subscribe((data:any)=>{
    this.loadInterview(id)
    })
    this.socketService.sendData('join',"67c041867011dbdbcd8cedba")

    this.socketService.getResponse('stream').subscribe((stream:any)=>{


      // this.stream=stream

      // this.videoData.push(stream)
      // this.videoElement.nativeElement.src = stream;
        // this.displayRemoteVideo()
        this.displayImageFrame(stream)
    })


  }
  displayRemoteVideo() {
    const videoElement = this.videoElement.nativeElement;
    if (!videoElement) return;

    if (this.videoData.length > 0) {
      const frame = this.videoData.shift(); // Get the first frame
      if (frame) {
        videoElement.src = frame; // Update video source
      }
    }

    setTimeout(() => this.displayRemoteVideo(), 1); // Refresh every 100ms
  }

  displayImageFrame(frame: string) {
    console.log(frame)
    const canvas = this.remoteVideoCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = frame;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Clear previous frame to reduce flickering
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }

  toggleModal(){
    this.sessionModel=!this.sessionModel;
  }

  loadProjects(){
    this.projectService.getProjects().subscribe((res:any)=>{
      this.projects=res.projects
      this.socketService.sendData('date',"Hello from client")
    })
 }

updateChallengeSession($event:any,id:string){
  if(!confirm('Are you sure to complete the challenge?')) return
  const params=new HttpParams().set('id',id)
  this.sessionService.updateSession({status:$event.target.value},params).subscribe((res:any)=>{
    alert(res.message)
    this.loadInterview(this.interview._id)
  })
}



  loadInterview(id:string){
        this.interviewService.getInterview(id).subscribe((res:any)=>{
          this.interview=res
       this.loadProjects()

        },(err:any)=>{
          this.router.navigate(['/notFound'])
        })
  }

  createSession(){
    if(this.sessionForm.invalid) return alert("Invalid Details..!")

    this.sessionService.createSession(this.sessionForm.value).subscribe((res:any)=>{
      alert(res.message)
      this.toggleModal()
      const params=new HttpParams().set('id',this.interview._id)
      this.interviewService.updateSession({sessions:[res.data._id]},params).subscribe((res:any)=>{
        this.loadInterview(this.interview._id)
      })
      this.sessionForm.reset()
    })

  }

  updatedScore($event:any,id:string){
     if(!confirm("Are you sure to update")) return
    const params=new HttpParams().set('id',id)
      this.sessionService.updateSession({score:$event.target.value},params).subscribe((res:any)=>{
        alert(res.message)
        this.loadInterview(this.interview._id)
      })
  }

  endSession(){
    if(!confirm('Are you sure to end session?')) return
    const params=new HttpParams().set('id',this.interview._id)
    this.interviewService.updateInterview({status:"completed"},params).subscribe((res:any)=>{
      alert(res.message)
      this.router.navigate(['/api/dashboard/interviews'])
    })
  }

  copyLink(url:string){
    navigator.clipboard.writeText(url);
    alert("link copied to clipboard")
  }
  ngOnDestroy(){
    
    this.socketService.socket.disconnect()
  }

}
