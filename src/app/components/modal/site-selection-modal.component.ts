import {Component} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AppService} from '../../services/app-service';

@Component({
  selector: 'app-site-selection-modal',
  template: `

    <div class="modal-background" (click)="$app.openSiteSelectionModal = false">
      <div class="modal _site-selection">
        <div class="modal-scroll-container">
          <div class="site-items">
            <app-site-item *ngFor="let card of $data.currentGuiContext_notPersitent.currentReachableSites"
                           [card]="card"
                           (onClick)="$data.onSiteOrRegionClick(card)">
            </app-site-item>
          </div>
        </div>
      </div>
    </div>

  `,
})

export class SiteSelectionModalComponent {

  constructor(
    public $data: DataService,
    public $app: AppService,
  ) {
  }

}
