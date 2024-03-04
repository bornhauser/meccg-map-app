import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SelectItem} from '../../interfaces/interfaces';

@Component({
  selector: 'app-select-item',
  template: `
    <div class="select-items">
      <div class="select-item" *ngFor="let available of selectItem?.available"
           [ngClass]="{'_selected':  available === selectItem?.selected}"
           (click)="onClick(available, $event)">
        <div class="indicator">
          <div></div>
        </div>
        <div class="label">{{ available}}</div>
      </div>
    </div>
  `,
})

export class SelectItemComponent {
  @Input() selectItem: SelectItem | null = null;
  @Output() onChange = new EventEmitter<SelectItem | null>();

  public onClick(item: any, $event: any) {
    if (this.selectItem) {
      this.selectItem.selected = item;
    }
    this.onChange.emit(this.selectItem);
    $event.stopPropagation();
  }
}
