import {Component} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AppService} from '../../services/app-service';
import {CardUtilService} from '../../services/card-util.service';

@Component({
  selector: 'app-region-name-modal',
  template: `

    <div class="modal-background" (click)="$app.openRegionsModal = false; $app.haveModalReversed = false;">
      <div class="modal _region-names">
        <div class="modal-scroll-container">
          <div class="region-names">
            <div class="region-name" *ngFor="let card of $data.currentGuiContext_notPersitent.currentJourneyRegions">
              {{ this.$cardUtil.getCardTitle(card) }}
            </div>
          </div>
        </div>
      </div>
    </div>

  `,
})

export class RegionNamesModalComponent {

  constructor(
    public $data: DataService,
    public $app: AppService,
    public $cardUtil: CardUtilService,
  ) {
  }
}
