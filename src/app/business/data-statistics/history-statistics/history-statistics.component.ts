import { Component } from '@angular/core';
import { TurnoverRateComponent } from './turnover-rate/turnover-rate.component';
import { OnlineRateComponent } from './online-rate/online-rate.component';
import { HistoryFlowComponent } from './history-flow/history-flow.component';

@Component({
  selector: 'app-history-statistics',
  templateUrl: './history-statistics.component.html',
  styleUrls: ['./history-statistics.component.css', '../../../../assets/less/tab-bar.less'],
})
export class HistoryStatisticsComponent {
  public currentComponent = 'HistoryFlowComponent'; // 流量与填充率公用一个
  public isHistoryComponent = false;

  public onNavigatedToHistoryFlowClick() {
    if (this.currentComponent === 'HistoryFlowComponent') {
      return;
    }
    this.currentComponent = 'HistoryFlowComponent';
  }

  public onNavigatedToHistoryDataClick() {
    if (this.currentComponent === 'HistoryDataComponent') {
      return;
    }
    this.currentComponent = 'HistoryDataComponent';
  }

  /**
   * 当前激活的路由组件
   * @param component 组件类型
   */
  public onActivate(component: any) {
    if (component instanceof TurnoverRateComponent ||
      component instanceof OnlineRateComponent ||
      component instanceof HistoryFlowComponent) {
      this.onNavigatedToHistoryFlowClick();
      this.isHistoryComponent = false;
    }
    // else if (component instanceof HistoryDataComponent) {
    //   this.onNavigatedToHistoryDataClick();
    //   this.isHistoryComponent = true;
    // }
  }
}
