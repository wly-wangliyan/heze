import { Component } from '@angular/core';

@Component({
  selector: 'app-real-time-info',
  templateUrl: './real-time-info.component.html',
  styleUrls: ['./real-time-info.component.less']
})
export class RealTimeInfoComponent {
  public showSelector = true; // 显示选择器

  public onDetailDoubleClick(event: any) {
    event.stopPropagation();
  }
}
