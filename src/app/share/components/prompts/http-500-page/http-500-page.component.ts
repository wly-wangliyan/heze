import { Component, ViewChild, ElementRef, Output, EventEmitter, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-http-500-page',
  templateUrl: './http-500-page.component.html',
  styleUrls: ['./http-500-page.component.css']
})
export class Http500PageComponent {

  constructor(private renderer2: Renderer2) {
  }

  private fiveHundredFlag = false;

  @ViewChild('pageDiv', { static: false }) public pageDiv: ElementRef;

  public set http500Flag(flag: boolean) {
    this.renderer2.setStyle(this.pageDiv.nativeElement, 'display', flag ? 'block' : 'none');
    this.fiveHundredFlag = flag;
    this.displayStateChanged.emit({ displayState: flag });
  }

  public get http500Flag(): boolean {
    return this.fiveHundredFlag;
  }

  @Output() public displayStateChanged = new EventEmitter();

  public goBack() {
    history.back();
  }
}
