import {Component} from '@angular/core';
import {DataService} from '../../services/data.service';
import {CardType_e} from '../../interfaces/interfaces';
import {AppService} from '../../services/app-service';
import {CardUtilService} from '../../services/card-util.service';

@Component({
  selector: 'app-hazard-cards-modal',
  template: `

    <div class="modal-background" (click)="$app.openHazardCardsModal = false; $app.haveModalReversed = false;">
      <div class="modal _hazard-cards">
        <div class="modal-scroll-container">
          <div class="hazard-cards">
            <div class="meccg-card-image"
                 *ngFor="let card of $data.currentGuiContext_notPersitent.currentPlayableHazards"
                 (click)="$event.stopPropagation(); $app.zoomCard = card"
                 [ngClass]="{ '_region': card.type === CardType_e.Region, '_queer': $cardUtil.isRegionCardQueer(card) }"
                 [style.background-image]="'url(' + $cardUtil.getCardImageUrl(card) + ')'">
              <div class="meccg-card-inner"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

  `,
})

export class HazardCardsModalComponent {

  constructor(
    public $data: DataService,
    public $app: AppService,
    public $cardUtil: CardUtilService,
  ) {
  }

  protected readonly CardType_e = CardType_e;
}
