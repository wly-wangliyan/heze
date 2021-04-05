/**
 * Created by zack on 6/3/18.
 */

import { EntityBase } from '../../../utils/z-entity';
import { ParkingBasicInfoEntity } from '../parkings/parkings.model';

export class RegionBasicInfoEntity extends EntityBase {
  public region_id: string = undefined;
  public name: string = undefined;
  public level: any = undefined;
  public parent_id: string = undefined;
}

export class GroupBasicInfoEntity extends EntityBase {
  public parking_group_id: string = undefined;
  public parking_group_name: string = undefined;
  public parking_group_types: Array<any> = [];
  public is_deleted = false;
}

/**** 实时信息 ****/

export class ParkingDynamicsInfoParams extends EntityBase {
  public region_id: string = undefined; // 	String	F	行政区域code
  public parking_name: string = undefined; // 	String	F	停车场名称
  public parking_group_id = ''; // 	String	F	分组id
  public status: any = ''; // 	Int	F	车位状态 1: 空闲 2: 宽松 3: 紧张
  public page_num: number = undefined; // int	F	页码 默认1
  public page_size: number = undefined; // 	int	F	每页条数 默认20
  public keywords = ''; // 停车场名称/地址(关键字)
  public area_type = ''; // 用地类型
  public order_by = '-status'; // 排序方式: "-total_num, total_num, -filling_rate, filling_rate, -total_tmp_num, total_tmp_num, -status, status"
}

export class ParkingDynamicsCompleteInfoParams extends EntityBase {
  public region_id: string = undefined; // 	String	F	行政区域code
  public parking_name: string = undefined; // 	String	F	停车场名称
  public parking_group_id = ''; // 	String	F	分组id
  public status: any = ''; // 	Int	F	车位状态 1: 空闲 2: 宽松 3: 紧张
  public page_num = 1; // int	F	页码 默认1
  public page_size = 45; // 	int	F	每页条数 默认20
  public keywords = ''; // 停车场名称/地址(关键字)
  public area_type = ''; // 用地类型
  public order_by = '-status'; // 排序方式: "-total_num, total_num, -filling_rate, filling_rate, -total_tmp_num, total_tmp_num, -status, status"
  public parking_kind = ''; // 	Int	F	停车场类型（普通/管理）
  public operate_type = ''; // 	Int	F	管理模式
  public parking_category = ''; // 	Int	F	停车场类型 1:停车楼 2:地下停车场 ...
  public opening_type = ''; // 	String	F	开放类型
  public company_name: string = undefined; // 	String	F	公司名称
  public platform_name: string = undefined; // 	String	F	系统名称
}

export class ParkingDynamicsExportParams extends EntityBase {
  public derived_type: string = undefined; // 	String	T	导出类型 1为简版 2为完整版
  public region_id: string = undefined; // 		String	T	行政区域code
  public parking_name: string = undefined; // 		String	F	停车场名称
  public area_type: number = undefined; // 	Int	F	停车场用地类型 1:路内 2:路外
  public parking_group_id: string = undefined; // 		String	F	分组id
  public status: number = undefined; // 		Int	F	车位状态 0: 未知 1: 空闲 2: 宽松 3: 紧张
  public parking_kind: string = undefined; // 		Int	F	停车场类型（普通/管理）
  public operate_type: string = undefined; // 		Int	F	管理模式
  public parking_category: string = undefined; // 		Int	F	停车场类型 1:停车楼 2:地下停车场 ...
  public opening_type: string = undefined; // 		String	F	开放类型
  public company_name: string = undefined; // 		String	F	公司名称
  public platform_name: string = undefined; // 		String	F	系统名称

}

export class ParkingDynamicsInfoEntity extends EntityBase {
  public parking: ParkingBasicInfoEntity = undefined; // object	停车场
  public total_num: number = undefined; // 	Int	总车位数
  public total_tmp_num: number = undefined; // Int	总临时车位数
  public tmp_num: number = undefined; // Int	占用临时车位数
  public total_other_num: number = undefined; // 	Int	总其他车位数
  public other_num: number = undefined; // 	Int	占用其他车位数
  public status: any = undefined; // 	Int	车位状态 1: 空闲 2: 宽松 3: 紧张
  public updated_time: number = undefined; // 	Float	更新时间
  public created_time: number = undefined; // 	Float	创建时间
  public flow: number = undefined; // 流量
  public filling_rate: number = undefined; // 填充率
  public run_status: number = undefined; // 0未知 1正常 2异常
  public area_type: number = undefined;  // 1 路内 2 路外

  // 建委专用
  public parking_total: number = undefined; // 停车场总数分母
  public parking_tmp_num: number = undefined; // 停车场占有车位数 分子
  public parking_status: number = undefined; // 同status


  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'parking') {
      return ParkingBasicInfoEntity;
    }
    return null;
  }
}

/* 动态信息中提取出来的热力图数据 */
export class ParkingDynamicsInfoHeatMapDataEntity extends EntityBase {
  public lng: number = undefined;
  public lat: number = undefined;
  public count: number = undefined;
}

export class ParkingDynamicOnlineRateEntity extends EntityBase {
  public total_num: number = undefined; // 停车场总数
  public online_num: number = undefined; // 在线停车场数
  public offline_num: number = undefined; // 离线停车场数
}

export class ParkingDynamicUtilizationRateEntity extends EntityBase {
  public total_num: number = undefined; // 车位总数
  public used_num: number = undefined;  // 占用车位数
  public unused_num: number = undefined; // // 空闲车位数
  public inside_total_num: number = undefined; // 车位总数
  public inside_used_num: number = undefined;  // 占用车位数
  public inside_unused_num: number = undefined; // // 空闲车位数
  public outside_total_num: number = undefined; // 车位总数
  public outside_used_num: number = undefined;  // 占用车位数
  public outside_unused_num: number = undefined; // // 空闲车位数
}

export class RegionRealTimeStatisticsParams extends EntityBase {
  public region_ids: string = undefined; // String	F	行政区域code集合 用,分割
  public order_by: string = undefined; // String	F	排序方式 'turnover_rate': 周转率 'filling_rate': 填充率 'entry_flow': 流量 'updated_time': 更新时间 'created_time': 创建时间
  public page_num = 1; // int	F	页码 默认1
  public page_size = 5; // int	F	每页条数 默认20
  constructor(order_by?: 'turnover_rate' | '-filling_rate' | '-entry_flow') {
    super();
    if (order_by) {
      this.order_by = order_by;
    }
  }
}

export class ParkingRealTimeStatisticsParams extends EntityBase {
  public region_id: string = undefined; // 行政区域code
  public parking_ids: string = undefined; // String	F	行政区域code集合 用,分割
  public order_by: string = undefined; // String	F	排序方式 'turnover_rate': 周转率 'filling_rate': 填充率 'entry_flow': 流量 'updated_time': 更新时间 'created_time': 创建时间
  public page_num = 1; // int	F	页码 默认1
  public page_size = 5; // int	F	每页条数 默认20
  constructor(order_by?: 'turnover_rate' | '-filling_rate' | '-entry_flow') {
    super();
    if (order_by) {
      this.order_by = order_by;
    }
  }
}

export class GroupRealTimeStatisticsParams extends EntityBase {
  public parking_group_ids: string = undefined; // String	F	行政区域code集合 用,分割
  public order_by: string = undefined; // String	F	排序方式 'turnover_rate': 周转率 'filling_rate': 填充率 'entry_flow': 流量 'updated_time': 更新时间 'created_time': 创建时间
  public page_num = 1; // int	F	页码 默认1
  public page_size = 5; // int	F	每页条数 默认20
  constructor(order_by?: 'turnover_rate' | '-filling_rate' | '-entry_flow') {
    super();
    if (order_by) {
      this.order_by = order_by;
    }
  }
}

// 停车场流量统计条件检索停车场
export class ParkingFlowParams extends EntityBase {
  public search_name: string = undefined; //   String	F	停车场名称或地址
  public area_type: number = undefined; //  	Int	F	停车场类型 1:路内 2:路外
  public region_ids: string = undefined; // 	String	F	行政区域code集 例:'210100'/'210100, 210104'
  public page_num = 1; // int	F	页码
  public page_size = 30;  //  int	F	每页条数
}

// 导出停车场状态excel表格
export class ParkingStateExportParams extends EntityBase {
  public derived_type: string = undefined; // 	String	T	导出类型 1为简版 2为完整版
  public region_id: string = undefined; // 	String	T	行政区域code
  public parking_name: string = undefined; // 	String	F	停车场名称
  public area_type: number = undefined; // 	Int	F	停车场用地类型 1:路内 2:路外
  public parking_group_id: string = undefined; // 	String	F	分组id
  public status: number = undefined; // 	Int	F	车位状态 0: 未知 1: 空闲 2: 宽松 3: 紧张
  public parking_kind: number = undefined; // 	Int	F	停车场类型（普通/管理）
  public operate_type: number = undefined; // 	Int	F	管理模式
  public parking_category: number = undefined; // 	Int	F	停车场类型 1:停车楼 2:地下停车场 ...
  public opening_type: string = undefined; // 	String	F	开放类型
  public company_name: string = undefined; // 	String	F	公司名称
  public platform_name: string = undefined; // 	String	F	系统名称

}

export class ParkingRealTimeStatisticsEntity extends EntityBase {
  public parking: ParkingBasicInfoEntity = undefined; // object	停车场
  public turnover_rate: number = undefined; // Float	周转率
  public filling_rate: number = undefined; // Float	填充率
  public entry_flow: number = undefined; // int	入口流量
  public updated_time: number = undefined; // Float	更新时间
  public created_time: number = undefined; // Float	创建时间
  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'parking') {
      return ParkingBasicInfoEntity;
    }
    return null;
  }
}

export class GroupRealTimeStatisticsEntity extends EntityBase {
  public parking_group: GroupBasicInfoEntity = undefined; // 停车场组
  public turnover_rate: number = undefined; // Float	周转率
  public filling_rate: number = undefined; // Float	填充率
  public entry_flow: number = undefined; // int	入口流量
  public updated_time: number = undefined; // Float	更新时间
  public created_time: number = undefined; // Float	创建时间
  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'parking_group') {
      return GroupBasicInfoEntity;
    }
    return null;
  }
}

export class RegionRealTimeStatisticsEntity extends EntityBase {
  public region: RegionBasicInfoEntity = undefined; // 停车场组
  public turnover_rate: number = undefined; // Float	周转率
  public filling_rate: number = undefined; // Float	填充率
  public entry_flow: number = undefined; // int	入口流量
  public updated_time: number = undefined; // Float	更新时间
  public created_time: number = undefined; // Float	创建时间
  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'region') {
      return RegionBasicInfoEntity;
    }
    return null;
  }
}

// 查看历史
export class ParkingHistoryEntity extends EntityBase {
  public parking_history_id: string = undefined; // 	String	停车场历史查看ID
  public user_id: number = undefined; // 	Int	用户ID
  public parking_id: string = undefined; // 	String	停车场ID
  public created_time: number = undefined; // 	Float	创建时间
  public parking_name: string = undefined;
  public total: number = undefined; // 车位总数
}

// 按天查停车场出口流量
export class ParkingOutFlowEntity extends EntityBase {
  public parking_exit_flow_by_day_id: string = undefined; // 	String	停车场出流量按天统计id
  public parking: any = undefined; // 	Json	关联停车场
  public exit_flow: number = undefined; // 	Int	停车场出口流量
  public turnover_rate: number = undefined; // 	Float	周转率
  public time_point: number = undefined; // 	Float	每天的时间点
  public updated_time: number = undefined; // 	Float	更新时间
  public created_time: number = undefined; // 	Float	创建时间
}

/**** 流量 ****/

export class ParkingEntryFlowBase extends EntityBase {
  public parking: ParkingBasicInfoEntity = undefined; // Json	关联停车场
  public entry_flow: number = undefined; // Int	停车场入口流量
  public exit_flow: number = undefined;
  public time_point: number = undefined; // Float	每小时的时间点
  public turnover_rate: number = undefined; // 周转率
  public updated_time: number = undefined; // Float	更新时间
  public created_time: number = undefined; // Float	创建时间
  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'parking') {
      return ParkingBasicInfoEntity;
    }
    return null;
  }
}

export class ParkingEntryFlowByHourEntity extends ParkingEntryFlowBase {
  public parking_entry_flow_by_hour_id: string = undefined; // String	停车场入口按小时流量id
}

export class ParkingExitFlowByHourEntity extends ParkingEntryFlowBase {
  public parking_exit_flow_by_hour_id: string = undefined; // String	停车场出口按小时流量id
}

export class ParkingEntryFlowByDayEntity extends ParkingEntryFlowBase {
  public parking_entry_flow_by_day_id: string = undefined; // String	停车场入口按天统计id
}

export class ParkingEntryFlowByWeekEntity extends ParkingEntryFlowBase {
  public parking_entry_flow_by_week_id: string = undefined; // String	停车场入口流量按周统计id
}

export class ParkingEntryFlowByMonthEntity extends ParkingEntryFlowBase {
  public parking_entry_flow_by_month_id: string = undefined; // String	停车场入口流量按月统计id
}

export class ParkingEntryFlowByYearEntity extends ParkingEntryFlowBase {
  public parking_entry_flow_by_year_id: string = undefined; // String	停车场入口流量按年统计id
}

export class ParkingTotalEntryFlowByEveryDayEntity extends EntityBase {
  public parking_entry_flow_by_everyday_id: string = undefined; // String	停车场入口总流量按每天统计id
  public entry_flow: number = undefined; // Int	停车场入口总流量
  public time_point: number = undefined; // Float	每天的时间点
  public updated_time: number = undefined; // Float	更新时间
  public created_time: number = undefined; // Float	创建时间
}

export class EntryFlowBase extends EntityBase {
  public road_inside_entry_flow: number = undefined; // Int	路内入口流量
  public road_outside_entry_flow: number = undefined; // Int	路外入口流量
  public total_entry_flow: number = undefined; // Int	总入口流量
  public time_point: number = undefined; // Float	每周期的时间点
  public updated_time: number = undefined; // Float	更新时间
  public created_time: number = undefined; // Float	创建时间
  public road_inside_parking_count: number = undefined; // 路内停车场数量
  public road_outside_parking_count: number = undefined; // 路外停车场数量
  public total_parking_count: number = undefined; // 总停车场数量
}

export class RegionEntryFlowBase extends EntryFlowBase {
  public region: RegionBasicInfoEntity; // String	区域id

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'region') {
      return RegionBasicInfoEntity;
    }
    return super.getPropertyClass(propertyName);
  }
}

export class RegionEntryFlowByHourEntity extends RegionEntryFlowBase {
  public region_entry_flow_by_hour_id: string = undefined; // String	区入口流量按小时统计id
}

export class RegionEntryFlowByDayEntity extends RegionEntryFlowBase {
  public region_entry_flow_by_day_id: string = undefined; // String	区入口流量按天统计id
}

export class RegionEntryFlowByWeekEntity extends RegionEntryFlowBase {
  public region_entry_flow_by_week_id: string = undefined; // String	区入口流量按周统计id
}

export class RegionEntryFlowByMonthEntity extends RegionEntryFlowBase {
  public region_entry_flow_by_month_id: string = undefined; // String	区入口流量按月统计id
}

export class RegionEntryFlowByYearEntity extends RegionEntryFlowBase {
  public region_entry_flow_by_year_id: string = undefined; // String	区入口流量按年统计id
}

export class RegionTotalEntryFlowByEveryDayEntity extends EntityBase {
  public region_entry_flow_by_everyday_id: string = undefined; // String	区域入口总流量按每天统计id
  public entry_flow: number = undefined; // Int	区域入口总流量
  public time_point: number = undefined; // Float	每天的时间点
  public updated_time: number = undefined; // Float	更新时间
  public created_time: number = undefined; // Float	创建时间
  public region: RegionBasicInfoEntity;

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'region') {
      return RegionBasicInfoEntity;
    }
    return super.getPropertyClass(propertyName);
  }
}

export class GroupEntryFlowBase extends EntryFlowBase {
  public parking_group: GroupBasicInfoEntity; // Json	关联组
  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'parking_group') {
      return GroupBasicInfoEntity;
    }
    return null;
  }
}

export class GroupEntryFlowByHourEntity extends GroupEntryFlowBase {
  public group_entry_flow_by_hour_id: string = undefined; // String	组入口流量按小时统计id
}

export class GroupEntryFlowByDayEntity extends GroupEntryFlowBase {
  public group_entry_flow_by_day_id: string = undefined; // String	组入口流量按天统计id
}

export class GroupEntryFlowByWeekEntity extends GroupEntryFlowBase {
  public group_entry_flow_by_week_id: string = undefined; // String	组入口流量按周统计id
}

export class GroupEntryFlowByMonthEntity extends GroupEntryFlowBase {
  public group_entry_flow_by_month_id: string = undefined; // String	组入口流量按月统计id
}

export class GroupEntryFlowByYearEntity extends GroupEntryFlowBase {
  public group_entry_flow_by_year_id: string = undefined; // String	组入口流量按年统计id
}

export class GroupTotalEntryFlowByEveryDayEntity extends EntityBase {
  public group_entry_flow_by_everyday_id: string = undefined; // String	组入口总流量按每天统计id
  public entry_flow: number = undefined; // Int	区域入口总流量
  public time_point: number = undefined; // Float	每天的时间点
  public updated_time: number = undefined; // Float	更新时间
  public created_time: number = undefined; // Float	创建时间
}

export class RegionExitFlowByHourEntity extends EntityBase {
  public region_exit_flow_by_hour_id: any = undefined; // String 区出口流量按小时统计id
  public road_inside_exit_flow: number = undefined; // Int 路内出口流量
  public road_outside_exit_flow: number = undefined; // Int 路外出口流量
  public total_exit_flow: number = undefined; // Int 总出口流量
  public time_point: number = undefined; // Float 每小时的时间点
  public updated_time: number = undefined; // Float 更新时间
  public created_time: number = undefined; // Float 创建时间
  public region: ReginDetailEntity = undefined; // object	行政区域

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'region') {
      return ReginDetailEntity;
    }
    return super.getPropertyClass(propertyName);
  }
}

/**** 填充率 ****/
export class FillingRateBase extends EntityBase {
  public road_inside_filling_rate: number = undefined; // Int	路内填充率
  public road_outside_filling_rate: number = undefined; // Int	路外填充率
  public total_filling_rate: number = undefined; // Int	总填充率
  public total_num: number = undefined; // Int	总车位数
  public used_num: number = undefined; // Int	占用车位数
  public road_inside_total_num: number = undefined; // Int	路内总车位数
  public road_inside_used_num: number = undefined; // Int	路内占用车位数
  public road_outside_total_num: number = undefined; // Int	路外总车位数
  public road_outside_used_num: number = undefined; // Int	路外占用车位数
  public time_point: number = undefined; // Float	每小时的时间点
  public updated_time: number = undefined; // Float	更新时间
  public created_time: number = undefined; // Float	创建时间
}

export class RegionFillingRateByHourEntity extends FillingRateBase {
  public region: RegionBasicInfoEntity; // String	区域id
  public region_filling_rate_by_hour_id: string; // String	区填充率按小时统计id

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'region') {
      return RegionBasicInfoEntity;
    }
    return super.getPropertyClass(propertyName);
  }
}

export class RegionFillingRateByDayEntity extends FillingRateBase {
  public region: RegionBasicInfoEntity = undefined; // String	区域id
  public region_filling_rate_by_day_id: string = undefined; // String	区填充率按天统计id

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'region') {
      return RegionBasicInfoEntity;
    }
    return super.getPropertyClass(propertyName);
  }
}

export class GroupFillingRateByHourEntity extends FillingRateBase {
  public parking_group: GroupBasicInfoEntity = undefined; // String	关联组id
  public group_filling_rate_by_hour_id: string = undefined; // String	组填充率按小时统计id

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'parking_group') {
      return GroupBasicInfoEntity;
    }
    return super.getPropertyClass(propertyName);
  }
}

export class GroupFillingRateByDayEntity extends FillingRateBase {
  public parking_group: GroupBasicInfoEntity = undefined; // String	关联组id
  public group_filling_rate_by_day_id: string = undefined; // String	组填充率按天统计id

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'parking_group') {
      return GroupBasicInfoEntity;
    }
    return super.getPropertyClass(propertyName);
  }
}

/**** 在线率 ****/
export class OnlineRateBase extends EntityBase {
  public road_inside_online_rate: number = undefined; // Int	路内在线率
  public road_outside_online_rate: number = undefined; // Int	路外在线率
  public total_online_rate: number = undefined; // Int	总在线率
  public parking_total_num: number = undefined; // Int	停车场总数
  public parking_online_num: number = undefined; // Int	停车场在线总数
  public road_inside_parking_total_num: number = undefined; // Int	路内停车场总数
  public road_inside_parking_online_num: number = undefined; // Int	路内在线停车场总数
  public road_outside_parking_total_num: number = undefined; // Int	路外停车场总数
  public road_outside_parking_online_num: number = undefined; // Int	路外在线停车场总数
  public time_point: number = undefined; // Float	每小时的时间点
  public updated_time: number = undefined; // Float	更新时间
  public created_time: number = undefined; // Float	创建时间
}

export class RegionOnlineRateByHourEntity extends OnlineRateBase {
  public region_online_rate_by_hour_id: string = undefined; // String	区在线率按小时统计id
  public region: RegionBasicInfoEntity = undefined; // String	区域id

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'region') {
      return RegionBasicInfoEntity;
    }
    return super.getPropertyClass(propertyName);
  }
}

export class RegionOnlineRateByDayEntity extends OnlineRateBase {
  public region_online_rate_by_day_id: string = undefined; // String	区在线率按天统计id
  public region: RegionBasicInfoEntity = undefined; // String	区域id

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'region') {
      return RegionBasicInfoEntity;
    }
    return super.getPropertyClass(propertyName);
  }
}

export class GroupOnlineRateByHourEntity extends OnlineRateBase {
  public parking_group: GroupBasicInfoEntity = undefined; // String	关联组id
  public group_online_rate_by_hour_id: string = undefined; // String	组在线率按小时统计id

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'parking_group') {
      return GroupBasicInfoEntity;
    }
    return super.getPropertyClass(propertyName);
  }
}

export class GroupOnlineRateByDayEntity extends OnlineRateBase {
  public parking_group: GroupBasicInfoEntity = undefined; // String	关联组id
  public group_online_rate_by_day_id: string = undefined; // String	组在线率按天统计id

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'parking_group') {
      return GroupBasicInfoEntity;
    }
    return super.getPropertyClass(propertyName);
  }
}

/**** 周转率 ****/
export class TurnoverRateBase extends EntityBase {
  public road_inside_entry_flow: number = undefined; // Int	路内入口流量
  public road_inside_total_num: number = undefined; // Int	路内停车场总车位数
  public road_inside_turnover_rate: number = undefined; // Float	路内停车场周转率
  public road_outside_entry_flow: number = undefined; // Int	路外入口流量
  public road_outside_total_num: number = undefined; // Int	路外停车场总车位数
  public road_outside_turnover_rate: number = undefined; // Float	路外停车场周转率
  public total_entry_flow: number = undefined; // Int	总入口流量
  public total_num: number = undefined; // Int	停车场总车位数
  public total_turnover_rate: number = undefined; // Float	周转率
  public time_point: number = undefined; // Float	每小时的时间点
  public updated_time: number = undefined; // Float	更新时间
  public created_time: number = undefined; // Float	创建时间
}

export class RegionTurnoverRateByHourEntity extends TurnoverRateBase {
  public region_turnover_rate_by_hour_id: string = undefined; // String	区周转率按小时统计id
  public region: RegionBasicInfoEntity = undefined; // String	区域id

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'region') {
      return RegionBasicInfoEntity;
    }
    return super.getPropertyClass(propertyName);
  }
}

export class RegionTurnoverRateByDayEntity extends TurnoverRateBase {
  public region_turnover_rate_by_day_id: string = undefined; // String	区周转率按天统计id
  public region: RegionBasicInfoEntity = undefined; // String	区域id

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'region') {
      return RegionBasicInfoEntity;
    }
    return super.getPropertyClass(propertyName);
  }
}

export class GroupTurnoverRateByHourEntity extends TurnoverRateBase {
  public parking_group: GroupBasicInfoEntity = undefined; // String	关联组id
  public group_turnover_rate_by_hour_id: string = undefined; // String	组周转率按小时统计id

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'parking_group') {
      return GroupBasicInfoEntity;
    }
    return super.getPropertyClass(propertyName);
  }
}

export class GroupTurnoverRateByDayEntity extends TurnoverRateBase {
  public parking_group: GroupBasicInfoEntity = undefined; // String	关联组id
  public group_turnover_rate_by_day_id: string = undefined; // String	组周转率按天统计id

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'parking_group') {
      return GroupBasicInfoEntity;
    }
    return super.getPropertyClass(propertyName);
  }
}

export class ParkingCountEntity extends EntityBase {
  public total_num: number = undefined;
  public inside_num: number = undefined;
  public outside_num: number = undefined;
}

// 用户类型
export class RegionUserTypeBase extends EntityBase {
  public tmp: number = undefined; // Int	临时用户数量
  public white: number = undefined; // Int	白名单用户数量
  public timely: number = undefined; // Int	包时用户数量
  public count: number = undefined; // Int	包次用户数量
  public visitor: number = undefined; // Int	访客用户数量
  public reservation: number = undefined; // Int	预约用户数量
  public space_sharing: number = undefined; // Int	共享用户数量
  public other: number = undefined; // Int	其他用户数量
  public time_point: number = undefined; // Float	每小时的时间点
  public updated_time: number = undefined; // Float	更新时间
  public created_time: number = undefined; // Float	创建时间
}

export class RegionUserTypeEntity extends RegionUserTypeBase {
  public region: ReginDetailEntity = undefined; // object	行政区域

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'region') {
      return ReginDetailEntity;
    }
    return super.getPropertyClass(propertyName);
  }
}

export class RegionUserTypeByDayEntity extends RegionUserTypeBase {
  public user_type_ratio_by_day_id: string = undefined; // String	用户类型比例按天统计id
  public region_id: string = undefined; // String	区域id
}

export class ReginDetailEntity extends EntityBase {
  public region_id: string = undefined;
  public name: string = undefined; // 区域名称
}

export class TotalEntryFlowEntity extends EntityBase {
  public road_inside_total_flow: number = undefined;
  public road_outside_total_flow: number = undefined;
  public total_flow: number = undefined;
}

export class TodayRealFlowEntity extends EntityBase {
  public road_inside_total_flow: number = undefined;
  public road_outside_total_flow: number = undefined;
  public total_flow: number = undefined;
}

export class RegionRealTimeDataEntity extends EntityBase {
  public ample_count: number = undefined;
  public total_flow: number = undefined;
  public free_count: number = undefined;
  public parking_count: number = undefined;
  public busy_count: number = undefined;
}
