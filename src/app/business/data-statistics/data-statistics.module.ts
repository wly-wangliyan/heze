import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DataStatisticsRoutingModule } from './data-statistics-routing.module';
import { ShareModule } from '../../share/share.module';
import { DataStatisticsComponent } from './data-statistics.component';
import { HistoryStatisticsComponent } from './history-statistics/history-statistics.component';
import { HistoryFlowComponent } from './history-statistics/history-flow/history-flow.component';
import { OnlineRateComponent } from './history-statistics/online-rate/online-rate.component';
import { TurnoverRateComponent } from './history-statistics/turnover-rate/turnover-rate.component';
import { PeriodTimeStatisticsComponent } from './period-time-statistics/period-time-statistics.component';
import { RealTimeFlowComponent } from './period-time-statistics/real-time-flow/real-time-flow.component';
import { ParkingFillingRateComponent } from './period-time-statistics/parking-filling-rate/parking-filling-rate.component';
import { ParkingStatisticsComponent } from './parking-statistics/parking-statistics.component';
import { ParkingFlowByhourComponent } from './parking-statistics/parking-flow-byhour/parking-flow-byhour.component';
import { ExportModalComponent } from './parking-statistics/export-modal/export-modal.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';


@NgModule({
  declarations: [
    DataStatisticsComponent,
    HistoryStatisticsComponent,
    HistoryFlowComponent,
    OnlineRateComponent,
    TurnoverRateComponent,
    PeriodTimeStatisticsComponent,
    RealTimeFlowComponent,
    ParkingFillingRateComponent,
    ParkingStatisticsComponent,
    ParkingFlowByhourComponent,
    ExportModalComponent
  ],
  imports: [
    FormsModule,
    ShareModule,
    CommonModule,
    DataStatisticsRoutingModule,
    NzDatePickerModule
  ]
})
export class DataStatisticsModule { }
