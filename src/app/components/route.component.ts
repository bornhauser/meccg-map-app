import {Component, Input} from '@angular/core';
import {DataService} from '../services/data.service';
import {CardUtilService} from '../services/card-util.service';
import {AppService} from '../services/app-service';

@Component({
  selector: 'app-route',
  template: `
    <div class="route"
         *ngIf="$data.currentGuiContext_notPersitent.currentJourneyRegions || $data.currentGuiContext_notPersitent.currentJourneySiteTo">
      <div class="journey-region" *ngFor="let card of $data.currentGuiContext_notPersitent.currentJourneyRegions">
        <div class="journey-region-icon"
             [style.background-image]="'url(' + $cardUtil.getRegionIconUrl(card) + ')'"></div>
      </div>
      <div class="journey-site" *ngIf="$data.currentGuiContext_notPersitent.currentJourneySiteTo as card">
        <div class="journey-site-icon"
             [style.background-image]="'url(' + $cardUtil.getSiteIconUrl(card, true) + ')'"></div>
      </div>
      <div class="journey-hazard" *ngIf="$data.currentGuiContext_notPersitent.currentPlayableHazards.length">
        <button class="journey-hazard-icon"
                (click)="$app.openModalReversed = reversed; $app.openHazardCardsModal = true"></button>
      </div>
    </div>
  `,
})

export class RouteComponent {

  @Input() public reversed: boolean = false;

  constructor(
    public $data: DataService,
    public $cardUtil: CardUtilService,
    public $app: AppService,
  ) {

  }
}
