import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataRecordsComponent } from './data-records.component';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { ParkingRecordsComponent } from './parking-records/parking-records.component';
import { UploadRecordsComponent } from './upload-records/upload-records.component';

const routes: Routes = [{
  path: '', component: DataRecordsComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'parking', pathMatch: 'full' },
    { path: 'parking', component: ParkingRecordsComponent },
    { path: 'upload', component: UploadRecordsComponent },
    { path: '**', redirectTo: 'parking' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataRecordsRoutingModule { }
