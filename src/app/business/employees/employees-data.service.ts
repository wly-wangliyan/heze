import {Injectable} from '@angular/core';
import {GlobalService} from '../../core/global.service';
import {UserEditParams} from './employees-http.service';
import {ValidateHelper} from '../../../utils/validate-helper';
import {UserPermissionGroupEntity} from '../../core/auth.service';

@Injectable()
export class EmployeesDataService {

  constructor(private globalService: GlobalService) {
  }

  /**
   * 检查数据输入是否正确有效
   * @param userParams 参数信息
   * @returns {boolean}
   */
  public generateAndCheckParamsValid(userParams: UserEditParams, permissionList: Array<PermissionItem>): boolean {
    if (!ValidateHelper.Account(userParams.username)) {
      this.globalService.promptBox.open('账号格式错误，请重新输入！');
      return false;
    }
    const phoneNumbers = userParams.telephone.split(',');
    for (const phoneNumber of phoneNumbers) {
      if (!ValidateHelper.Phone(phoneNumber)) {
        this.globalService.promptBox.open('联系方式格式错误，请重新输入！');
        return false;
      }
    }

    if (!ValidateHelper.Email(userParams.email)) {
      this.globalService.promptBox.open('邮箱格式错误，请重新输入！');
      return false;
    }

    // 处理权限组
    const permissions = [];
    for (const permission_group of permissionList) {
      if (permission_group.isChecked) {
        permissions.push(permission_group.source.permission_group_id);
      }
    }
    userParams.permission_groups = permissions;
    userParams.remarks = userParams.remarks ? userParams.remarks.trim() : '';

    return true;
  }
}

export class PermissionItem {

  public source: UserPermissionGroupEntity;

  public isChecked = false;

  constructor(source: UserPermissionGroupEntity) {
    this.source = source;
  }
}
