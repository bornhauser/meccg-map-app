import {Component} from '@angular/core';
import {DataService} from '../../services/data.service';
import {CardType_e} from '../../interfaces/interfaces';

@Component({
  selector: 'app-hazard-cards-modal',
  template: `

    <div class="modal-background" (click)="$data.openHazardCardsModal = false; $data.openModalReversed = false;">
      <div class="hazard-cards-modal">
        <div class="modal-scroll-container">
          <div class="hazard-cards">
            <div class="meccg-card-image"
                 *ngFor="let card of $data.currentPlayableHazards"
                 (click)="$event.stopPropagation(); $data.zoomCard = card"
                 [ngClass]="{ '_region': card.type === CardType_e.Region, '_queer': this.$data.isRegionCardQueer(card) }"
                 [style.background-image]="'url(' + $data.getCardImageUrl(card) + ')'">
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
    public $data: DataService
  ) {
  }

  protected readonly CardType_e = CardType_e;
}
