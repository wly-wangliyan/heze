import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../core/global.service';
import { DateFormatHelper } from '../../../../utils/date-format-helper';
import { SearchUploadRecordParams, UploadRecordEntity, UploadRecordsHttpService } from './upload-records.http.service';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { differenceInCalendarDays } from 'date-fns';

const PageSize = 15;

@Component({
  selector: 'app-upload-records',
  templateUrl: './upload-records.component.html',
  styleUrls: ['./upload-records.component.less'],
  providers: [UploadRecordsHttpService]
})
export class UploadRecordsComponent implements OnInit {

  public searchParams: SearchUploadRecordParams = new SearchUploadRecordParams();

  public uploadRecordList: Array<UploadRecordEntity> = [];

  public upload_start_date: any = '';
  public upload_end_date: any = '';

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription; // linkUrl分页取数
  public pageIndex = 1; // 当前页码
  private linkUrl: string; // 分页URL
  public isLoading = false; // 数据是否加载完成

  // 获取当前记录总页数
  private get pageCount(): number {
    if (this.uploadRecordList.length % PageSize === 0) {
      return this.uploadRecordList.length / PageSize;
    }
    return this.uploadRecordList.length / PageSize + 1;
  }

  constructor(private uploadRecordsHttpService: UploadRecordsHttpService, private globalService: GlobalService) {
    this.upload_start_date = DateFormatHelper.AWeekAgo;
    this.upload_end_date = DateFormatHelper.Tomorrow;
  }

  public ngOnInit() {
    this.generateUploadRecords();
  }

  // 初始化列表
  private generateUploadRecords() {
    this.isLoading = true;
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestParkingRecords();
    });
    this.searchText$.next();
  }

  /**请求上传记录列表 */
  private requestParkingRecords() {
    if (!this.generateAndCheckParamsValid()) {
      return;
    }
    this.uploadRecordsHttpService.requestUploadRecordsData(this.searchParams).subscribe(res => {
      this.initPageIndex(); // 重置页码为第一页
      this.uploadRecordList = res.results;
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
      this.continueRequestSubscription = this.uploadRecordsHttpService.continueUploadRecordsData(this.linkUrl).subscribe(res => {
        this.uploadRecordList = this.uploadRecordList.concat(res.results);
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
    const sTimestamp = this.upload_start_date ? (new Date(this.upload_start_date).setHours(new Date(this.upload_start_date).getHours(),
      new Date(this.upload_start_date).getMinutes(), 0, 0) / 1000).toString() : 0;
    const eTimeStamp = this.upload_end_date ? (new Date(this.upload_end_date).setHours(new Date(this.upload_end_date).getHours(),
      new Date(this.upload_end_date).getMinutes(), 0, 0) / 1000).toString() : 253402185600;
    if (sTimestamp > eTimeStamp) {
      this.globalService.promptBox.open('上传开始时间不能大于结束时间，请重新选择！');
      return false;
    }

    if (this.upload_start_date || this.upload_end_date) {
      this.searchParams.section = `${sTimestamp},${eTimeStamp}`;
    } else {
      this.searchParams.section = null;
    }
    return true;
  }

  // 出厂开始时间禁用
  public disabledStartDate = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
      return true;
    } else if (!startValue || !this.upload_end_date) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.upload_end_date).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 出厂结束时间禁用
  public disabledEndDate = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date()) > 0) {
      return true;
    } else if (!endValue || !this.upload_start_date) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.upload_start_date).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }
}
