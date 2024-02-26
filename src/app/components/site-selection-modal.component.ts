import {Component} from '@angular/core';
import 'leaflet.markercluster';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-site-selection-modal',
  template: `

    <div class="full-screen-card-container" (click)="$data.openSearchSite = false">
      <div class="site-selection-modal">
        <div class="modal-scroll-container">
          <app-site-item *ngFor="let card of $data.currentGuiContext.currentReachableSites"
                         [card]="card"
                         (onClick)="$data.onSiteOrRegionClick(card)">
          </app-site-item>
        </div>
      </div>
    </div>

  `,
})

export class SiteSelectionModalComponent {

  constructor(
    public $data: DataService
  ) {
  }
}
