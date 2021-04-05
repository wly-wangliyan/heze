import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable, timer } from 'rxjs';

@Component({
  selector: 'app-confirmation-box',
  templateUrl: './confirmation-box.component.html',
  styleUrls: ['./confirmation-box.component.css']
})
export class ConfirmationBoxComponent implements AfterViewInit {

  private sureCallback: any;
  private closeCallback: any;

  @Input() public message: string;

  @Input() public sureName: string;

  @ViewChild('promptDiv', { static: false }) public promptDiv: ElementRef;

  public ngAfterViewInit() {
    $(this.promptDiv.nativeElement).on('hidden.bs.modal', () => {
      if (this.closeCallback) {
        const temp = this.closeCallback;
        this.closeCallback = null;
        this.sureCallback = null;
        temp();
      }
    });
  }

  public submit() {
    if (this.sureCallback) {
      const temp = this.sureCallback;
      this.closeCallback = null;
      this.sureCallback = null;
      temp();
    }
  }

  public close() {
    $(this.promptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param message 消息体
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(message: string, sureFunc: any, sureName: string = '确定', closeFunc: any = null) {
    this.message = message;
    this.sureName = sureName;
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    timer(0).subscribe(() => {
      $(this.promptDiv.nativeElement).modal('show');
    });
  }
}
