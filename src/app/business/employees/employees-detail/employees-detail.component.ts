import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../core/global.service';
import { EmployeesHttpService } from '../employees-http.service';
import { ActivatedRoute } from '@angular/router';
import { PermissionItem } from '../employees-data.service';
import { UserEntity } from '../../../core/auth.service';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-employees-detail',
  templateUrl: './employees-detail.component.html',
  styleUrls: ['./employees-detail.component.less']
})
export class EmployeesDetailComponent implements OnInit {

  public permissionList: Array<PermissionItem> = [];

  public username: string;

  public user: UserEntity = new UserEntity();

  constructor(private route: ActivatedRoute,
    private globalService: GlobalService,
    private httpService: EmployeesHttpService) {
    this.route.params.subscribe(params => {
      this.username = params['username'];
    });
  }

  public ngOnInit() {
    // 并发获取用户信息和权限列表
    forkJoin([this.httpService.requestUserInfo(this.username),
    this.globalService.permissionGroups]).subscribe((results: any) => {
      this.user = results[0];
      this.permissionList = [];
      results[1].forEach(group => {
        const permissionItem = new PermissionItem(group);
        // 根据数据中的权限设置权限的选中状态
        for (const permission of results[0].permission_groups) {
          if (permission.permission_group_id === permissionItem.source.permission_group_id) {
            permissionItem.isChecked = true;
            break;
          }
        }
        this.permissionList.push(permissionItem);
      });
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }
}
