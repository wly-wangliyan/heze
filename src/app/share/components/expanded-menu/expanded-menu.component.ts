import { Component, AfterViewInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { ExpandedMenuItem, ExpandedMenuItemData } from './expanded-menu.model';
import { AuthService } from '../../../core/auth.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';

/* 左侧菜单栏 */

/* 结构有序，添加新项时需要注意 */
@Component({
  selector: 'app-expanded-menu',
  templateUrl: './expanded-menu.component.html',
  styleUrls: ['./expanded-menu.component.css']
})
export class ExpandedMenuComponent implements AfterViewInit {

  public currentSelectedItem: ExpandedMenuItem; // 当前选中的菜单项

  public selectedItem: ExpandedMenuItem; // 选中的终极结点项

  public menuItems: Array<ExpandedMenuItem>;

  // 可跳转的数据集合
  public routeLinkList: Array<ExpandedMenuItemData> = [];

  @ViewChildren('firstLevel') public firstLevels: QueryList<ElementRef>;
  @ViewChildren('secondLevel') public secondLevels: QueryList<ElementRef>;
  @ViewChildren('thirdLevel') public thirdLevels: QueryList<ElementRef>;

  private firstLevelMenuItems: Array<ExpandedMenuItem> = [];
  private secondLevelMenuItems: Array<ExpandedMenuItem> = [];
  private thirdLevelMenuItems: Array<ExpandedMenuItem> = [];

  constructor(private router: Router, public authService: AuthService, private routeMonitorSerivce: RouteMonitorService) {
    this.menuItems = [];
    this.menuItems.push(this.generateRealTimeStatisticsMenu());
    this.menuItems.push(this.generateDataStatisticsMenu());
    this.menuItems.push(this.generateDataRecordsMenu());
    this.menuItems.push(this.generateBasicsMenu());
    this.menuItems.push(this.generateEmployeesMenu());
  }

  /**** 生成侧边栏 ****/

  /* 实时统计 */
  private generateRealTimeStatisticsMenu(): ExpandedMenuItem {
    const menuData = new ExpandedMenuItemData('实时统计');
    menuData.normalIcon = 'menu-icon1';
    menuData.permissionSettings = ['realtime_statistics', 'realtime_info', 'brief_info'];

    const subMenuData1 = new ExpandedMenuItemData('实时信息');
    subMenuData1.paths[0] = '/real-time-statistics/info';
    subMenuData1.permissionSettings = ['realtime_statistics', 'realtime_info', 'brief_info'];
    this.routeLinkList.push(subMenuData1);

    const subMenuData2 = new ExpandedMenuItemData('热力图');
    subMenuData2.paths[0] = '/real-time-statistics/thermodynamic-chart';
    subMenuData2.permissionSettings = ['realtime_statistics'];
    this.routeLinkList.push(subMenuData2);

    const subMenuData3 = new ExpandedMenuItemData('停车场状态');
    subMenuData3.paths[0] = '/real-time-statistics/parking-state';
    subMenuData3.permissionSettings = ['realtime_statistics'];
    this.routeLinkList.push(subMenuData3);

    const menuItem = new ExpandedMenuItem(menuData);
    const subMenuItem1 = new ExpandedMenuItem(subMenuData1, menuItem);
    const subMenuItem2 = new ExpandedMenuItem(subMenuData2, menuItem);
    const subMenuItem3 = new ExpandedMenuItem(subMenuData3, menuItem);
    menuItem.lowerLevels = [subMenuItem1, subMenuItem2, subMenuItem3];
    this.firstLevelMenuItems.push(menuItem);
    this.secondLevelMenuItems.push(subMenuItem1);
    this.secondLevelMenuItems.push(subMenuItem2);
    this.secondLevelMenuItems.push(subMenuItem3);

    return menuItem;
  }

  /* 数据统计 */
  private generateDataStatisticsMenu(): ExpandedMenuItem {
    const menuData = new ExpandedMenuItemData('数据统计');
    menuData.normalIcon = 'menu-icon2';
    menuData.permissionSettings = ['data_statistics'];

    const subMenuData1 = new ExpandedMenuItemData('单日统计');
    subMenuData1.paths[0] = '/data-statistics/period-time';
    subMenuData1.permissionSettings = ['data_statistics'];
    this.routeLinkList.push(subMenuData1);

    const subMenuData2 = new ExpandedMenuItemData('历史统计');
    subMenuData2.paths[0] = '/data-statistics/history';
    subMenuData2.permissionSettings = ['data_statistics'];
    this.routeLinkList.push(subMenuData2);

    const subMenuData4 = new ExpandedMenuItemData('停车场统计');
    subMenuData4.paths[0] = '/data-statistics/parking';
    subMenuData4.permissionSettings = ['data_statistics'];
    this.routeLinkList.push(subMenuData4);

    const menuItem = new ExpandedMenuItem(menuData);
    const subMenuItem1 = new ExpandedMenuItem(subMenuData1, menuItem);
    const subMenuItem2 = new ExpandedMenuItem(subMenuData2, menuItem);
    const subMenuItem4 = new ExpandedMenuItem(subMenuData4, menuItem);

    menuItem.lowerLevels = [subMenuItem1, subMenuItem2, subMenuItem4];
    this.firstLevelMenuItems.push(menuItem);
    this.secondLevelMenuItems.push(subMenuItem1);
    this.secondLevelMenuItems.push(subMenuItem2);
    this.secondLevelMenuItems.push(subMenuItem4);

    return menuItem;
  }

  /* 数据记录 */
  private generateDataRecordsMenu(): ExpandedMenuItem {
    const menuData = new ExpandedMenuItemData('数据记录');
    menuData.normalIcon = 'menu-icon3';
    menuData.permissionSettings = ['data_record'];

    const subMenuData1 = new ExpandedMenuItemData('停车记录');
    subMenuData1.paths[0] = '/records/parking';
    subMenuData1.permissionSettings = ['data_record'];
    this.routeLinkList.push(subMenuData1);

    const subMenuData2 = new ExpandedMenuItemData('上传记录');
    subMenuData2.paths[0] = '/records/upload';
    subMenuData2.permissionSettings = ['data_record'];
    this.routeLinkList.push(subMenuData2);

    const menuItem = new ExpandedMenuItem(menuData);
    const subMenuItem1 = new ExpandedMenuItem(subMenuData1, menuItem);
    const subMenuItem2 = new ExpandedMenuItem(subMenuData2, menuItem);

    menuItem.lowerLevels = [subMenuItem1, subMenuItem2];
    this.firstLevelMenuItems.push(menuItem);
    this.secondLevelMenuItems.push(subMenuItem1);
    this.secondLevelMenuItems.push(subMenuItem2);

    return menuItem;
  }

  /* 基础管理 */
  private generateBasicsMenu(): ExpandedMenuItem {
    const menuData = new ExpandedMenuItemData('基础管理');
    menuData.normalIcon = 'menu-icon6';
    menuData.permissionSettings = ['base'];

    const subMenuData1 = new ExpandedMenuItemData('停车场');
    subMenuData1.paths[0] = '/basics/parkings';
    subMenuData1.permissionSettings = ['base'];
    this.routeLinkList.push(subMenuData1);

    // const subMenuData2 = new ExpandedMenuItemData('物业公司');
    // subMenuData2.paths[0] = '/basics/companies';
    // subMenuData2.permissionSettings = ['base'];
    // this.routeLinkList.push(subMenuData2);
    //
    // const subMenuData3 = new ExpandedMenuItemData('系统厂商');
    // subMenuData3.paths[0] = '/basics/manufacturers';
    // subMenuData3.permissionSettings = ['base'];
    // this.routeLinkList.push(subMenuData3);

    const menuItem = new ExpandedMenuItem(menuData);
    const subMenuItem1 = new ExpandedMenuItem(subMenuData1, menuItem);
    // const subMenuItem2 = new ExpandedMenuItem(subMenuData2, menuItem);
    // const subMenuItem3 = new ExpandedMenuItem(subMenuData3, menuItem);
    // menuItem.lowerLevels = [subMenuItem1, subMenuItem2, subMenuItem3];
    menuItem.lowerLevels = [subMenuItem1];
    this.firstLevelMenuItems.push(menuItem);
    this.secondLevelMenuItems.push(subMenuItem1);
    // this.secondLevelMenuItems.push(subMenuItem2);
    // this.secondLevelMenuItems.push(subMenuItem3);

    return menuItem;
  }

  /* 员工管理 */
  private generateEmployeesMenu(): ExpandedMenuItem {
    const menuData = new ExpandedMenuItemData('员工管理');
    menuData.normalIcon = 'menu-icon7';
    menuData.permissionSettings = ['user'];
    menuData.paths[0] = '/employees';
    this.routeLinkList.push(menuData);
    const menuItem = new ExpandedMenuItem(menuData);
    this.firstLevelMenuItems.push(menuItem);
    return menuItem;
  }

  /* 关联Html元素 */
  private relationHtmlElements() {
    const firstArray = this.firstLevels.toArray();
    const secondArray = this.secondLevels.toArray();
    const thirdArray = this.thirdLevels ? this.thirdLevels.toArray() : [];
    this.firstLevelMenuItems.forEach((item, index) => {
      item.animationObj = firstArray[index].nativeElement;
    });
    this.secondLevelMenuItems.forEach((item, index) => {
      item.animationObj = secondArray[index].nativeElement;
    });
    this.thirdLevelMenuItems.forEach((item, index) => {
      item.animationObj = thirdArray[index].nativeElement;
    });
  }

  public ngAfterViewInit() {
    this.relationHtmlElements();
    this.routeMonitorSerivce.routePathChanged.subscribe(path => {
      this.refreshMenu(path);
    });
    timer(0).subscribe(() => {
      this.refreshMenu(location.pathname);
    });
  }

  /* 重置菜单栏 */
  public reset() {
    if (!(this.currentSelectedItem === null || this.currentSelectedItem === undefined)) {
      let upper = this.currentSelectedItem;
      while (!(upper.upperLevel === null || upper.upperLevel === undefined)) {
        upper = upper.upperLevel;
      }
      upper.reset();
      this.currentSelectedItem = null;
    }
    if (!(this.selectedItem === null || this.selectedItem === undefined)) {
      this.selectedItem.reset();
      this.selectedItem = null;
    }
  }

  public navigatedByMenuItem(menuItem: ExpandedMenuItem) {
    if (menuItem.data.paths[0]) {
      // 存在路径说明子节点而非中间节点
      this.router.navigateByUrl(menuItem.data.paths[0]);
    } else {
      this.select(menuItem);
    }
  }

  /* 选择菜单项 */
  public select(menuItem: ExpandedMenuItem) {
    if (!(this.currentSelectedItem === null || this.currentSelectedItem === undefined)) {

      let topMenuItem, compareMenuItem, leftMenuItem, rightMenuItem, findParent = false;

      /* 此处只考虑了级别为三时的切换显示效果,如果继续叠加,需要改进算法 by zwl 2017.5.8 */
      if (this.currentSelectedItem.getLevel() === menuItem.getLevel()) {
        // 同级
        topMenuItem = this.currentSelectedItem;
        compareMenuItem = menuItem;
        leftMenuItem = this.currentSelectedItem;
        rightMenuItem = menuItem;
      } else if (this.currentSelectedItem.getLevel() > menuItem.getLevel()) {
        topMenuItem = this.currentSelectedItem.upperLevel;
        while (topMenuItem.getLevel() !== menuItem.getLevel()) {
          topMenuItem = topMenuItem.upperLevel;
        }
        compareMenuItem = menuItem;
        leftMenuItem = topMenuItem;
        rightMenuItem = menuItem;
      } else {
        topMenuItem = menuItem.upperLevel;
        while (topMenuItem.getLevel() !== this.currentSelectedItem.getLevel()) {
          topMenuItem = topMenuItem.upperLevel;
        }
        compareMenuItem = this.currentSelectedItem;
        leftMenuItem = this.currentSelectedItem;
        rightMenuItem = topMenuItem;
      }

      if (leftMenuItem.data.menuId === rightMenuItem.data.menuId) {
        findParent = true;
      } else {
        while (leftMenuItem.upperLevel !== null && leftMenuItem.upperLevel !== undefined) {
          leftMenuItem = leftMenuItem.upperLevel;
          rightMenuItem = rightMenuItem.upperLevel;
          if (leftMenuItem.data.menuId === rightMenuItem.data.menuId) {
            // 找到共同祖先
            findParent = true;
          }
        }
      }

      if (findParent) {
        if (topMenuItem.data.menuId !== compareMenuItem.data.menuId) {
          topMenuItem.isExpanded = false;
        }
      } else {
        leftMenuItem.isExpanded = false;
      }
    }

    if (menuItem.select()) {
      // 取消选中
      if (this.selectedItem !== null && this.selectedItem !== undefined) {
        if (this.selectedItem !== menuItem) {
          this.selectedItem.isSelect = false;
        }
      }
      this.selectedItem = menuItem;
    }
    this.currentSelectedItem = menuItem;
  }

  /**
   * 查找菜单项
   * @param menuId 菜单id
   * @returns ExpandedMenuItem
   */
  private findMenuItem(menuId: string): ExpandedMenuItem {
    return this.findItem(menuId, this.menuItems);
  }

  private findItem(menuId: string, menuItems: Array<ExpandedMenuItem>): ExpandedMenuItem {
    for (const menuItem of menuItems) {
      if (menuItem.data.menuId === menuId) {
        return menuItem;
      } else {
        if (menuItem.lowerLevels !== null && menuItem.lowerLevels !== undefined) {
          const findItem = this.findItem(menuId, menuItem.lowerLevels);
          if (findItem !== null && findItem !== undefined) {
            return findItem;
          }
        }
      }
    }
    return null;
  }

  private refreshMenu(path: string) {

    if (path === '/home') {
      // 当回到主页面时重置菜单栏
      this.reset();
      return;
    }

    // 尝试全匹配
    let index = this.routeLinkList.findIndex(element => {
      return -1 !== element.paths.findIndex(ePath => {
        if (ePath === path) {
          element.curPath = ePath;
        } else {
          element.curPath = null;
        }
        return ePath === path;
      });
    });

    // 尝试局部匹配
    if (index === -1) {
      index = this.routeLinkList.findIndex(element => {
        return -1 !== element.paths.findIndex(ePath => {
          if (path.includes(ePath)) {
            element.curPath = path;
          } else {
            element.curPath = null;
          }
          return path.includes(ePath);
        });
      });
    }

    const checkAuthorizationGuide = () => {
      const aIndex = this.routeLinkList.findIndex(element => {
        return this.authService.checkPermissions(element.permissionSettings);
      });
      if (aIndex !== -1) {
        const routeItem = this.routeLinkList[aIndex];
        const menuItem = this.findMenuItem(routeItem.menuId);
        // 跳转到首个授权页面
        this.select(menuItem);
        this.router.navigateByUrl(menuItem.data.paths[0]);
      } else {
        console.log('极端case zwl');
      }
    };

    if (index === -1) {
      // 未找到则尝试跳转到首个授权页面
      checkAuthorizationGuide();
    } else {
      const routeItem = this.routeLinkList[index];
      if (this.authService.checkPermissions(routeItem.permissionSettings)) {
        // 有权限则直接刷新菜单
        const menuItem = this.findMenuItem(routeItem.menuId);
        this.select(menuItem);
      } else {
        // 未授权则尝试跳转到首个授权页面
        checkAuthorizationGuide();
      }
    }
  }
}
