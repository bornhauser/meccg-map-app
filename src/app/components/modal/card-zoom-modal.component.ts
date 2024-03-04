import {Component} from '@angular/core';
import {DataService} from '../../services/data.service';
import {CardType_e} from '../../interfaces/interfaces';

@Component({
  selector: 'app-card-zoom-modal',
  template: `

    <div class="modal-background" *ngIf="$data.zoomCard as card" (click)="$data.openMainMenuModal = false">
      <div class="meccg-card-image"
           [ngClass]="{ '_region': card.type === CardType_e.Region, '_queer': this.$data.isRegionCardQueer(card) }"
           [style.background-image]="'url(' + $data.getCardImageUrl(card) + ')'">
        <div class="meccg-card-inner" (click)="$data.openMainMenuModal = false"></div>
      </div>
    </div>

  `,
})
export class CardZoomModalComponent {
  CardType_e = CardType_e

  constructor(
    public $data: DataService
  ) {
  }
}
