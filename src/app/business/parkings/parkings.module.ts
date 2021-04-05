import {NgModule} from '@angular/core';
import {ShareModule} from '../../share/share.module';
import {ParkingsRoutingModule} from './parkings-routing.module';
import {ParkingsComponent} from './parkings.component';
import {ParkingsListComponent} from './parkings-list/parkings-list.component';
import {EditBasicInfoComponent} from './parkings-edit/basic-info/basic-info.component';
import {EditOperationRelationComponent} from './parkings-edit/operation-relation/operation-relation.component';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ParkingsEditComponent} from "./parkings-edit/parkings-edit.component";
import { NzTableModule } from 'ng-zorro-antd/table';
import { MonitorInfoComponent } from './parkings-edit/monitor-info/monitor-info.component';

@NgModule({
  imports: [
    ShareModule,
    ParkingsRoutingModule,
    FormsModule,
    CommonModule,
    NzTableModule,
  ],
  declarations: [ParkingsComponent,
    ParkingsListComponent,
    ParkingsEditComponent,
    EditBasicInfoComponent,
    EditOperationRelationComponent,
    MonitorInfoComponent,
  ]
})
export class ParkingsModule {
}
