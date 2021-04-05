import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmployeesHttpService, UserSearchParams } from '../employees-http.service';
import { UserEntity } from '../../../core/auth.service';
import { GlobalService } from '../../../core/global.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const PageSize = 15;

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.less'],
})
export class EmployeesListComponent implements OnInit, OnDestroy {

  public searchParams: UserSearchParams = new UserSearchParams();

  public dataList: Array<UserEntity> = [];

  private continueRequestSubscription: Subscription; // linkUrl分页取数

  public pageIndex = 1; // 当前页码

  private linkUrl: string; // 分页URL

  public searchText$ = new Subject<any>();

  public isLoading = false;

  // 获取当前记录总页数
  private get pageCount(): number {
    if (this.dataList.length % PageSize === 0) {
      return this.dataList.length / PageSize;
    }
    return this.dataList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService,
    private employeesHttpService: EmployeesHttpService) {
  }

  public ngOnInit() {
    this.generateUserList();
  }

  public ngOnDestroy() {
    this.searchText$ && this.searchText$.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 初始化列表
  private generateUserList(): void {
    this.isLoading = true;
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestUserListData();
    });
    this.searchText$.next();
  }

  /**请求企业列表 */
  private requestUserListData() {
    this.employeesHttpService.requestUserList(this.searchParams).subscribe(res => {
      this.pageIndex = 1; // 重置页码为第一页
      this.dataList = res.results;
      this.linkUrl = res.linkUrl;
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.pageIndex = 1;
      this.globalService.httpErrorProcess(err);
    });
  }

  // 查询按钮
  public onSearchBtnClick(): void {

    this.searchText$.next();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 重置密码
  public onResetPasswordBtnClick(dataItem: UserEntity) {
    this.globalService.confirmationBox.open('是否确定重置密码，此操作不可逆！', () => {
      this.globalService.confirmationBox.close();
      this.employeesHttpService.requestResetPassword(dataItem.username).subscribe(() => {
        this.globalService.promptBox.open(' 密码重置成功，新密码已下发到员工邮箱！');
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
  }

  // 删除员工
  public onDeleteItemClick(dataItem: UserEntity) {
    this.globalService.confirmationBox.open('确认删除该员工，此操作不可恢复！', () => {
      this.globalService.confirmationBox.close();
      this.employeesHttpService.requestDeleteUser(dataItem.username).subscribe(() => {
        this.searchText$.next();
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }, '删除');
  }

  // 分页
  public onNZPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.employeesHttpService.continueUserList(this.linkUrl).subscribe(res => {
        this.dataList = this.dataList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }
}
