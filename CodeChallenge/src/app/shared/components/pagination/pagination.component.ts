import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule,FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnInit ,OnChanges{

  @Output()sendPage:EventEmitter<number> = new EventEmitter();

  @Input() totalPages=0
  @Input() page:number=0

  pages:any=[]
  currantPage=1
  ngOnInit(): void {
  this.generatePageNumbers()
       this.currantPage=this.page
  }
  ngOnChanges(){

    this.generatePageNumbers()
  }
  generatePageNumbers() {
    this.pages = Array(this.totalPages).fill(0).map((_, i) => i +1);

  }

  viewPage(page:number){
    this.currantPage=page
    this.sendPage.emit(page)
  }

  previousPage(){
    if(this.currantPage>1)
       this.viewPage(this.currantPage-1)
  }
  nextPage(){
    if(this.currantPage<this.totalPages)
       this.viewPage(this.currantPage+1)
  }

}
