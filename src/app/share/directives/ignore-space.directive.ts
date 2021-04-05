import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appIgnoreSpace]'
})
export class IgnoreSpaceDirective {

  @HostListener('keydown', ['$event'])
  public onKeyDown(event: any) {
    const keyCode = event.which;
    if (keyCode === 32) {
      // 32为空格键,当按下空格键是跳过
      event.preventDefault();
    }
  }
}
