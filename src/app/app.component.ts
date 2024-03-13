import {Component} from '@angular/core';
import {DataService} from './services/data.service';
import {AppService} from './services/app-service';

@Component({
  selector: 'app-root',
  template: `

      <div class="root-container"
           [ngClass]="{
         'journey-mode': $data.currentGuiContext_notPersitent.currentJourneySiteFrom,
         '_turned': $app.turnDisplay,
         'open-modal-reversed': $app.openModalReversed,
         }">
          <app-map></app-map>
          <app-header></app-header>
          <app-footer></app-footer>
          <app-site-selection-modal *ngIf="$app.openSiteSelectionModal"></app-site-selection-modal>
          <app-hazard-cards-modal *ngIf="$app.openHazardCardsModal"></app-hazard-cards-modal>
          <app-main-menu-modal *ngIf="$app.openMainMenuModal"></app-main-menu-modal>
          <app-card-zoom-modal *ngIf="$app.zoomCard"></app-card-zoom-modal>
      </div>
  `,
})
export class AppComponent {

  constructor(
    public $data: DataService,
    public $app: AppService
  ) {
    $app.initAppService();
  }
}
