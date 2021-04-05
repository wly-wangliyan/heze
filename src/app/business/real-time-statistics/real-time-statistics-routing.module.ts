import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { RealTimeStatisticsComponent } from '../real-time-statistics/real-time-statistics.component';
import { RealTimeInfoComponent } from './real-time-info/real-time-info.component';
import { ThermodynamicChartComponent } from './thermodynamic-chart/thermodynamic-chart.component';
import { ParkingStateComponent } from './parking-state/parking-state.component';
import { ParkingStateSimpleComponent } from './parking-state-simple/parking-state-simple.component';

const routes: Routes = [{
  path: '', component: RealTimeStatisticsComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'info', pathMatch: 'full' },
    { path: 'info', component: RealTimeInfoComponent },
    { path: 'thermodynamic-chart', component: ThermodynamicChartComponent },
    {
      path: 'parking-state', component: ParkingStateComponent, children: [
        { path: '', redirectTo: 'parking-state-simple', pathMatch: 'full' },
        { path: 'parking-state-simple', component: ParkingStateSimpleComponent },
      ]
    },
    { path: '**', redirectTo: 'info' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RealTimeStatisticsRoutingModule { }
