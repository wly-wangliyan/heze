import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-beautify-checkbox',
  templateUrl: './beautify-checkbox.component.html',
  styleUrls: ['./beautify-checkbox.component.css']
})
export class BeautifyCheckboxComponent {

  @Input() public value: string;
  @Input() public name: string;
  @Input() public extData: any;
  @Input() public isBlock = false; // 是否需要占满一行

  private _isDisabled = false;
  public get isDisabled(): boolean {
    return this._isDisabled;
  }

  private _dirty = false;
  public get dirty(): boolean {
    return this._dirty;
  }

  @Input()
  public set isDisabled(is_disabled: boolean) {
    this._isDisabled = is_disabled;
  }

  @Input()
  public set checked(checked: boolean) {
    this.currentCheckboxState = checked ? CheckboxState.checked : CheckboxState.unchecked;
  }

  @Output() public checkChange = new EventEmitter();
  public CheckboxState = CheckboxState;
  public currentCheckboxState: CheckboxState;

  public onInputChange() {
    if (this.isDisabled) {
      return;
    }

    this._dirty = true;

    if (this.currentCheckboxState === CheckboxState.unchecked) {
      this.currentCheckboxState = CheckboxState.checked;
    } else if (this.currentCheckboxState === CheckboxState.checked) {
      this.currentCheckboxState = CheckboxState.unchecked;
    }
    this.checkChange.emit([this.currentCheckboxState, this.extData, this.dirty]);
  }

}

export enum CheckboxState {
  checked,
  unchecked,
  disabled
}
