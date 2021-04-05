/**
 * Created by zack on 12/2/18.
 */

/* 当前组件是否可以取消页面跳出(阻止跳到其他页) */
export interface CanDeactivateComponent {
  canDeactivate(): boolean;
}
