import {Component} from '@angular/core';
import {DataService} from './services/data.service';
import {CardType_e} from './interfaces/interfaces';

@Component({
  selector: 'app-root',
  template: `

    <div class="root" [ngClass]="{'journey-mode': $data.currentSiteFrom}">

      <app-map></app-map>
      <app-header></app-header>
      <app-footer></app-footer>

      <div class="full-screen-card-container" *ngIf="$data.zoomCard as card" (click)="$data.zoomCard = null">
        <div class="meccg-card-image"
             [ngClass]="{ '_region': card.type === CardType_e.Region, '_queer': this.$data.isRegionCardQueer(card) }"
             [style.background-image]="'url(' + $data.getCardImageUrl(card) + ')'">
          <div class="meccg-card-inner"></div>
        </div>
      </div>

      <app-site-selection-modal *ngIf="$data.openSearchSite"></app-site-selection-modal>
    </div>
  `,
})
export class AppComponent {

  CardType_e = CardType_e;

  constructor(
    public $data: DataService
  ) {
  }
}
