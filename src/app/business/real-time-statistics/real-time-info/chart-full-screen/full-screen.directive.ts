import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appFullScreen]'
})
export class FullScreenDirective {

  constructor(public viewContainerRef: ViewContainerRef) {
  }

}
