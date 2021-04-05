import { Component } from '@angular/core';
import { EmployeesHttpService } from './employees-http.service';
import { DataCacheService } from '../../core/data-cache.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.less'],
  providers: [EmployeesHttpService, DataCacheService]
})
export class EmployeesComponent {
}
