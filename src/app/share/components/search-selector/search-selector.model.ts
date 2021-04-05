/**
 * Created by zack on 6/3/18.
 */
import {RegionEntity} from '../../../core/region-http.service';
import {GroupEntity} from '../../../business/groups/groups-http.service';
import {GlobalConst} from '../../global-const';

export const SearchSelectorType = {
  Park: '0',
  Group: '1',
  Region: '2',
};

export abstract class SelectorComponentState {
  public showPark = true;
  public showGroup = true;
  public showDistrict = true;

  public disabledPark = false;
  public disabledGroup = false;
  public disabledDistrict = false;

  public sourceRegions: Array<RegionEntity>;
  public sourceGroups: Array<GroupEntity>;

  public currentValue = '';
  public currentType = SearchSelectorType.Park;

  // 指定类别不存在,并且需要用其他值替代时使用，为了应对特殊处理(实时统计主页面诡异调用逻辑)
  public specialValue = '';

  constructor(regions: Array<RegionEntity>, groups: Array<GroupEntity>) {
    this.sourceRegions = regions;
    this.sourceGroups = groups;
  }

  public abstract get regionList(): Array<RegionEntity>;

  public abstract get groupList(): Array<GroupEntity>;

  public abstract initPark();

  public abstract initGroup();

  public abstract initRegion();
}

export class RealTimeInfoComponentState extends SelectorComponentState {

  constructor(regions: Array<RegionEntity>, groups: Array<GroupEntity>) {
    super(regions, groups);
    this.disabledGroup = true;
    this.disabledDistrict = true;
    this.currentType = SearchSelectorType.Park;
    this.initPark();
  }

  public get regionList(): Array<RegionEntity> {
    return this.sourceRegions;
  }

  public get groupList(): Array<GroupEntity> {
    return [];
  }

  public initPark() {
    this.currentValue = GlobalConst.RegionID;
  }

  public initGroup() {
    this.currentValue = '';
    this.specialValue = '';
  }

  public initRegion() {
    this.currentValue = GlobalConst.RegionID;
    this.specialValue = '';
  }
}

export class RealTimeFlowComponentState extends SelectorComponentState {
  constructor(regions: Array<RegionEntity>, groups: Array<GroupEntity>) {
    super(regions, groups);
    this.showPark = false;
    this.currentType = SearchSelectorType.Region;
    this.initRegion();
  }

  public get regionList(): Array<RegionEntity> {
    return this.sourceRegions;
  }

  public get groupList(): Array<GroupEntity> {
    return this.sourceGroups;
  }

  public initPark() {
    this.currentValue = '';
  }

  public initGroup() {
    this.currentValue = this.sourceGroups && this.sourceGroups[0] ? this.sourceGroups[0].parking_group_id : '';
  }

  public initRegion() {
    this.currentValue = GlobalConst.RegionID;
  }
}

export class RealTimeDataComponentState extends SelectorComponentState {
  constructor(regions: Array<RegionEntity>, groups: Array<GroupEntity>) {
    super(regions, groups);
    this.disabledDistrict = true;
    this.disabledGroup = true;
    this.currentType = SearchSelectorType.Park;
    this.initPark();
  }

  public get regionList(): Array<RegionEntity> {
    return this.sourceRegions;
  }

  public get groupList(): Array<GroupEntity> {
    return this.sourceGroups;
  }

  public initPark() {
    this.currentValue = GlobalConst.RegionID;
  }

  public initGroup() {
    this.currentValue = '';
  }

  public initRegion() {
    this.currentValue = GlobalConst.RegionID;
  }
}

export class HistoryFlowComponentState extends SelectorComponentState {
  constructor(regions: Array<RegionEntity>, groups: Array<GroupEntity>) {
    super(regions, groups);
    this.showPark = false;
    this.currentType = SearchSelectorType.Region;
    this.initRegion();
  }

  public get regionList(): Array<RegionEntity> {
    return this.sourceRegions;
  }

  public get groupList(): Array<GroupEntity> {
    return this.sourceGroups;
  }

  public initPark() {
    this.currentValue = '';
  }

  public initGroup() {
    this.currentValue = this.sourceGroups && this.sourceGroups[0] ? this.sourceGroups[0].parking_group_id : '';
  }

  public initRegion() {
    this.currentValue = GlobalConst.RegionID;
  }
}

export class HistoryDataComponentState extends SelectorComponentState {
  constructor(regions: Array<RegionEntity>, groups: Array<GroupEntity>) {
    super(regions, groups);
    this.disabledDistrict = true;
    this.disabledGroup = true;
    this.currentType = SearchSelectorType.Park;
    this.initPark();
  }

  public get regionList(): Array<RegionEntity> {
    return this.sourceRegions;
  }

  public get groupList(): Array<GroupEntity> {
    return this.sourceGroups;
  }

  public initPark() {
    this.currentValue = GlobalConst.RegionID;
  }

  public initGroup() {
    this.currentValue = '';
  }

  public initRegion() {
    this.currentValue = GlobalConst.RegionID;
  }
}
