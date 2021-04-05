/**
 * Created by zack on 2/2/18.
 */
export class ExpandedMenuItem {

  public animationObj?: any;

  /* 是否可伸展的 */
  public get isExtensible() {
    return !(this.lowerLevels === null || this.lowerLevels === undefined);
  }

  private _isExpanded = false; // 默认不展开
  public set isExpanded(expanded: boolean) {
    if (this._isExpanded === expanded) {
      return;
    }
    this._isExpanded = expanded;
    if (this.isExtensible) {
      if (this.isExpanded) {
        if (this.animationObj !== null && this.animationObj !== undefined) {
          $(this.animationObj).slideDown(250);
          setTimeout(() => {
            this.isDisplay = this.isExpanded;
          }, 200);
        } else {
          this.isDisplay = this.isExpanded;
        }
      } else {
        if (this.animationObj !== undefined) {
          $(this.animationObj).slideUp(200);
          setTimeout(() => {
            this.isDisplay = this.isExpanded;
          }, 150);
        } else {
          this.isDisplay = this.isExpanded;
        }
      }

      this.lowerLevels.forEach((item: ExpandedMenuItem) => {
        if (this.isExpanded === false) {
          if (item.isExtensible && item.isExpanded) {
            // 将子菜单也关闭
            item.isExpanded = false;
          }
        }
      });
    }
  }

  public get isExpanded() {
    return this._isExpanded;
  }

  public isDisplay = false; // 用来同步JQuery展开之后的效果

  private _isSelect = false; // 默认不选中
  public set isSelect(isSelect: boolean) {
    this._isSelect = isSelect;
  }

  public get isSelect(): boolean {
    return this._isSelect;
  }

  public data: ExpandedMenuItemData;
  public upperLevel: ExpandedMenuItem | null;
  public lowerLevels: Array<ExpandedMenuItem> | null;

  constructor(data: ExpandedMenuItemData, upperLevel?: ExpandedMenuItem, lowerLevels?: Array<ExpandedMenuItem>) {
    this.data = data;
    this.upperLevel = upperLevel;
    this.lowerLevels = lowerLevels;
  }

  /* 选择菜单项 返回是否为终极子节点 */
  public select(): boolean {
    if (!this.isExtensible) {
      // 选中项不可展开
      let topMenuItem = this.upperLevel;
      while (topMenuItem !== null && topMenuItem !== undefined) {
        // 如果存在上一级菜单，将上一级菜单展开
        topMenuItem.isExpanded = true;
        topMenuItem = topMenuItem.upperLevel;
      }
      this.isSelect = true;
      return true;
    } else {
      // 选中项可展开
      if (this.isExpanded) {
        // 如果已经展开则关闭
        this.isExpanded = false;
      } else {
        this.isExpanded = true;
        let topMenuItem = this.upperLevel;
        while (topMenuItem !== null && topMenuItem !== undefined) {
          // 如果存在上一级菜单，将上一级菜单展开
          topMenuItem.isExpanded = true;
          topMenuItem = topMenuItem.upperLevel;
        }
      }
      return false;
    }
  }

  public reset() {
    this._isExpanded = false;
    this.isDisplay = false;
    this.isSelect = false;
  }

  /* 获取当前的层级 */
  public getLevel(): number {
    if (this.upperLevel === null || this.upperLevel === undefined) {
      return 1;
    } else {
      return this.upperLevel.getLevel() + 1;
    }
  }
}

export class ExpandedMenuItemData {
  public curPath: string; // 记录当前要进行页面加载的分支路径
  public paths: Array<string> = [];
  public permissionSettings: Array<string> = [];
  public normalIcon: string;
  public isWarning = false;
  public menuName: string;

  constructor(menuName: string) {
    this.menuName = menuName;
  }

  public get menuId(): string {
    return this.menuName + this.paths.toString();
  }
}
