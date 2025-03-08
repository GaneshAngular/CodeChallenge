import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPreventCopyPaste]'
})
export class PreventCopyPasteDirective {

  @HostListener('copy', ['$event'])
  @HostListener('cut', ['$event'])
  @HostListener('paste', ['$event'])
  @HostListener('contextmenu', ['$event']) // Disable right-click
  onEvent(event: Event) {
    event.preventDefault();
  }

}
