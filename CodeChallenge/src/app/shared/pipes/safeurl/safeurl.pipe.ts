import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeurl'
})
export class SafeurlPipe implements PipeTransform {
santizer=inject(DomSanitizer)
  transform(url: string,): SafeResourceUrl {

    return this.santizer.bypassSecurityTrustResourceUrl(url);
  }

}
