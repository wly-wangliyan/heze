import { NgModule } from '@angular/core';
import { ShareModule } from '../../share/share.module';
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { EmployeesAddComponent } from './employees-add/employees-add.component';
import { EmployeesEditComponent } from './employees-edit/employees-edit.component';
import { EmployeesDetailComponent } from './employees-detail/employees-detail.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';


@NgModule({
  imports: [
    ShareModule,
    CommonModule,
    FormsModule,
    EmployeesRoutingModule,
    NzTableModule,
  ],
  declarations: [
    EmployeesComponent,
    EmployeesListComponent,
    EmployeesAddComponent,
    EmployeesEditComponent,
    EmployeesDetailComponent]
})
export class EmployeesModule {
}
