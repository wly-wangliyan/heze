import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-z-photo-select',
  templateUrl: './z-photo-select.component.html',
  styleUrls: ['./z-photo-select.component.css']
})
export class ZPhotoSelectComponent implements OnInit {

  @Input()
  public set imageUrls(imageUrls: Array<string>) {
    if (isNullOrUndefined(imageUrls)) {
      return;
    }
    this.imageList = [];
    imageUrls.forEach(imageUrl => {
      this.imageList.push(new ZPhotoImageEntity(imageUrl));
    });
  }

  @Input() public imageWidth = '88';

  @Input() public imageHeight = '88';

  public get transformLineHeight(): string {
    return (Number(this.imageHeight) - 2).toString();
  }

  @Input() public zoomWidth = '1000';

  @Input() public zoomHeight = '560';

  public get transformZoomLineHeight(): string {
    return (Number(this.zoomHeight) - 36).toString();
  }

  @Input() public hasDeletePicture = false;

  @Input() public hasAddPicture = false;

  @Input() public isShowMinImg = true; // 是否显示小图，默认显示

  @Input() public isCallbackImgIndex = false;

  @Output() public currentPictureIndex = new EventEmitter();

  public imageList: Array<ZPhotoImageEntity> = [];

  private _dirty = false;

  public get dirty(): boolean {
    return this._dirty;
  }

  public currentImgNum = 1;

  @ViewChild('imageModal') public imageModal: ElementRef;

  @ViewChild('zoomPictureModal') public zoomPictureModal: ElementRef;

  constructor(private sanitizer: DomSanitizer) {
  }

  public ngOnInit() {
    this.hasDeletePicture = this.hasDeletePicture;
    this.hasAddPicture = this.hasAddPicture;
  }

  /**
   * 选择本地图片
   * @param event
   * @param fileElement 选择文件的控件，使用后需要手动清空
   */
  public selectPicture(event, fileElement: any) {
    if (event.target.files.length > 0) {
      this._dirty = true;
      const imgUrl = window.URL.createObjectURL(event.target.files[0]);
      const newImage = new ZPhotoImageEntity();
      newImage.sourceFile = event.target.files[0];
      // 将本地图片转为安全地址
      newImage.transformSafeUrl = this.sanitizer.bypassSecurityTrustUrl(imgUrl);
      this.imageList.push(newImage);
      $(fileElement).val('');
    }
  }

  // 删除图片
  public deletePicture(index: any) {
    this._dirty = true;
    this.imageList.splice(index, 1);
  }

  // 放大图片
  public zoomPicture(index: any = 0) {
    if ((!this.hasDeletePicture) && (this.imageList.length > 0)) {
      this.currentImgNum = index + 1;
      setTimeout(() => {
        $(this.zoomPictureModal.nativeElement).css({
          'width': this.zoomWidth + 'px',
          'height': this.zoomHeight + 'px',
          'margin-top': -(Number(this.zoomHeight) / 2) + 'px',
          'margin-left': -(Number(this.zoomWidth) / 2) + 'px'
        });
        $(this.imageModal.nativeElement).modal('show');
      }, 0);
    }
  }

  // 选择查看上一张/下一张图片
  public selectedShowImage(flag) {
    if (flag) {
      if (this.currentImgNum > 1) {
        this.currentImgNum--;
      }
    } else {
      if (this.currentImgNum < this.imageList.length) {
        this.currentImgNum++;
      }
    }
  }

  // 关闭图片查看模态框
  public closeShowZoomPicture() {
    setTimeout(() => {
      $(this.imageModal.nativeElement).modal('hide');
      if (this.isCallbackImgIndex) {
        this.currentPictureIndex.emit({'currentPictureIndex': this.currentImgNum});
      }
    }, 0);
  }
}

export class ZPhotoImageEntity {
  public sourceUrl: string;
  public sourceFile: any;
  public transformSafeUrl: any;

  constructor(sourceUrl?: string) {
    this.sourceUrl = sourceUrl;
  }

  public get showUrl(): string {
    return this.sourceUrl ? this.sourceUrl : this.transformSafeUrl;
  }
}
