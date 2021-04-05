import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataRecordsRoutingModule } from './data-records-routing.module';
import { DataRecordsComponent } from './data-records.component';
import { ParkingRecordsComponent } from './parking-records/parking-records.component';
import { ShareModule } from '../../share/share.module';
import { UploadRecordsComponent } from './upload-records/upload-records.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';


@NgModule({
  declarations: [
    DataRecordsComponent,
    ParkingRecordsComponent,
    UploadRecordsComponent],
  imports: [
    CommonModule,
    FormsModule,
    DataRecordsRoutingModule,
    ShareModule,
    NzDatePickerModule,
    NzTableModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class DataRecordsModule { }
