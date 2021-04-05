import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

/*
 * 面包屑
 * 有1才能有2,有1可没2,不能跳着来
 * */
@Component({
  selector: 'app-crumb',
  templateUrl: './crumb.component.html',
  styleUrls: ['./crumb.component.css']
})
export class CrumbComponent {

  @Input() public level1Name: string;
  @Input() public level1RelativePath: string;
  @Input() public level1AbsolutePath: string;
  @Input() public level1RelativePathParams: any;

  public get level1Valid(): boolean {
    return (this.level1AbsolutePath !== null && this.level1AbsolutePath !== undefined)
      || (this.level1RelativePath !== null && this.level1RelativePath !== undefined);
  }

  @Input() public level2Name: string;
  @Input() public level2RelativePath: string;
  @Input() public level2AbsolutePath: string;
  @Input() public level2RelativePathParams: any;

  @Input() public level3Name: string;
  @Input() public level3RelativePath: string;
  @Input() public level3AbsolutePath: string;
  @Input() public level3RelativePathParams: any;

  @Input() public level4Name: string;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  public onLevel1LabelClick() {
    if (this.level1RelativePath !== null && this.level1RelativePath !== undefined) {
      if (this.level1RelativePathParams !== null && this.level1RelativePathParams !== undefined) {
        this.router.navigate([this.level1RelativePath, this.level1RelativePathParams], { relativeTo: this.route });
      } else {
        this.router.navigate([this.level1RelativePath], { relativeTo: this.route });
      }
    } else {
      this.router.navigateByUrl(this.level1AbsolutePath);
    }
  }

  public onLevel2LabelClick() {
    if (this.level2RelativePath !== null && this.level2RelativePath !== undefined) {
      if (this.level2RelativePathParams !== null && this.level2RelativePathParams !== undefined) {
        this.router.navigate([this.level2RelativePath, this.level2RelativePathParams], { relativeTo: this.route });
      } else {
        this.router.navigate([this.level2RelativePath], { relativeTo: this.route });
      }
    } else {
      this.router.navigateByUrl(this.level2AbsolutePath);
    }
  }

  public onLevel3LabelClick() {
    if (this.level3RelativePath !== null && this.level3RelativePath !== undefined) {
      if (this.level3RelativePathParams !== null && this.level3RelativePathParams !== undefined) {
        this.router.navigate([this.level3RelativePath, this.level3RelativePathParams], { relativeTo: this.route });
      } else {
        this.router.navigate([this.level3RelativePath], { relativeTo: this.route });
      }
    } else {
      this.router.navigateByUrl(this.level3AbsolutePath);
    }
  }
}
