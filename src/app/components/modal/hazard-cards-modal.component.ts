import {Component} from '@angular/core';
import {DataService} from '../../services/data.service';
import {CardType_e} from '../../interfaces/interfaces';
import {AppService} from '../../services/app-service';
import {CardUtilService} from '../../services/card-util.service';

@Component({
  selector: 'app-hazard-cards-modal',
  template: `

    <div class="modal-background" (click)="$app.openHazardCardsModal = false; $app.openModalReversed = false;">
      <div class="hazard-cards-modal">
        <div class="modal-scroll-container">
          <div class="hazard-cards">
            <div class="meccg-card-image"
                 *ngFor="let card of $data.currentPlayableHazards"
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
