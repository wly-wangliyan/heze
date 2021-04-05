import { Component } from '@angular/core';
import { RealTimeFlowComponent } from './real-time-flow/real-time-flow.component';
import { ParkingFillingRateComponent } from './parking-filling-rate/parking-filling-rate.component';

@Component({
  selector: 'app-period-time-statistics',
  templateUrl: './period-time-statistics.component.html',
  styleUrls: ['./period-time-statistics.component.css', '../../../../assets/less/tab-bar.less']
})
export class PeriodTimeStatisticsComponent {

  public currentComponent = 'RealTimeFlowComponent'; // 流量与填充率公用一个

  public onNavigatedToRealTimeClick() {
    if (this.currentComponent === 'RealTimeFlowComponent') {
      return;
    }
    this.currentComponent = 'RealTimeFlowComponent';
  }

  public onNavigatedToDataClick() {
    if (this.currentComponent === 'RealTimeDataComponent') {
      return;
    }
    this.currentComponent = 'RealTimeDataComponent';
  }

  /**
   * 当前激活的路由组件
   * @param component 组件类型
   */
  public onActivate(component: any) {
    if (component instanceof RealTimeFlowComponent) {
      this.onNavigatedToRealTimeClick();
    } else if (component instanceof ParkingFillingRateComponent) {
      this.onNavigatedToRealTimeClick();
    } else {
      this.onNavigatedToDataClick();
    }
  }
}
