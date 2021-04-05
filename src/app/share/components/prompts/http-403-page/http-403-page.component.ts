import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-http-403-page',
  templateUrl: './http-403-page.component.html',
  styleUrls: ['./http-403-page.component.css']
})
export class Http403PageComponent {

  constructor(private renderer2: Renderer2) {
  }

  public noPermissionMessage = '对不起您没有权限,请联系管理员开通权限！';

  @ViewChild('pageDiv', { static: false }) public pageDiv: ElementRef;

  private noPermissionFlag = false;

  public get http403Flag(): boolean {
    return this.noPermissionFlag;
  }

  @Input()
  public set http403Flag(flag: boolean) {
    this.renderer2.setStyle(this.pageDiv.nativeElement, 'display', flag ? 'block' : 'none');
    this.noPermissionFlag = flag;
    this.displayStateChanged.emit({ displayState: flag });
  }

  @Output() public displayStateChanged = new EventEmitter();
}
