import {Component} from '@angular/core';
import 'leaflet.markercluster';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-header',
  template: `
    <div class="header">
      <div class="line-1"></div>
      <div class="line-2"></div>
      <div class="header-content" *ngIf="$data.currentRouteRegions">
        <div class="journey-region" *ngFor="let card of $data.currentRouteRegions">
          <div class="journey-region-icon" [style.background-image]="'url(' + $data.getRegionIconUrl(card) + ')'"></div>
        </div>
        <div class="journey-site" *ngIf="$data.currentSiteTo as card">
          <div class="journey-site-icon" [style.background-image]="'url(' + $data.getSiteIconUrl(card, true) + ')'"></div>
        </div>
      </div>
    </div>
  `,
})

export class HeaderComponent {

  constructor(
    public $data: DataService
  ) {

  }

}
