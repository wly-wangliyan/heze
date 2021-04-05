import {Component, OnDestroy, OnInit} from '@angular/core';
import {GlobalService} from '../../../core/global.service';
import {ParkingsHttpService} from '../parkings-http.service';
import {ParkingEntity, ParkingsSearchParams} from '../parkings.model';
import {Subject, Subscription} from "rxjs";
import {debounceTime} from "rxjs/operators";

const PageSize = 15;

@Component({
  selector: 'app-parkings-list',
  templateUrl: './parkings-list.component.html',
  styleUrls: ['./parkings-list.component.css']
})
export class ParkingsListComponent implements OnInit, OnDestroy {
  public searchParams: ParkingsSearchParams = new ParkingsSearchParams();
  public parkingsList: Array<ParkingEntity> = [];
  public searchText$ = new Subject<any>();
  public isLoadComplete = false; // 数据是否加载完成
  public pageIndex = 1; // 当前页码
  private continueRequestSubscription: Subscription; // linkUrl分页取数
  private linkUrl: string; // 分页URL

  constructor(private parkingsHttpService: ParkingsHttpService,
              private globalService: GlobalService) {
  }

  // 分页
  public onNZPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.parkingsHttpService.continueParkingsData(this.linkUrl).subscribe(res => {
        this.parkingsList = this.parkingsList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 获取当前记录总页数
  private get pageCount(): number {
    if (this.parkingsList.length % PageSize === 0) {
      return this.parkingsList.length / PageSize;
    }
    return this.parkingsList.length / PageSize + 1;
  }

  public ngOnInit() {
    this.generateParkingList();
  }

  public ngOnDestroy() {
    // 当页面销毁时缓存数据,并解除检索适配器对页面的引用
    this.searchText$ && this.searchText$.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  /* 生成状态信息 */
  public generateStatus(item: ParkingEntity): string {
    switch (Number(item.status)) {
      case 1:
        return '运营中';
      case 2:
        return '未运营';
      case 3:
        return '待运营';
    }
    return '未知';
  }

  // 初始化列表
  private generateParkingList(): void {
    this.isLoadComplete = true;
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestParkingListData();
    });
    this.searchText$.next();
  }

  /**
   * 请求数据
   * @private
   */
  private requestParkingListData() {
    this.parkingsHttpService.requestParkingsData(this.searchParams).subscribe(res => {
      this.pageIndex = 1; // 重置页码为第一页
      this.parkingsList = res.results;
      this.linkUrl = res.linkUrl;
      this.isLoadComplete = false;
    }, err => {
      this.isLoadComplete = false;
      this.pageIndex = 1;
      this.globalService.httpErrorProcess(err);
    });
  }
}
