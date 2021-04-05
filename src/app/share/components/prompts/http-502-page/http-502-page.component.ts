import { Component, ElementRef, EventEmitter, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-http-502-page',
  templateUrl: './http-502-page.component.html',
  styleUrls: ['./http-502-page.component.css']
})
export class Http502PageComponent {

  constructor(private renderer2: Renderer2) {
  }

  private fiveHundredTwoFlag = false;

  @ViewChild('pageDiv', { static: false }) public pageDiv: ElementRef;

  public set http502Flag(flag: boolean) {
    this.renderer2.setStyle(this.pageDiv.nativeElement, 'display', flag ? 'block' : 'none');
    this.fiveHundredTwoFlag = flag;
    this.displayStateChanged.emit({ displayState: flag });
  }

  public get http502Flag(): boolean {
    return this.fiveHundredTwoFlag;
  }

  @Output() public displayStateChanged = new EventEmitter();

  public goBack() {
    history.back();
  }

}
