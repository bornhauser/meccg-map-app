import {Component} from '@angular/core';
import 'leaflet.markercluster';
import {DataService} from '../services/data.service';
import {Card_i, CardType_e} from '../interfaces/interfaces';

@Component({
  selector: 'app-footer',
  template: `
    <div class="footer" [ngClass]="{ '_active': $data.currentGuiContext.currentSite }" *ngIf="$data.currentGuiContext.currentSite as card">
      <div class="meccg-card-image"
           [ngClass]="{ '_region': card.type === CardType_e.Region, '_queer': this.$data.isRegionCardQueer(card) }"
           [style.background-image]="'url(' + $data.getImageUrl(card) + ')'">
        <div class="meccg-card-inner"></div>
      </div>
      <div class="footer-meta">
        <div>{{ card.id }}</div>
      </div>
    </div>
  `,
})
export class FooterComponent {

  constructor(
    public $data: DataService
  ) {
    // @ts-ignore
    document['onSiteClick'] = (card: Card_i) => {
      if (card && !this.$data.mapIsDradding) {
        this.$data.currentGuiContext.currentSite = null;
        setTimeout(() => {
          this.$data.currentGuiContext.currentSite = card;
          this.$data.saveCurrentStates();
        }, 200);
      }
    }
    // @ts-ignore
    document['onSiteDoubleClick'] = (card: Card_i) => {
      if (card && !this.$data.mapIsDradding) {
        this.$data.currentGuiContext.currentSite = null;
        setTimeout(() => {
          this.$data.currentGuiContext.currentSite = card;
          this.$data.saveCurrentStates();
        }, 200);
      }
    }
  }

  protected readonly CardType_e = CardType_e;
}
