import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { ChartFullScreenService } from '../chart-full-screen.service';

@Component({
  selector: 'app-full-screen1',
  templateUrl: './full-screen1.component.html',
  styleUrls: ['./full-screen1.component.less']
})
export class FullScreen1Component implements OnInit, OnDestroy {

  public entryFlowList: any;

  @Output() public fullScreen1Complete: EventEmitter<any> = new EventEmitter();

  constructor(private chartFullScreenService: ChartFullScreenService) {
  }

  public ngOnInit() {
    this.chartFullScreenService.startTimer();
  }

  public ngOnDestroy() {
    this.chartFullScreenService.stopTimer();
  }

  /**
   * 点击地图上面的实时监控按钮
   * @param event
   */
  public onMapComplete(event) {
    this.fullScreen1Complete.emit(event);
  }
}
