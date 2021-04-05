import { Component, OnInit, Input } from '@angular/core';
import { SearchSelectorService } from './search-selector.service';
import { GlobalService } from '../../../core/global.service';
import { GroupEntity } from '../../../business/groups/groups-http.service';
import { RegionEntity } from '../../../core/region-http.service';
import { Observable, forkJoin } from 'rxjs';
import {
  SelectorComponentState, RealTimeInfoComponentState, SearchSelectorType,
  RealTimeFlowComponentState, RealTimeDataComponentState, HistoryFlowComponentState,
} from './search-selector.model';

@Component({
  selector: 'app-search-selector',
  templateUrl: './search-selector.component.html',
  styleUrls: ['./search-selector.component.css'],
})
export class SearchSelectorComponent implements OnInit {

  public currentState: SelectorComponentState;

  public SearchSelectorType = SearchSelectorType;

  public regions: Array<RegionEntity> = [];
  public groups: Array<GroupEntity> = [];

  private currentComponent: string;
  public isShowlassification = false; // 是否显示分类

  /* 用来做数据初始化的key值,必传 */
  @Input() set initComponent(component: string) {
    this.currentComponent = component;
    switch (component) {
      case 'RealTimeInfoComponent':
        this.currentState = new RealTimeInfoComponentState(this.regions, this.groups);
        break;
      case 'RealTimeFlowComponent':
        this.currentState = new RealTimeFlowComponentState(this.regions, this.groups);
        break;
      case 'RealTimeDataComponent':
        this.currentState = new RealTimeDataComponentState(this.regions, this.groups);
        break;
      case 'HistoryFlowComponent':
        this.currentState = new HistoryFlowComponentState(this.regions, this.groups);
        this.isShowlassification = true;
        break;
      // case 'HistoryDataComponent':
      //   this.currentState = new HistoryDataComponentState(this.regions, this.groups);
      //   this.isShowlassification = true;
      //   break;
      case 'ParkingStateComponent':
        this.currentState = new RealTimeInfoComponentState(this.regions, this.groups);
        break;
      case 'ParkingStatisticsComponent':
        this.currentState = new RealTimeInfoComponentState(this.regions, this.groups);
        break;
    }
    this.notify();
  }

  constructor(public dataService: SearchSelectorService, private globalService: GlobalService) {
  }

  private notify() {
    // 将组件的数据放到数据传输服务里,然后发事件通知
    this.dataService.selectStateChanged.next(this.currentState);
  }

  public ngOnInit() {
    this.globalService.currentTileRegions.subscribe(regions => {
      this.regions = regions;
      this.initComponent = this.currentComponent;
    });
  }

  /* 切换类型进行状态初始化 */
  public onTypeSelectChanged(event: any) {
    this.currentState.currentType = event.target.value;

    switch (this.currentState.currentType) {
      case SearchSelectorType.Park:
        this.currentState.initPark();
        break;
      case SearchSelectorType.Group:
        this.currentState.initGroup();
        break;
      case SearchSelectorType.Region:
        this.currentState.initRegion();
        break;
    }
    this.notify();
  }

  public onTypeContentSelectChanged(event: any) {
    this.currentState.currentValue = event.target.value;
    this.notify();
  }

  /**
   * 重置数据
   */
  public reset() {
    this.initComponent = this.currentComponent;
  }
}
