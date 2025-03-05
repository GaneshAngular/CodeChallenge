import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number): string {
         const min=parseInt(value/60+"")
         const sec=value%60
    return `${min<10?'0':''}${min}:${sec<10?'0':''}${sec}`;
  }

}
