import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../core/global.service';
import { DateFormatHelper } from '../../../../../utils/date-format-helper';
import { timer } from 'rxjs';
import { differenceInCalendarDays } from 'date-fns';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.less']
})
export class ExportModalComponent implements OnInit {
  private parking_ids: string;
  public export_type = 1;
  public export_month: any = '';
  public custom_start_time: any = '';
  public custom_end_time: any = '';

  constructor(private globalService: GlobalService) { }

  ngOnInit() {
  }

  public open(parking_ids?: string) {
    this.export_type = 1;
    this.custom_start_time = '';
    this.custom_end_time = '';
    this.parking_ids = parking_ids || '';
    this.initExportMonth(DateFormatHelper.MonthDate(-1));
    timer(0).subscribe(() => {
      $('#exportModal').modal();
    });
  }

  public onChangeExportType(event: any): void {
    this.export_type = Number(event.target.value);

    if (this.export_type === 1) {
      this.initExportMonth(DateFormatHelper.MonthDate(-1));
    } else if (this.export_type === 2) {
      this.initCustomData(DateFormatHelper.Yesterday);
    }
  }

  // 默认按月导出，时间为上个月；
  private initExportMonth(month: Date) {
    this.export_month = month;
    this.custom_start_time = DateFormatHelper.GetFirstDayOfMonth(month);
    this.custom_end_time = DateFormatHelper.GetLastDayOfMonth(month);
  }

  // 选择自定义时间时，默认时间是昨天。
  private initCustomData(date: Date) {
    this.custom_start_time = new Date(new Date(date).setHours(0, 0, 0, 0));
    this.custom_end_time = new Date(new Date(date).setHours(23, 59, 59, 0));
  }

  // 自定义日期变更
  public onDateChange() {
    this.generateAndCheckParamsValid();
  }

  // 按月日期变更
  public onExportMonthChange(event: Date) {
    this.initExportMonth(event);
  }

  private generateAndCheckParamsValid(): boolean {
    if ((this.custom_end_time.getTime() - this.custom_start_time.getTime()) / 86400000 > 31) {
      this.globalService.promptBox.open('导出数据，时间间隔不能超过31天，请重新选择！');
      return false;
    }
    return true;
  }

  public onCheckExportClick() {
    if (this.generateAndCheckParamsValid()) {
      const section = `${new Date(this.custom_start_time).getTime() / 1000},${new Date(this.custom_end_time).getTime() / 1000}`;
      const exportUrl = `${environment.CIPP_UNIVERSE}/parking_daily_data/export?section=${section}&parking_ids=${this.parking_ids}`;
      $('#exportModal').modal('hide');
      window.open(exportUrl);
    }
  }

  // 按月导出月份禁用处理
  public disabledMonth = (monthValue: Date): boolean => {
    if (differenceInCalendarDays(monthValue, DateFormatHelper.GetLastDayOfMonth(DateFormatHelper.MonthDate(-1))) > 0) {
      return true;
    } else {
      return false;
    }
  }

  // 自定义导出处理开始禁用时间
  public disabledStartDate = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date(new Date(DateFormatHelper.Yesterday).setHours(23, 59, 59, 0))) > 0) {
      return true;
    } else if (!startValue || !this.custom_end_time) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.custom_end_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 自定义导出处理结束禁用时间
  public disabledEndDate = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date(new Date(DateFormatHelper.Yesterday).setHours(23, 59, 59, 0))) > 0) {
      return true;
    } else if (!this.custom_start_time || !endValue) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.custom_start_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }
}
