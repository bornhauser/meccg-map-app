import {Component} from '@angular/core';
import {DataService} from '../../services/data.service';
import {CardType_e} from '../../interfaces/interfaces';
import {AppService} from '../../services/app-service';
import {CardUtilService} from '../../services/card-util.service';

@Component({
  selector: 'app-card-zoom-modal',
  template: `

    <div class="modal-background _card-zoom-modal" *ngIf="$app.zoomCard as card"
         (click)="$app.zoomCard = null; $app.haveModalReversed = false;">
      <div class="meccg-card-image"
           [ngClass]="{ '_region': card.type === CardType_e.Region, '_queer': this.$cardUtil.isRegionCardQueer(card) }"
           [style.background-image]="'url(' + $cardUtil.getCardImageUrl(card) + ')'">
        <div class="meccg-card-inner" (click)="$app.openMainMenuModal = false"></div>
      </div>
    </div>

  `,
})
export class CardZoomModalComponent {
  CardType_e = CardType_e

  constructor(
    public $data: DataService,
    public $app: AppService,
    public $cardUtil: CardUtilService,
  ) {
  }
}
