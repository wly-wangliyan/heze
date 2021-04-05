import { Pipe, PipeTransform } from '@angular/core';
import { from } from 'rxjs';
import { distinct } from 'rxjs/operators';

const ParkingType = {
  1: '停车楼',
  2: '地下停车场',
  3: '地面停车场',
  6: '立体停车场',
  8: '地面+地下停车场',
  9: '地面+停车楼',
  10: '地面+地下+停车楼'
};

@Pipe({
  name: 'parkingType'
})
export class ParkingTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined) {
      return '--';
    } else if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      return ParkingType[value];
    } else {
      return ParkingType[value];
    }
  }
}

const ParkingAreaType = {
  1: '路内停车场',
  2: '路外停车场'
};
const AbridgeParkingAreaType = {
  1: '路内',
  2: '路外'
};

@Pipe({
  name: 'areaType'
})
export class ParkingAreaTypePipe implements PipeTransform {

  public transform(value: any, abridge = false, args?: any): any {
    return abridge ? AbridgeParkingAreaType[value] : ParkingAreaType[value];
  }
}

const ParkingGroupType = {
  0: '其他',
  1: '商业区',
  2: '住宅区',
  3: '文教区',
  4: '办公区',
  5: '工业区'
};

@Pipe({
  name: 'groupType'
})
export class ParkingGroupTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      return ParkingGroupType[value];
    } else if (value && value.length > 0) {
      // 当传递数组类型时的处理
      let str = '';
      from(value).pipe(distinct()).subscribe((code: any) => {
        // 拼接字符串
        str = str ? str + ',' + ParkingGroupType[code] : ParkingGroupType[code];
      });
      return str;
    } else {
      return ParkingGroupType[value];
    }
  }
}

const ParkingUpdateType = {
  1: '基本信息变更',
  // 2: '分组信息变更',
  3: '物业公司变更',
  4: '管理系统变更'
};

@Pipe({
  name: 'updateType'
})
export class ParkingUpdateTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    return ParkingUpdateType[value];
  }
}

const ParkingOperateType = {
  'add': '添加',
  'update': '修改',
  'cancel': '注销'
};

@Pipe({
  name: 'operateType'
})
export class ParkingOperateTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    return ParkingOperateType[value];
  }
}

@Pipe({
  name: 'parkingFormatAddress'
})
export class ParkingFormatAddressPipe implements PipeTransform {

  public transform(parking: any, level: number): string {
    let address = '';
    if (level === 1) {
      address += parking.province ? parking.province : '';
      address += parking.city ? parking.city : '';
      address += parking.district ? parking.district : '';
    } else if (level === 2) {
      address += parking.city ? parking.city : '';
      address += parking.district ? parking.district : '';
    } else if (level === 3) {
      address += parking.district ? parking.district : '';
    }
    address += parking.address ? parking.address : '';
    return address;
  }
}

const OpenType = {
  1: '完全对外开放',
  2: '部分对外开放',
  4: '共享对外开放',
  5: '不对外开放',
};

@Pipe({
  name: 'openType'
})
export class OpenTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined) {
      return '--';
    } else if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      return OpenType[value];
    } else {
      return OpenType[value];
    }
  }
}

const PayType = {
  0: '其他',
  1: '现金',
  2: '微信',
  3: 'etc',
  8: '停车卡',
  9: '无感支付',
  10: '支付宝',
  11: '银行卡',
  12: '城市一卡通',
};

@Pipe({
  name: 'payType'
})
export class PayTypePipe implements PipeTransform {
  public transform(value: any, args?: any): any {
    if (value === null || value === undefined) {
      return '--';
    }
    let hasOther = false;
    const payTypeArr = [];
    value.forEach(v => {
      if (!PayType[v]) {
        hasOther = true;
      } else if (v === 0) {
        hasOther = true;
      } else {
        payTypeArr.push(PayType[v]);
      }
    });
    if (hasOther) {
      payTypeArr.push(PayType[0]);
    }
    return payTypeArr.join('、');
  }
}
