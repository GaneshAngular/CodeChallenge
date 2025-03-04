import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-session-end',
  imports: [],
  templateUrl: './session-end.component.html',
  styleUrl: './session-end.component.css'
})
export class SessionEndComponent implements OnInit {
  title:string = ''

  ngOnInit(): void {
       this.title = location.href.split('/').pop()||'Not Found';
  }
}
