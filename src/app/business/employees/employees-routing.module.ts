import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { EmployeesComponent } from './employees.component';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { EmployeesAddComponent } from './employees-add/employees-add.component';
import { EmployeesEditComponent } from './employees-edit/employees-edit.component';
import { EmployeesDetailComponent } from './employees-detail/employees-detail.component';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { RoutePreventService } from '../../core/route-prevent.service';

@NgModule({
  imports: [RouterModule.forChild([{
    path: '', component: EmployeesComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
      { path: '', component: EmployeesListComponent },
      {
        path: 'add', component: EmployeesAddComponent,
        canDeactivate: [RoutePreventService]
      },
      {
        path: 'edit/:username', component: EmployeesEditComponent,
        canDeactivate: [RoutePreventService]
      },
      { path: 'detail/:username', component: EmployeesDetailComponent },
      { path: '**', redirectTo: '' }
    ]
  }])],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {
}
