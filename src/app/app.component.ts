import {Component} from '@angular/core';
import {DataService} from './services/data.service';
import {AppService} from './services/app-service';
import {PlayerId_e} from './interfaces/interfaces';

@Component({
  selector: 'app-root',
  template: `

    <div class="root-container"
         [ngClass]="{
         'journey-mode': $data.currentGuiContext_notPersitent.currentJourneySiteFrom,
         'open-modal-reversed': $app.openModalReversed,
         }">
<!--         '_turned': $data.currentGuiContext_persistent.currentPlayer === PlayerId_e.player_2,-->
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

  // PlayerId_e = PlayerId_e;

  constructor(
    public $data: DataService,
    public $app: AppService
  ) {
    $app.initAppService();
  }
}
