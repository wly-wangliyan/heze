
import { Component, OnInit } from '@angular/core';
import {
  ParkingRecordsHttpService, SearchParkingRecordParams,
  ParkingRecordEntity
} from './parking-records-http.service';
import { GlobalService } from '../../../core/global.service';
import { DefaultUserType } from '../../../share/pipes/user-type.pipe';
import { DateFormatHelper } from '../../../../utils/date-format-helper';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { differenceInCalendarDays } from 'date-fns';

const PageSize = 15;

@Component({
  selector: 'app-parking-records',
  templateUrl: './parking-records.component.html',
  styleUrls: ['./parking-records.component.less']
})
export class ParkingRecordsComponent implements OnInit {

  public searchParams: SearchParkingRecordParams = new SearchParkingRecordParams();

  public parkingRecordList: Array<ParkingRecordEntity> = [];

  public defaultUserType = DefaultUserType;

  public entrance_start_date: any = '';
  public entrance_end_date: any = '';

  public exit_start_date: any = '';
  public exit_end_date: any = '';

  private continueRequestSubscription: Subscription; // linkUrl分页取数
  public pageIndex = 1; // 当前页码
  private linkUrl: string; // 分页URL
  private searchText$ = new Subject<any>();
  public isLoading = false;

  // 获取当前记录总页数
  private get pageCount(): number {
    if (this.parkingRecordList.length % PageSize === 0) {
      return this.parkingRecordList.length / PageSize;
    }
    return this.parkingRecordList.length / PageSize + 1;
  }

  constructor(
    private parkingRecordsHttpService: ParkingRecordsHttpService,
    private globalService: GlobalService) {
  }

  public ngOnInit() {
    this.generateParkingRecords();
  }

  // 初始化列表
  private generateParkingRecords() {
    this.isLoading = true;
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestParkingRecords();
    });
    this.searchText$.next();
  }

  /**请求停车记录列表 */
  private requestParkingRecords() {
    if (!this.generateAndCheckParamsValid()) {
      return;
    }
    this.parkingRecordsHttpService.requestParkingRecordsData(this.searchParams).subscribe(res => {
      this.initPageIndex(); // 重置页码为第一页
      this.parkingRecordList = res.results;
      this.linkUrl = res.linkUrl;
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.initPageIndex();
      this.globalService.httpErrorProcess(err);
    });
  }

  // 查询按钮
  public onSearchBtnClick() {
    this.searchText$.next();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 分页
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      // tslint:disable-next-line:no-unused-expression
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.parkingRecordsHttpService.continueParkingRecordsData(this.linkUrl).subscribe(res => {
        this.parkingRecordList = this.parkingRecordList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }


  // 重置当前页码
  private initPageIndex() {
    this.pageIndex = 1;
  }

  /* 生成并检查参数有效性 */
  public generateAndCheckParamsValid(): boolean {
    const en_sTimestamp = this.entrance_start_date ? (new Date(this.entrance_start_date).setHours(new Date(this.entrance_start_date).getHours(),
      new Date(this.entrance_start_date).getMinutes(), 0, 0) / 1000).toString() : 0;
    const en_eTimeStamp = this.entrance_end_date ? (new Date(this.entrance_end_date).setHours(new Date(this.entrance_end_date).getHours(),
      new Date(this.entrance_end_date).getMinutes(), 0, 0) / 1000).toString() : 253402185600;
    if (en_sTimestamp > en_eTimeStamp) {
      this.globalService.promptBox.open('入场开始时间不能大于结束时间，请重新选择！');
      return false;
    }

    if (this.entrance_start_date || this.entrance_end_date) {
      this.searchParams.entry_section = `${en_sTimestamp},${en_eTimeStamp}`;
    } else {
      this.searchParams.entry_section = null;
    }

    const ex_sTimestamp = this.exit_start_date ? (new Date(this.exit_start_date).setHours(new Date(this.exit_start_date).getHours(),
      new Date(this.exit_start_date).getMinutes(), 0, 0) / 1000).toString() : 0;
    const ex_eTimeStamp = this.exit_end_date ? (new Date(this.exit_end_date).setHours(new Date(this.exit_end_date).getHours(),
      new Date(this.exit_end_date).getMinutes(), 0, 0) / 1000).toString() : 253402185600;
    if (ex_sTimestamp > ex_eTimeStamp) {
      this.globalService.promptBox.open('出场开始时间不能大于结束时间，请重新选择！');
      return false;
    }

    if (this.exit_start_date || this.exit_end_date) {
      this.searchParams.exit_section = `${ex_sTimestamp},${ex_eTimeStamp}`;
    } else {
      this.searchParams.exit_section = null;
    }

    return true;
  }

  // 入场开始时间禁用
  public disabledEntryStartDate = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
      return true;
    } else if (!startValue || !this.entrance_end_date) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.entrance_end_date).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 入场结束时间禁用
  public disabledEntryEndDate = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date()) > 0) {
      return true;
    } else if (!endValue || !this.entrance_start_date) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.entrance_start_date).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 出厂开始时间禁用
  public disabledExitStartDate = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
      return true;
    } else if (!startValue || !this.exit_end_date) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.exit_end_date).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 出厂结束时间禁用
  public disabledExitEndDate = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date()) > 0) {
      return true;
    } else if (!endValue || !this.exit_start_date) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.exit_start_date).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }
}
