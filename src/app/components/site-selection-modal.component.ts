import {Component} from '@angular/core';
import 'leaflet.markercluster';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-site-selection-modal',
  template: `

    <div class="full-screen-card-container" *ngIf="$data.zoomCard as card" (click)="$data.zoomCard = null">
      <div class="site-selection">

        <div class="card-items _journey" *ngIf="$data.currentSiteFrom">
          <app-site-item *ngFor="let card of $data.currentGuiContext.currentReachableRegions"
                         [card]="card"
                         (onClick)="$data.onSiteClick(card)">
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
