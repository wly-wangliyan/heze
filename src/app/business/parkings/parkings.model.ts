import {UserEntity} from '../../core/auth.service';
import {CompanyEntity} from '../basics/operation-company/operation-company.model';
import {ManufacturerPlatFormEntity} from '../basics/manufacturer/manufacturer.model';
import {isNullOrUndefined} from "util";
import {DateFormatHelper} from "../../../utils/date-format-helper";
import {EntityBase, noClone, noCreate, noJson} from "../../../utils/z-entity";

export class ParkingEntity extends EntityBase {
  public parking_id: string = undefined; // 停车场id/编号
  public parking_name = ''; // 停车场名称
  public province: string = undefined; // 省
  public city: string = undefined; // 市
  public district: string = undefined; // 区
  public region_id: string = undefined; // 行政区域code
  public address = ''; // 地址
  public lon: string = undefined; // 经度
  public lat: string = undefined; // 纬度
  public area_type = 1; // 用地类型 1:路内 2:路外
  public parking_type: Array<any> = undefined; // 停车场类型 1:地上停车场 2:桥下停车场 3:地下停车场 4:停车楼 5:立体车库 0:其他
  public contacts = ''; // 联系人
  public telephone = ''; // 联系电话
  public images: Array<string> = undefined; // 图片集
  public parking_groups: Array<any> = undefined; // 停车场分组
  public parking_company: ParkingCompanyEntity = undefined; // 运营关系
  public parking_platform: ParkingPlatformEntity = undefined; // 收费关系
  public status: number = undefined; // deprecated 状态 1:正常, 2: 已注销
  public beian_status: number = undefined; // 备案状态 1:已备案 2:未备案 3:已到期
  public cancel_time: number = undefined; // 注销时间
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间
  public start_time: number = undefined; // Float	备案有效开始时间
  public end_time: number = undefined; // Float	备案有效结束时间
  public parking_category: number = undefined; // 停车场类型 1:停车楼 2:地下停车场 3:地面停车场 6:立体停车场 8:地面+地下停车场 9:地面+停车楼 10:地面+地下+停车楼
  public total: number = undefined; // 停车总数/泊位数

  @noClone @noCreate @noJson
  public get companyName(): string {
    const name = this.parking_company && this.parking_company.company && this.parking_company.company.company_name;
    return name;
  }

  @noClone @noCreate @noJson
  public get companyId(): string {
    const id = this.parking_company && this.parking_company.company && this.parking_company.company.company_id;
    return id;
  }

  /* 带有厂商信息的全名 */
  @noClone @noCreate @noJson
  public get platformFullName(): string {
    let name = '';
    if (this.manufacturerName) {
      name = this.platformName && this.manufacturerName && (this.platformName + ' - ' + this.manufacturerName);
    } else {
      // 只有管理系统没有厂商时不显示厂商
      name = this.platformName;
    }
    return name;
  }

  @noClone @noCreate @noJson
  public get platformName(): string {
    const name = this.parking_platform && this.parking_platform.platform && this.parking_platform.platform.platform_name;
    return name;
  }

  @noClone @noCreate @noJson
  public get platformId(): string {
    const id = this.parking_platform && this.parking_platform.platform && this.parking_platform.platform.platform_id;
    return id;
  }

  @noClone @noCreate @noJson
  public get manufacturerName(): string {
    const name = this.parking_platform && this.parking_platform.platform && this.parking_platform.platform.manufacturer && this.parking_platform.platform.manufacturer.manufacturer_name;
    return name;
  }

  @noClone @noCreate @noJson
  public get manufacturerId(): string {
    const id = this.parking_platform && this.parking_platform.platform && this.parking_platform.platform.manufacturer && this.parking_platform.platform.manufacturer.manufacturer_id;
    return id;
  }

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'parking_company') {
      return ParkingCompanyEntity;
    } else if (propertyName === 'parking_platform') {
      return ParkingPlatformEntity;
    }
    return null;
  }
}

export class ParkingCompanyEntity extends EntityBase {
  public parking_company_id: string = undefined; // 运营公司id
  public parking: any = undefined; // 停车场
  public company: CompanyEntity = undefined; // 运营公司
  public start_time: number = undefined; // 运营公司开始时间
  public is_deleted: boolean = undefined; // 删除标记
  public deleted_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'company') {
      return CompanyEntity;
    }
    return null;
  }
}

export class ParkingPlatformEntity extends EntityBase {
  public parking_platform_id: string = undefined; // 收费平台id
  public parking: any = undefined; // 停车场
  public platform: ManufacturerPlatFormEntity = undefined; // 收费平台
  public start_time: number = undefined; // 收费平台开始时间
  public is_deleted: boolean = undefined; // 删除标记
  public deleted_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'platform') {
      return ManufacturerPlatFormEntity;
    }
    return null;
  }
}

export class ParkingsSearchParams {
  public parking_id: string = undefined; // 停车场编码
  public parking_name: string = undefined; // 停车场名称
  public region_id: string = undefined; // 行政区域code
  public address: string = undefined; // 地址
  public company_name: string = undefined; // 运营公司名称
  public platform_name: string = undefined; // 收费系统名称
  public manufacturer_name: string = undefined; // 系统厂商名称
  public status = '1'; // 状态	1:运营中 2:未运营 3:运营过期
  public page_num: number = undefined; // 页码
  public page_size: number = undefined; // 每页条数
}

export class ParkingUpdateRecordEntity extends EntityBase {
  public record_id: string = undefined; // 记录id
  public msg: ParkingUpdateRecordMsgEntity = undefined; // 变更详情
  public update_type: number = undefined; // 变更类型 1: 基本信息 2: 分组 3: 物业公司 4: 系统厂商
  public operate_type: string = undefined; // 操作类型 add, update, cancel
  public user: UserEntity = undefined; // 操作人
  public operator: string = undefined; // 操作人
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间
  public parking: ParkingEntity = undefined;

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'msg') {
      return ParkingUpdateRecordMsgEntity;
    }
    if (propertyName === 'user') {
      return UserEntity;
    }
    if (propertyName === 'parking') {
      return ParkingEntity;
    }
    return null;
  }
}

export class ParkingUpdateRecordMsgEntity extends EntityBase {
  public address: string = undefined;
  public area_type: number = undefined;
  public city: string = undefined;
  public contacts: string = undefined;
  public district: string = undefined;
  public images: Array<any> = undefined;
  public lat: string = undefined;
  public lon: string = undefined;
  public parking_name: string = undefined;
  public parking_type: Array<any> = undefined; // deprecated
  public parking_category: number = undefined;
  public province: string = undefined;
  public region_id: string = undefined;
  public status: number = undefined;
  public telephone: string = undefined;
  public beian_status: string = undefined;
  public parking_group_names: string = undefined;

  public u_address: string = undefined;
  public u_area_type: number = undefined;
  public u_city: string = undefined;
  public u_contacts: string = undefined;
  public u_images: Array<any> = undefined;
  public u_lat: string = undefined;
  public u_lon: string = undefined;
  public u_parking_name: string = undefined;
  public u_parking_type: Array<any> = undefined;
  public u_parking_category: number = undefined;
  public u_province: string = undefined;
  public u_region_id: string = undefined;
  public u_status: number = undefined;
  public u_telephone: string = undefined;
  public u_parking_group_names: string = undefined;
  public u_beian_status: string = undefined;

  public u_company_name: string = undefined;
  public company_name: string = undefined;
  public manufacturer_name: string = undefined;
  public platform_name: string = undefined;
  public start_time: number = undefined;
  public u_manufacturer_name: string = undefined;
  public u_platform_name: string = undefined;
  public u_start_time: string = undefined;

  @noClone @noCreate @noJson
  public get platformFullName(): string {
    if (this.platform_name && this.manufacturer_name) {
      return this.platform_name + '-' + this.manufacturer_name;
    }
    return '--';
  }

  @noClone @noCreate @noJson
  public get u_platformFullName(): string {
    if (this.u_platform_name && this.u_manufacturer_name) {
      return this.u_platform_name + '-' + this.u_manufacturer_name;
    }
    return '--';
  }
}

export class ParkingBasicInfoEntity extends EntityBase {
  public parking_id: string = undefined; // String	停车场ID
  public parking_name: string = undefined; // String	停车场名称
  public address: string = undefined; // 地址
  public lon: string = undefined;
  public lat: string = undefined;
  public area_type: number = undefined; // 状态 1:路内 2:路外
  public first_operate_time: number = undefined; // 首次运营时间
  public charging_pile: boolean = undefined; // 是否有充电桩
  public parking_kind: number = undefined;
  public operate_type: number = undefined;
  public parking_category: number = undefined;
  public operation_start_time: number = undefined;
  public opening_type: number = undefined;
  public pay_type: number = undefined;
  public company_name: string = undefined;
  public platform_name: string = undefined;
  public operation_end_time: number;

  @noClone @noJson @noCreate
  public get firstOperationTime() {
    if (isNullOrUndefined(this.first_operate_time)) {
      return '-- ';
    }
    return DateFormatHelper.Format(this.first_operate_time * 1000);
  }
}

export class ParkingRelationEntity extends EntityBase {
  public parking_name: string = undefined;
  public parking_id: string = undefined;
  public parking_relation: ParkingRelationDetailEntity = new ParkingRelationDetailEntity();
  public company: CompanyEntity = undefined;
  public images: Array<string> = []; // 图片集
  public platform: ManufacturerPlatFormEntity = undefined;
  public status: number = undefined; // deprecated 状态 1:正常, 2: 已注销

  @noClone @noCreate @noJson
  public get companyName(): string {
    const name = this.company && this.company && this.company.company_name;
    return name;
  }

  @noClone @noCreate @noJson
  public get platformName(): string {
    const name = this.platform && this.platform && this.platform.platform_name;
    return name;
  }

  @noClone @noCreate @noJson
  public get manufacturerName(): string {
    const name = this.platform && this.platform && this.platform.manufacturer && this.platform.manufacturer.manufacturer_name;
    return name;
  }

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'company') {
      return CompanyEntity;
    } else if (propertyName === 'platform') {
      return ManufacturerPlatFormEntity;
    } else if (propertyName === 'parking_relation') {
      return ParkingRelationDetailEntity;
    }
    return null;
  }
}

export class ParkingRelationDetailEntity extends EntityBase {
  public start_time: number = undefined; // 运营开始时间
  public parking_relation_id: string = undefined;
  public end_time: number = undefined; // 运营结束时间
}
