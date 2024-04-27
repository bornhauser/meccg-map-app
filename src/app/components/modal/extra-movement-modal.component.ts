import {Component} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AppService} from '../../services/app-service';
import {ExtraMovement_e, SelectItem} from '../../interfaces/interfaces';

@Component({
  selector: 'app-extra-movement-modal',
  template: `

    <div class="modal-background" (click)="$app.openExtraMovementModal = false;">
      <div class="modal _sub-alignment">
        <div class="modal-scroll-container">
          <div class="modal-scroll-container-content">
            <div class="menu-title">{{ 'app.extraMovement' | translate }}</div>
            <app-select-item [selectItem]="extraMovementSelect"
                             (onChange)="onExtraMovementChange($event)">
            </app-select-item>
          </div>
        </div>
      </div>
    </div>

  `,
})

export class ExtraMovementModalComponent {

  constructor(
    public $data: DataService,
    public $app: AppService,
  ) {
  }

  public extraMovementSelect: SelectItem = {
    available: [ExtraMovement_e.zero, ExtraMovement_e.one, ExtraMovement_e.two],
    selected: this.$data.currentGuiContext_notPersitent.extraMovement,
  }

  public onExtraMovementChange($event: any) {
    this.$data.currentGuiContext_notPersitent.extraMovement = $event?.selected ?? ExtraMovement_e.zero;
    this.$data.refreshCalculations();
    setTimeout(() => {
      this.$app.openExtraMovementModal = false;
    }, 600)
  }
}
