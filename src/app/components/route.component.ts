import {Component, Input} from '@angular/core';
import {DataService} from '../services/data.service';
import {CardUtilService} from '../services/card-util.service';
import {AppService} from '../services/app-service';

@Component({
  selector: 'app-route',
  template: `
    <div class="route"
         *ngIf="$data.currentGuiContext_notPersitent.currentJourneyRegions || $data.currentGuiContext_notPersitent.currentJourneySiteTo">
      <div class="journey-icon-container _region"
           *ngFor="let card of $data.currentGuiContext_notPersitent.currentJourneyRegions">
        <div class="spacing"></div>
        <div class="journey-icon _region"
             [style.background-image]="'url(' + $cardUtil.getRegionIconUrl(card) + ')'"></div>
      </div>
      <div class="journey-icon-container" *ngIf="$data.currentGuiContext_notPersitent.currentJourneySiteTo as card">
        <div class="spacing"></div>
        <div class="journey-icon _site"
             [style.background-image]="'url(' + $cardUtil.getSiteIconUrl(card, true) + ')'"></div>
      </div>
      <div class="journey-icon-container" *ngIf="$data.currentGuiContext_notPersitent.currentPlayableHazards.length">
        <div class="spacing"></div>
        <div class="journey-icon _hazard"
                (click)="$app.openModalReversed = reversed; $app.openHazardCardsModal = true">
        </div>
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
