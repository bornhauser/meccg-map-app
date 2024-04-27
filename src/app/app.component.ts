import {Component} from '@angular/core';
import {DataService} from './services/data.service';
import {AppService} from './services/app-service';

@Component({
  selector: 'app-root',
  template: `

    <div class="root-container"
         [ngClass]="{
         'journey-mode': $data.currentGuiContext_notPersitent.currentJourneySiteFrom,
         'open-modal-reversed': $app.haveModalReversed,
         }">
      <app-map></app-map>
      <app-header></app-header>
      <app-footer></app-footer>
      <app-region-name-modal *ngIf="$app.openRegionsModal"></app-region-name-modal>
      <app-site-selection-modal *ngIf="$app.openSiteSelectionModal"></app-site-selection-modal>
      <app-hazard-cards-modal *ngIf="$app.openHazardCardsModal"></app-hazard-cards-modal>
      <app-main-menu-modal *ngIf="$app.openMainMenuModal"></app-main-menu-modal>
      <app-card-zoom-modal *ngIf="$app.zoomCard"></app-card-zoom-modal>
      <app-sub-alignment-select-modal *ngIf="$app.openSubAlignmentModal_1" [key]="1"></app-sub-alignment-select-modal>
      <app-sub-alignment-select-modal *ngIf="$app.openSubAlignmentModal_2" [key]="2"></app-sub-alignment-select-modal>
      <app-extra-movement-modal *ngIf="$app.openExtraMovementModal"></app-extra-movement-modal>
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
