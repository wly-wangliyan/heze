import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AuthGuardService} from '../../core/auth-guard.service';
import {ParkingsComponent} from './parkings.component';
import {ParkingsListComponent} from './parkings-list/parkings-list.component';
import {ParkingsEditComponent} from './parkings-edit/parkings-edit.component';
import {EditBasicInfoComponent} from './parkings-edit/basic-info/basic-info.component';
import {EditOperationRelationComponent} from './parkings-edit/operation-relation/operation-relation.component';
import {RouteMonitorService} from '../../core/route-monitor.service';
import {MonitorInfoComponent} from "./parkings-edit/monitor-info/monitor-info.component";

@NgModule({
  imports: [RouterModule.forChild([{
    path: '', component: ParkingsComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
      {path: '', component: ParkingsListComponent},
      {
        path: 'detail/:parking_id', component: ParkingsEditComponent,
        children: [
          {path: '', redirectTo: 'basic-info', pathMatch: 'full'},
          {path: 'basic-info', component: EditBasicInfoComponent},
          {path: 'operation-relation', component: EditOperationRelationComponent},
          {path: 'monitor-info', component: MonitorInfoComponent},
        ]
      },
      {path: '**', redirectTo: ''}
    ]
  }])],
  exports: [RouterModule],
})
export class ParkingsRoutingModule {
}
