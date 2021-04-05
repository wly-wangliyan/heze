import {Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, Subscription} from 'rxjs/index';
import {debounceTime} from 'rxjs/internal/operators';

@Directive({
  selector: '[appZDebounceClick]'
})
export class ZDebounceClickDirective implements OnInit, OnDestroy {
  /**
   * 默认防抖时间500ms
   */
  @Input() debounceTime = 500;

  /**
   * 点击事件
   */
  @Output('appZDebounceClick') debounceClick = new EventEmitter();
  private clickSubject = new Subject<any>();
  private clickSubscription: Subscription;

  constructor() {
  }

  ngOnInit() {
    // 去抖动处理，将它重新发送回父节点
    this.clickSubscription = this.clickSubject.pipe(debounceTime(this.debounceTime)).subscribe(e => this.debounceClick.emit(e));
  }

  ngOnDestroy() {
    this.clickSubscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event: MouseEvent) {
    event.stopPropagation();
    this.clickSubject.next(event);
  }
}
