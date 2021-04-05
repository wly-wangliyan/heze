import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { FormsModule } from '@angular/forms';

import { RealTimeStatisticsRoutingModule } from './real-time-statistics-routing.module';
import { RealTimeStatisticsComponent } from './real-time-statistics.component';
import { RealTimeInfoComponent } from './real-time-info/real-time-info.component';
import { ParkingStateComponent } from './parking-state/parking-state.component';
import { ParkingStateSimpleComponent } from './parking-state-simple/parking-state-simple.component';
// 实时数据图表
import { ChartOnlineStateComponent } from './real-time-info/chart-online-state/chart-online-state.component';
import { ChartParkingUtilizationRateComponent } from './real-time-info/chart-parking-utilization-rate/chart-parking-utilization-rate.component';
import { ChartFlowComponent } from './real-time-info/chart-flow/chart-flow.component';
import { ChartFlowDistributionComponent } from './real-time-info/chart-flow-distribution/chart-flow-distribution.component';
import { ChartUserTypeRatioComponent } from './real-time-info/chart-user-type-ratio/chart-user-type-ratio.component';
import { ChartMonitorComponent } from './real-time-info/chart-monitor/chart-monitor.component';
import { TopStatisticsComponent } from './real-time-info/top-statistics/top-statistics.component';
// 大数据投屏图表
import { ChartFullScreenComponent } from './real-time-info/chart-full-screen/chart-full-screen.component';
import { FullScreenDirective } from './real-time-info/chart-full-screen/full-screen.directive';
import { FullScreen1Component } from './real-time-info/chart-full-screen/full-screen1/full-screen1.component';
import { FullScreenSelectComponent } from './real-time-info/chart-full-screen/full-screen-select/full-screen-select.component';
import { ShowFullScreenComponent } from './real-time-info/directives/show-full-screen/show-full-screen.component';
import { ShowFullScreenDblclickDirective } from './real-time-info/directives/show-full-screen-dblclick.directive';
import { FullScreenContainerComponent } from './real-time-info/chart-full-screen/full-screen-container/full-screen-container.component';

// 热力图
import { ThermodynamicChartComponent } from './thermodynamic-chart/thermodynamic-chart.component';
import { CitySelectComponent } from './thermodynamic-chart/components/city-select/city-select.component';
import { ParkingSelectComponent } from './thermodynamic-chart/components/parking-select/parking-select.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FullScreenItemComponent } from './real-time-info/chart-full-screen/components/full-screen-item/full-screen-item.component';
import { LeftOneComponent } from './real-time-info/chart-full-screen/components/left-one/left-one.component';
import { LeftTwoComponent } from './real-time-info/chart-full-screen/components/left-two/left-two.component';
import { LeftThreeComponent } from './real-time-info/chart-full-screen/components/left-three/left-three.component';
import { LeftFourComponent } from './real-time-info/chart-full-screen/components/left-four/left-four.component';
import { LeftFiveComponent } from './real-time-info/chart-full-screen/components/left-five/left-five.component';
import { RightOneComponent } from './real-time-info/chart-full-screen/components/right-one/right-one.component';
import { RightTwoComponent } from './real-time-info/chart-full-screen/components/right-two/right-two.component';
import { RightThreeComponent } from './real-time-info/chart-full-screen/components/right-three/right-three.component';
import { RightFourComponent } from './real-time-info/chart-full-screen/components/right-four/right-four.component';
import { RightFiveComponent } from './real-time-info/chart-full-screen/components/right-five/right-five.component';
import { RightSixComponent } from './real-time-info/chart-full-screen/components/right-six/right-six.component';

@NgModule({
  declarations: [
    RealTimeStatisticsComponent,
    RealTimeInfoComponent,
    ChartOnlineStateComponent,
    ChartParkingUtilizationRateComponent,
    ChartFlowComponent,
    ChartFlowDistributionComponent,
    ChartUserTypeRatioComponent,
    ChartMonitorComponent,
    TopStatisticsComponent,
    ChartFullScreenComponent,
    FullScreenDirective,
    ShowFullScreenComponent,
    FullScreen1Component,
    FullScreenSelectComponent,
    ChartUserTypeRatioComponent,
    ChartFlowDistributionComponent,
    ParkingStateComponent,
    ParkingStateSimpleComponent,
    // 全屏相关
    ShowFullScreenDblclickDirective,
    ShowFullScreenComponent,
    ChartFullScreenComponent,
    FullScreen1Component,
    FullScreenDirective,
    FullScreenSelectComponent,
    FullScreenContainerComponent,

    // 热力图
    ThermodynamicChartComponent,
    CitySelectComponent,
    ParkingSelectComponent,
    FullScreenItemComponent,
    LeftOneComponent,
    LeftTwoComponent,
    LeftThreeComponent,
    LeftFourComponent,
    LeftFiveComponent,
    RightOneComponent,
    RightTwoComponent,
    RightThreeComponent,
    RightFourComponent,
    RightFiveComponent,
    RightSixComponent,
  ],
  imports: [
    CommonModule,
    RealTimeStatisticsRoutingModule,
    ShareModule,
    FormsModule,
    NzTableModule,
  ],
  entryComponents: [
    ShowFullScreenComponent,
    FullScreen1Component,
    FullScreenSelectComponent,
  ]
})
export class RealTimeStatisticsModule {
}
