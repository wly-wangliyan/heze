import {UserEntity} from '../../../core/auth.service';
import {EntityBase} from "../../../../utils/z-entity";

export class ManufacturerBasicInfoEntity extends EntityBase {
  public manufacturer_id = ''; // String	系统厂商id
  public manufacturer_name = ''; // String	系统厂商名称
  public contacts = ''; // String	联系人
  public telephone = ''; // String	联系电话
  public created_time: number = undefined; // Float	创建时间/注册时间
  public user: UserEntity = undefined; // User 已绑定用户

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'user') {
      return UserEntity;
    }
    return super.getPropertyClass(propertyName);
  }
}

export class ManufacturerPlatFormEntity extends EntityBase {
  public platform_id: string = undefined; // String	收费系统id
  public manufacturer: ManufacturerBasicInfoEntity = undefined; // Manufacturer 所属厂商
  public platform_name: string = undefined; // String	收费系统名称
  public authority_num: string = undefined; // String	软著权编码
  public authority_images: Array<string> = undefined; // array	软著权资质
  public client_id: string = undefined; // String	授权帐号
  public client_secret: string = undefined; // String	授权秘钥
  public updated_time: number = undefined; // Float	更新时间
  public created_time: number = undefined; // Float	创建时间
  public user: UserEntity = undefined;

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'manufacturer') {
      return ManufacturerBasicInfoEntity;
    } else if (propertyName === 'user') {
      return UserEntity;
    }
    return super.getPropertyClass(propertyName);
  }
}

export class PlatformBasicInfoEntity extends EntityBase {
  public platform_id: string = undefined; // String	收费系统ID
  public platform_name: string = undefined; // String	收费系统名称
}

export class ParkingBasicInfoEntity extends EntityBase {
  public parking_id: string = undefined; // String	停车场ID
  public parking_name: string = undefined; // String	停车场名称
  public address: string = undefined; // 地址
  public lon: string = undefined;
  public lat: string = undefined;
}
