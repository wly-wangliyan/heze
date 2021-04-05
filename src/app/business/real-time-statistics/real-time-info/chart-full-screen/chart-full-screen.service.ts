import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';

@Injectable({
  providedIn: 'root'
})
export class ChartFullScreenService {

  private count = 0;
  private timerSubscription: Subscription;
  private _timer_5seconds: EventEmitter<any> = new EventEmitter();
  private _timer_1minutes: EventEmitter<any> = new EventEmitter();
  private _timer_5minutes: EventEmitter<any> = new EventEmitter();

  constructor(private globalService: GlobalService) {
  }

  public get timer_5seconds(): Observable<any> {
    return this._timer_5seconds.asObservable();
  }

  public get timer_1minutes(): Observable<any> {
    return this._timer_1minutes.asObservable();
  }

  public get timer_5minutes(): Observable<any> {
    return this._timer_5minutes.asObservable();
  }

  /**
   * 启动timer
   */
  public startTimer() {
    this.timerSubscription && this.timerSubscription.unsubscribe();
    this.timerSubscription = interval(1000 * 5).subscribe(() => {
      // 每5s触发一次数据刷新
      this.count++;

      this._timer_5seconds.emit();

      if (this.count * 5 % 60 === 0) {
        this._timer_1minutes.emit();
      }

      if (this.count * 5 % (60 * 5) === 0) {
        this._timer_5minutes.emit();
      }
    });
  }

  /**
   * 停止timer
   */
  public stopTimer() {
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }
}
