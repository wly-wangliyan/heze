import { Subject } from 'rxjs';
import { LoadingStatus } from '../../utils/common-enums';
import { LinkResponse } from '../core/http.service';
import { debounceTime } from 'rxjs/operators';

export interface SearchAdapter {
  /* 请求检索 */
  requestSearch(): any;
  /* 继续请求分页数据 */
  continueSearch(url: string): any;
  /* 生成并检查参数有效性 */
  generateAndCheckParamsValid(): boolean;
  /* 检索失败处理 */
  searchErrProcess(err: any);
  /**
   * 检索成功处理
   * @param results 结果object列表
   * @param isFuzzySearch 是否为模糊查询
   */
  searchCompleteProcess(results: Array<any>, isFuzzySearch: boolean);
}

/**
 * Created by zack on 22/6/17.
 */
export class SearchAssistant {

  public pageList: Array<Array<any>> = [];

  private currentPageValue = 1;

  public get currentPage(): number {
    return this.currentPageValue;
  }

  private pageSizeValue: number; // 当前所有的table默认显示都是15条
  public get pageSize(): number {
    return this.pageSizeValue;
  }

  public get pageCount(): number {
    return this.pageList.length;
  }

  private hasNext = false;

  private isFuzzy = false; // 是否在模糊查询中，处理模糊与精确并行时数据错误

  private searchAdapter: SearchAdapter;

  private linkUrl: string; // link

  private searchTermStream = new Subject();

  private submitTermStream = new Subject<any>();

  private loadStatus: LoadingStatus = LoadingStatus.none;

  /**
   * 构造函数
   * @param searchAdapter 检索适配器
   * @param pageSize 分页大小默认15条
   */
  constructor(searchAdapter: SearchAdapter, pageSize = 15) {
    this.searchAdapter = searchAdapter;
    this.pageSizeValue = pageSize;

    // 定义模糊查询延迟时间
    this.searchTermStream.pipe(debounceTime(500)).subscribe(() => {
      // 正确性建立在500毫秒能完成一次请求的基础上,可优化,太麻烦,暂时这样就够用 by zwl 2017.7.20
      this.isFuzzy = false;
      this.exactSearch(true);
    });

    this.submitTermStream.pipe(debounceTime(100)).subscribe((submitObject) => {
      // 防止抖动，屏蔽连点查询时的错误效果
      !submitObject.event && this.exactSearch(submitObject.fuzzySearch);
    });
  }

  /**** 公开方法 ****/

  /**
   * 断开连接(解除对页面数据的引用)
   */
  public disconnect() {
    this.searchAdapter = null;
  }

  /**
   * 重新连接到适配器上
   * @param searchAdapter 需要适配的对象
   */
  public connect(searchAdapter: SearchAdapter) {
    this.searchAdapter = searchAdapter;
  }

  /* 分页事件 */
  public pageSelected(event: any): void {
    if (this.currentPage < 1) {
      return;
    }
    if (this.currentPage > this.pageList.length) {
      return;
    }
    this.currentPageValue = event.pageNum;
    this.searchAdapter && this.searchAdapter.searchCompleteProcess(this.getCurrentPageData(), true);
    // this.pageInfo.currentPage+2   --关于当前页后面显示几个页码  --2:显示2个页码
    if (this.hasNext && this.currentPage + 2 > this.pageList.length) {
      // 不考虑翻页时更换查询条件
      this.requestData(true);
    }
  }

  /**
   * 发起查询操作
   * 1.模糊查询不弹出检索为空提示
   * 2.点击查询进行精确查询时弹出提示
   * @param fuzzySearch 是否模糊查询
   * @param event 模糊查询时需要传递页面对象来获取时间（后台操作时可以为空)
   */
  public submitSearch(fuzzySearch: boolean, event?: any) {
    fuzzySearch && event && this.fuzzySearch(event);

    if (this.isFuzzy) {
      // 在模糊时间内不能进行精确查询,防止手动查询与模糊查询并发
      return;
    }

    const submitObject = {
      event: event,
      fuzzySearch: fuzzySearch,
    };
    this.submitTermStream.next(submitObject);
  }

  public reset() {
    this.currentPageValue = 1;
    this.pageList = [];
    this.linkUrl = null;
  }

  /**** 私有方法 ****/

  /* 获取当前页数据 */
  private getCurrentPageData(): Array<any> {
    return this.pageList[this.currentPage - 1] || [];
  }

  /* 模糊查询 */
  private fuzzySearch(event) {
    this.isFuzzy = true;
    this.searchTermStream.next(event.target.value);
  }

  /* 精确查询(不需要联想等待500毫秒的查询) */
  private exactSearch(isFuzzySearch: boolean) {
    if (this.searchAdapter && !this.searchAdapter.generateAndCheckParamsValid()) {
      /* 无效则不发起请求 */
      return;
    }

    this.reset();

    this.requestData(isFuzzySearch);
  }

  /* 请求数据 */
  private requestData(isFuzzySearch: boolean) {

    if (this.loadStatus === LoadingStatus.loading) {
      return;
    }

    this.loadStatus = LoadingStatus.loading;

    const completeProcess = (data: LinkResponse) => {

      for (let j = 0; j < data.results.length; j = j + this.pageSize) {
        this.pageList.push(data.results.slice(j, j + this.pageSize));
      }

      if (data.linkUrl) {
        this.hasNext = true;
        this.linkUrl = data.linkUrl;
      } else {
        this.hasNext = false;
        this.linkUrl = null;
      }

      this.searchAdapter && this.searchAdapter.searchCompleteProcess(this.getCurrentPageData(), isFuzzySearch);
      this.loadStatus = LoadingStatus.succeeded;
    };

    const errorProcess = (err) => {
      this.searchAdapter && this.searchAdapter.searchErrProcess(err);
      this.loadStatus = LoadingStatus.failed;
    };

    if (this.linkUrl) {
      // 使用http时则使用link做分页
      this.searchAdapter && this.searchAdapter.continueSearch(this.linkUrl).subscribe(completeProcess, errorProcess);
    } else {
      this.searchAdapter && this.searchAdapter.requestSearch().subscribe(completeProcess, errorProcess);
    }
  }
}
