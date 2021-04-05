import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ParkingDynamicsInfoParams, ParkingDynamicsInfoEntity,
  RegionRealTimeDataEntity, ParkingDynamicsCompleteInfoParams, ParkingDynamicsExportParams
} from '../../data-statistics/data-statistics.model';
import { GlobalService } from '../../../core/global.service';
import { DataStatisticsHttpService } from '../../data-statistics/data-statistics-http.service';
import { GlobalConst } from '../../../share/global-const';
import { SearchSelectorType } from '../../../share/components/search-selector/search-selector.model';
import { Subscription, Subject } from 'rxjs';
import { SearchSelectorService } from '../../../share/components/search-selector/search-selector.service';
import { isNullOrUndefined } from 'util';
import { environment } from '../../../../environments/environment';
import { debounceTime } from 'rxjs/operators';

const PageSize = 15;

enum OrderItemType {
  total_num = 1,
  filling_rate,
  total_tmp_num,
  status,
}

export enum OrderByType {
  order = 1, //
  reverse_order, // 倒序
  disabled,
}

@Component({
  selector: 'app-parking-state-simple',
  templateUrl: './parking-state-simple.component.html',
  styleUrls: ['./parking-state-simple.component.css']
})
export class ParkingStateSimpleComponent implements OnInit, OnDestroy {

  public showSelector = true; // 显示选择器
  public searchParams: ParkingDynamicsCompleteInfoParams = new ParkingDynamicsCompleteInfoParams(); // 条件筛选参数
  private exportParams: ParkingDynamicsExportParams = new ParkingDynamicsExportParams(); // 导出参数
  public dataList: Array<ParkingDynamicsInfoEntity> = []; // 停车场列表

  public OrderByType = OrderByType; // 排序
  public OrderItemType = OrderItemType; // 排序
  public currentOrderItem = OrderItemType.status; // 当前排序
  public currentOrderType = OrderByType.reverse_order; // 当前排序
  private preSelectOrderItem = OrderItemType.status; // 当前排序

  private searchSubscription: Subscription;
  private continueRequestSubscription: Subscription; // linkUrl分页取数
  public pageIndex = 1; // 当前页码
  private linkUrl: string; // 分页URL
  private searchText$ = new Subject<any>();
  public isLoading = false; // 标记是否加载中

  // 获取当前记录总页数
  private get pageCount(): number {
    if (this.dataList.length % PageSize === 0) {
      return this.dataList.length / PageSize;
    }
    return this.dataList.length / PageSize + 1;
  }

  @ViewChild('export', { static: false }) export: ElementRef;

  constructor(private globalService: GlobalService,
    private dataStatisticsHttpService: DataStatisticsHttpService,
    private searchSelectorService: SearchSelectorService) {
  }

  public ngOnInit() {
    this.searchSubscription = this.searchSelectorService.selectStateChanged.subscribe(state => {
      if (isNullOrUndefined(state)) {
        return;
      }
      // 必须是有效值
      let tempValue = '';
      switch (state.currentType) {
        case SearchSelectorType.Park:
          tempValue = state.currentValue;
          break;
        case SearchSelectorType.Region:
        case SearchSelectorType.Group:
          tempValue = GlobalConst.RegionID;
          break;
      }
      this.searchParams.region_id = tempValue;
      this.generateParkingRecords();
    });
  }

  public ngOnDestroy() {
    this.searchSubscription && this.searchSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 初始化停车场列表
  private generateParkingRecords() {
    this.isLoading = true;
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestParkingRecords();
    });
    this.searchText$.next();
  }

  /**请求停车场列表 */
  private requestParkingRecords() {
    this.dataStatisticsHttpService.requestParkingDynamicInfoList(this.searchParams).subscribe(res => {
      this.initPageIndex(); // 重置页码为第一页
      this.dataList = res.results;
      this.linkUrl = res.linkUrl;
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.initPageIndex();
      this.globalService.httpErrorProcess(err);
    });
  }

  /**
   * 改变排序方式
   * @param {OrderItemType} orderItem 项
   * @param {OrderByType} orderType 正序/倒序
   */
  public onChangeOrderBtnClick(orderItem: OrderItemType, orderType: OrderByType) {
    if (orderItem !== this.preSelectOrderItem) {
      orderType = OrderByType.reverse_order;
    } else {
      orderType = (orderType === OrderByType.reverse_order) ? OrderByType.order : OrderByType.reverse_order;
    }
    const item = OrderItemType[orderItem];
    const order_by = orderType === OrderByType.order ? item : '-' + item;
    this.currentOrderItem = orderItem;
    this.currentOrderType = orderType;
    this.preSelectOrderItem = orderItem;
    this.searchParams.order_by = order_by;
    this.searchText$.next();
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
      this.continueRequestSubscription = this.dataStatisticsHttpService.continueParkingDynamicInfoList(this.linkUrl).subscribe(res => {
        this.dataList = this.dataList.concat(res.results);
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
}

