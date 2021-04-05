import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-prompt-box',
  templateUrl: './prompt-box.component.html',
  styleUrls: ['./prompt-box.component.css']
})
export class PromptBoxComponent implements AfterViewInit {

  private callback: any;
  private delaySubscription: Subscription;

  @Input() public message: string;

  @ViewChild('promptDiv', { static: false }) public promptDiv: ElementRef;

  public ngAfterViewInit() {
    $(this.promptDiv.nativeElement).on('hidden.bs.modal', () => {
      if (this.callback) {
        const temp = this.callback;
        this.callback = null;
        this.delaySubscription && this.delaySubscription.unsubscribe();
        this.delaySubscription = null;
        temp();
      }
    });
  }

  public close() {
    this.delaySubscription && this.delaySubscription.unsubscribe();
    $(this.promptDiv.nativeElement).modal('hide');
  }

  /**
   * 弹出提示框
   * @param msg 消息
   * @param delay 延迟关闭时间(-1为不自动关闭,默认两秒)
   * @param closeFunc 关闭后的回调
   */
  public open(msg: string, closeFunc: any = null, delay: number = 2000) {
    timer(0).subscribe(() => {
      this.message = msg;
      $(this.promptDiv.nativeElement).modal('show');
    });
    this.callback = closeFunc;
    if (delay !== -1) {
      this.delaySubscription = timer(delay).subscribe(() => {
        this.close();
      });
    }
  }
}
