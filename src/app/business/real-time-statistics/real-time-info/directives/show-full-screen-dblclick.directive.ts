import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Input, OnDestroy, OnInit,
  Renderer2, ViewContainerRef
} from '@angular/core';
import { ShowFullScreenComponent } from './show-full-screen/show-full-screen.component';
import { Subscription, timer } from 'rxjs';
import { ScreenHelper } from '../../../../../utils/screen-helper';

@Directive({
  selector: '[appShowFullScreenDblclick]'
})
export class ShowFullScreenDblclickDirective implements OnInit, OnDestroy {

  public componentRef: ComponentRef<ShowFullScreenComponent>;

  private screenSubscription: Subscription;
  private isFullScreen: boolean;

  constructor(private el: ElementRef, private renderer2: Renderer2, public viewContainerRef: ViewContainerRef, private componentFactoryResolver: ComponentFactoryResolver) {
  }

  /* 选择展示全部四块屏或只展示第一块屏 */
  @Input() public appShowFullScreenDblclick: 'all' | 'screen1' = 'all';

  /* 双击全屏 */
  @HostListener('dblclick')
  public ondblclick() {
    this.componentRef.instance.isFullScreen = true;
    timer(1).subscribe(() => {
      ScreenHelper.Instance.requestFullScreen(this.componentRef.instance.fullScreenContainer.nativeElement);
    });
  }

  public ngOnInit() {
    this.loadComponent();
    this.screenSubscription = ScreenHelper.Instance.fullScreen.subscribe(isFullScreen => {
      timer(1).subscribe(() => {
        this.componentRef.instance.isFullScreen = isFullScreen;
      });
    });
  }

  public ngOnDestroy() {
    this.screenSubscription && this.screenSubscription.unsubscribe();
  }

  public loadComponent() {
    this.viewContainerRef.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ShowFullScreenComponent);
    this.componentRef = this.viewContainerRef.createComponent(componentFactory);
    this.componentRef.instance.isAllScreen = !this.appShowFullScreenDblclick || this.appShowFullScreenDblclick === 'all' ? true : false;
  }
}
