import {Component} from '@angular/core';
import 'leaflet.markercluster';
import {DataService} from '../../services/data.service';
import {CardType_e} from '../../interfaces/interfaces';

@Component({
  selector: 'app-card-zoom-modal',
  template: `

    <div class="modal-background" *ngIf="$data.zoomCard as card" (click)="$data.zoomCard = null">
      <div class="meccg-card-image"
           [ngClass]="{ '_region': card.type === CardType_e.Region, '_queer': this.$data.isRegionCardQueer(card) }"
           [style.background-image]="'url(' + $data.getCardImageUrl(card) + ')'">
        <div class="meccg-card-inner"></div>
      </div>
    </div>

  `,
})
export class CardZoomModalComponent {
  CardType_e = CardType_e

  constructor(
    public $data: DataService
  ) {
    console.log('go')
  }
}
