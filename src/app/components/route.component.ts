import {Component, Input} from '@angular/core';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-route',
  template: `
    <div class="route" *ngIf="$data.currentRouteRegions">
      <div class="journey-region" *ngFor="let card of $data.currentRouteRegions">
        <div class="journey-region-icon" [style.background-image]="'url(' + $data.getRegionIconUrl(card) + ')'"></div>
      </div>
      <div class="journey-site" *ngIf="$data.currentSiteTo as card">
        <div class="journey-site-icon"
             [style.background-image]="'url(' + $data.getSiteIconUrl(card, true) + ')'"></div>
      </div>
      <div class="journey-hazard" *ngIf="$data.currentPlayableHazards.length">
        <button class="journey-hazard-icon" (click)="$data.openModalReversed = reversed; $data.openHazardCardsModal = true"></button>
      </div>
    </div>
  `,
})

export class RouteComponent {

  @Input() public reversed: boolean = false;

  constructor(
    public $data: DataService
  ) {

  }
}
