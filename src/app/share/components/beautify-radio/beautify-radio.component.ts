import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CheckboxState } from '../beautify-checkbox/beautify-checkbox.component';

@Component({
  selector: 'app-beautify-radio',
  templateUrl: './beautify-radio.component.html',
  styleUrls: ['./beautify-radio.component.css']
})
export class BeautifyRadioComponent {

  @Input() public isBlock = false; // 每个radio是否需要占满一行

  @Input() public beautifyRadioList: Array<BeautifyRadioItem> = [];

  @Output() public checkChange = new EventEmitter();

  public CheckboxState = CheckboxState;

  private _dirty = false;
  public get dirty() {
    return this._dirty;
  }

  public get selectRadio() {
    const findItem = this.beautifyRadioList.find(radioItem => radioItem.state === CheckboxState.checked);
    return findItem;
  }

  public onInputChange(beautifyRadio: BeautifyRadioItem) {
    this.beautifyRadioList.forEach(radioItem => {
      if (radioItem.value === beautifyRadio.value) {
        radioItem.state = CheckboxState.checked;
      } else {
        radioItem.state = CheckboxState.unchecked;
      }
    });
    this._dirty = true;
    this.checkChange.emit(this.selectRadio);
  }
}

export class BeautifyRadioItem {
  public value: string;
  public name: string;
  public state: CheckboxState = CheckboxState.unchecked; // 默认不选中

  constructor(value: string, name: string, isChecked: boolean = false) {
    this.value = value;
    this.name = name;
    this.state = isChecked ? CheckboxState.checked : CheckboxState.unchecked;
  }
}
