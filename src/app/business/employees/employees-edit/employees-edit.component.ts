import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../../../core/global.service';
import { EmployeesHttpService, UserEditParams } from '../employees-http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeesDataService, PermissionItem } from '../employees-data.service';
import { Observable, forkJoin } from 'rxjs';
import { UserEntity, AuthService } from '../../../core/auth.service';
import { DataCacheService } from '../../../core/data-cache.service';
import { CanDeactivateComponent } from '../../../share/interfaces/can-deactivate-component';
import { CheckboxState } from '../../../share/components/beautify-checkbox/beautify-checkbox.component';

@Component({
  selector: 'app-employees-edit',
  templateUrl: './employees-edit.component.html',
  styleUrls: ['./employees-edit.component.less'],
  providers: [EmployeesDataService]
})
export class EmployeesEditComponent implements OnInit, CanDeactivateComponent {

  public userParams: UserEditParams = new UserEditParams();

  public permissionList: Array<PermissionItem> = [];

  public username: string;

  public user: UserEntity = new UserEntity();

  private fromPath: 'list' | 'detail' = 'list';

  private editSuccess = false; // 编辑是否成功

  private dirty: false; // 标记权限是否有改动

  @ViewChild('editEmployeeForm', { static: false }) public editEmployeeForm: any;

  /**
   * 获取是否有权限被选中了(表单校验)
   * @returns {boolean}
   */
  public get permissionChecked(): boolean {
    for (const permission of this.permissionList) {
      if (permission.isChecked) {
        return true;
      }
    }
    return false;
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private globalService: GlobalService,
    private dataCacheService: DataCacheService,
    private httpService: EmployeesHttpService,
    private dataService: EmployeesDataService) {
    this.route.paramMap.subscribe(map => {
      this.username = map.get('username');
    });
    this.route.queryParamMap.subscribe(map => {
      this.fromPath = map.get('from') === 'detail' ? 'detail' : 'list';
    });
  }

  public ngOnInit() {
    // 并发获取用户信息和权限列表
    forkJoin([this.httpService.requestUserInfo(this.username),
    this.globalService.permissionGroups]).subscribe((results: any) => {
      this.user = results[0];
      this.userParams = new UserEditParams(results[0]);
      this.permissionList = [];
      results[1].forEach(group => {
        if (group.english_name !== 'parking_record_export') {
          const permissionItem = new PermissionItem(group);
          // 根据数据中的权限设置权限的选中状态
          for (const permission of results[0].permission_groups) {
            if (permission.permission_group_id === permissionItem.source.permission_group_id) {
              permissionItem.isChecked = true;
              break;
            }
          }
          this.permissionList.push(permissionItem);
        }
      }
      );
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  public onPermissionChange(event: any) {
    const permission = event[1];
    permission.isChecked = event[0] === CheckboxState.checked ? true : false;
    this.dirty = event[2];
  }

  public onEditEmployeeFormSubmit() {


    if (!this.dataService.generateAndCheckParamsValid(this.userParams, this.permissionList)) {
      return;
    }

    this.httpService.requestEditUser(this.userParams, this.username).subscribe(() => {
      this.globalService.promptBox.open('编辑成功！', () => {
        if (this.username === this.authService.user.username) {
          // 如果编辑的是当前登录人的权限,需要刷新权限
          this.authService.refreshAuthorize();
        }
        this.editSuccess = true;
        this.dataCacheService.clear();
        this.navigated();
      });
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        this.globalService.promptBox.open('参数错误或无效，请重试！');
      }
    });
  }

  public onCancelBtnClick() {
    this.navigated();
  }

  private navigated() {
    if (this.fromPath === 'detail') {
      this.router.navigate(['../../detail', this.username], { relativeTo: this.route });
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  public canDeactivate(): boolean {
    return this.editSuccess || !this.editEmployeeForm || !this.editEmployeeForm.dirty && !this.dirty;
  }
}
