import {UserEntity} from '../../../core/auth.service';
import {EntityBase} from "../../../../utils/z-entity";

export class CompanyEntity extends EntityBase {
  public company_id: string = undefined; // 物业公司id
  public company_name: string = undefined; // 物业公司名称
  public region_id: string = undefined; // 省市区code
  public address: string = undefined; // 详细地址
  public person: string = undefined; // 法人
  public contacts: string = undefined; // 联系人
  public telephone: string = undefined; // 联系电话
  public licence_num: string = undefined; // 营业执照
  public licence_photos: Array<string> = undefined; // 营业执照照片
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间
  public user: UserEntity = undefined;
  public lon: string = undefined; // 经度
  public lat: string = undefined; // 纬度
  public province: string = undefined; // 省
  public city: string = undefined; // 市
  public district: string = undefined; // 区

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'user') {
      return UserEntity;
    }
    return super.getPropertyClass(propertyName);
  }
}

export class CompanyBasicInfoEntity extends EntityBase {
  public company_id: string = undefined; // String	公司ID
  public company_name: string = undefined; // String	公司名称
}
