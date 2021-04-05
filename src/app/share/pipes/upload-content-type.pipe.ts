import {Pipe, PipeTransform} from '@angular/core';

const uploadContentTypeObj = {
  'parking_record': '车辆出入场记录',
  'parking_dynamic_info': '停车场动态信息',
  'parking_fee': '车辆订单信息',
};

@Pipe({
  name: 'uploadContentType'
})
export class UploadContentTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    return (uploadContentTypeObj[value] ? uploadContentTypeObj[value] : '');
  }
}
