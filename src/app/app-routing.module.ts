import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './core/auth-guard.service';
import {RouteMonitorService} from './core/route-monitor.service';
import {AppComponent} from './app.component';
import {LoginComponent} from './business/login/login.component';
import {HomeComponent} from './business/home/home.component';
import {BasicsComponent} from "./business/basics/basics.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [AuthGuardService]},
  {
    path: '', component: AppComponent, children: [
      {path: '', redirectTo: '/home', pathMatch: 'full'},
      {path: 'home', component: HomeComponent, canActivate: [AuthGuardService, RouteMonitorService]},
      {
        path: 'real-time-statistics',
        loadChildren: () => import('./business/real-time-statistics/real-time-statistics.module').then(m => m.RealTimeStatisticsModule),
        canLoad: [AuthGuardService]
      },
      {
        path: 'data-statistics',
        loadChildren: () => import('./business/data-statistics/data-statistics.module').then(m => m.DataStatisticsModule),
        canLoad: [AuthGuardService]
      },
      {
        path: 'records',
        loadChildren: () => import('./business/data-records/data-records.module').then(m => m.DataRecordsModule),
        canLoad: [AuthGuardService]
      },
      {
        path: 'basics', component: BasicsComponent,
        children: [
          {
            path: 'parkings',
            loadChildren: () => import('./business/parkings/parkings.module').then(m => m.ParkingsModule),
            canLoad: [AuthGuardService]
          }
        ]
      },
      {
        path: 'employees',
        loadChildren: () => import('./business/employees/employees.module').then(m => m.EmployeesModule),
        canLoad: [AuthGuardService]
      },
      {path: '**', redirectTo: '/home', pathMatch: 'full'},
    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
