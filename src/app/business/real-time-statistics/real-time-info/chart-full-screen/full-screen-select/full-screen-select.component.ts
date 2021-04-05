import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-full-screen-select',
  templateUrl: './full-screen-select.component.html',
  styleUrls: ['./full-screen-select.component.css']
})
export class FullScreenSelectComponent {
  @ViewChild('fullScreenContainer', { static: false }) public fullScreenContainer: ElementRef;
  @Output() public fullScreenSelect: EventEmitter<number> = new EventEmitter();

  public fullScreenHoverNumber = 1;
  public fullScreenList = [1, 2, 3, 4];

  public onFullScreenSelect(type: number) {
    this.fullScreenSelect.emit(type);
  }

  public fullScreenBgStyle() {
    if (this.fullScreenHoverNumber === null || this.fullScreenHoverNumber === undefined) {
      this.fullScreenHoverNumber = 1;
    }
    return {
      background: `#011428 url(/assets/images/screen/full_screen${this.fullScreenHoverNumber}.png) no-repeat`
    };
  }

}
