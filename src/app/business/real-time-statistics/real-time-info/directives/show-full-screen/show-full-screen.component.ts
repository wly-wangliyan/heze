import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-show-full-screen',
  templateUrl: './show-full-screen.component.html',
  styleUrls: ['./show-full-screen.component.css']
})
export class ShowFullScreenComponent {

  @ViewChild('fullScreenContainer', { static: false }) public fullScreenContainer: ElementRef;

  // @ViewChild('videoMonitorComponent', {static: true}) public videoMonitorComponent: VideoMonitorComponent;

  public isFullScreen = false;
  public isAllScreen = true; // 是否显示全部屏幕

  /**
   * 打开视频
   * @param event
   */
  public fullScreen1Complete(event) {
    // this.videoMonitorComponent.openVideoMonitor(event.parking.parking_id, event.dataList)
  }

}
