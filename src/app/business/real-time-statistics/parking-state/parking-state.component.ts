import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ParkingDynamicsInfoParams, ParkingDynamicsInfoEntity,
  RegionRealTimeDataEntity
} from '../../data-statistics/data-statistics.model';
import { GlobalService } from '../../../core/global.service';
import { DataStatisticsHttpService } from '../../data-statistics/data-statistics-http.service';
import { GlobalConst } from '../../../share/global-const';
import { SearchSelectorType } from '../../../share/components/search-selector/search-selector.model';
import { Subscription } from 'rxjs';
import { SearchSelectorService } from '../../../share/components/search-selector/search-selector.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-parking-state',
  templateUrl: './parking-state.component.html',
  styleUrls: ['./parking-state.component.css']
})
export class ParkingStateComponent implements OnInit, OnDestroy {
  public showSelector = true; // 显示选择器
  public searchParams: ParkingDynamicsInfoParams = new ParkingDynamicsInfoParams();

  public dataList: Array<ParkingDynamicsInfoEntity> = [];
  public dataInfo: RegionRealTimeDataEntity;

  private searchSubscription: Subscription;

  constructor(
    private globalService: GlobalService,
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
      this.requestRegionRealTimeData(tempValue);
    });
  }

  public ngOnDestroy() {
    this.searchSubscription && this.searchSubscription.unsubscribe();
  }

  /**
   * 获取实时动态信息各个数据数量
   */
  private requestRegionRealTimeData(regionID: string) {
    this.dataStatisticsHttpService.requestRegionRealTimeData(regionID).subscribe(data => {
      this.dataInfo = data;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }
}
