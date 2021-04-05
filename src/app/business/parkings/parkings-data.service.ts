import {Injectable} from '@angular/core';
import {GlobalService} from '../../core/global.service';
import {ValidateHelper} from '../../../utils/validate-helper';

@Injectable()
export class ParkingsDataService {

  constructor(private globalService: GlobalService) {
  }

  /**
   * 检查数据是否正确有效
   * @param parkingsParams
   * @returns {boolean}
   */
  public generateAndCheckParamsValid(parkingsParams): boolean {
    if (parkingsParams.telephone) {
      const phoneNumbers = parkingsParams.telephone.split(',');
      for (const phoneNumber of phoneNumbers) {
        if (!ValidateHelper.Phone(phoneNumber)) {
          this.globalService.promptBox.open('联系方式格式错误，请重新输入！');
          return false;
        }
      }
    }

    return true;
  }
}
